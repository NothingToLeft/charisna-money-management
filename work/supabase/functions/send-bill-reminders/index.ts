import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@example.com";
const CRON_SECRET = Deno.env.get("CRON_SECRET") || "";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

function baseResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value || "00";
  return {
    date: `${value("year")}-${value("month")}-${value("day")}`,
    hour: Number(value("hour")),
    minute: Number(value("minute")),
  };
}

function dayDifference(fromDate: string, toDate: string) {
  const from = Date.parse(`${fromDate}T00:00:00Z`);
  const to = Date.parse(`${toDate}T00:00:00Z`);
  return Math.round((to - from) / 86_400_000);
}

function timeMatches(nowHour: number, nowMinute: number, notificationTime: string) {
  const [hour, minute] = notificationTime.slice(0, 5).split(":").map(Number);
  const nowTotal = nowHour * 60 + nowMinute;
  const targetTotal = hour * 60 + minute;
  return Math.abs(nowTotal - targetTotal) <= 14;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await request.json().catch(() => ({}));
    const authHeader = request.headers.get("Authorization") || "";
    const cronHeader = request.headers.get("x-cron-secret") || "";
    const serviceClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let targetUserId: string | null = null;
    let testMode = Boolean(body.test);

    if (testMode) {
      const userClient = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await userClient.auth.getUser();
      if (error || !data.user) return baseResponse({ error: "Unauthorized" }, 401);
      targetUserId = data.user.id;
    } else if (!CRON_SECRET || cronHeader !== CRON_SECRET) {
      return baseResponse({ error: "Invalid cron secret" }, 401);
    }

    if (testMode && targetUserId) {
      const { data: subscriptions, error } = await serviceClient
        .from("charisna_push_subscriptions")
        .select("endpoint,p256dh,auth")
        .eq("user_id", targetUserId)
        .eq("enabled", true);
      if (error) throw error;
      let sent = 0;
      for (const subscription of subscriptions || []) {
        try {
          await webpush.sendNotification(
            { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
            JSON.stringify({
              title: "Tes CHARISNA Money Management",
              body: "Push notification berhasil tersambung di perangkat ini.",
              tag: `charisna-test-${Date.now()}`,
              url: "/?open=reminders",
            }),
          );
          sent += 1;
        } catch (error: any) {
          if ([404, 410].includes(error?.statusCode)) {
            await serviceClient.from("charisna_push_subscriptions").delete().eq("endpoint", subscription.endpoint);
          }
        }
      }
      return baseResponse({ ok: true, sent });
    }

    const { data: schedules, error: scheduleError } = await serviceClient
      .from("charisna_bill_reminder_schedules")
      .select("*")
      .eq("enabled", true);
    if (scheduleError) throw scheduleError;

    let delivered = 0;
    let skipped = 0;
    let failed = 0;

    for (const schedule of schedules || []) {
      const now = zonedParts(new Date(), schedule.timezone || "Asia/Jakarta");
      if (!timeMatches(now.hour, now.minute, String(schedule.notification_time || "08:00"))) {
        skipped += 1;
        continue;
      }

      const offset = dayDifference(now.date, schedule.due_date);
      if (!(schedule.reminder_days || []).includes(offset)) {
        skipped += 1;
        continue;
      }

      const { data: existing } = await serviceClient
        .from("charisna_push_delivery_log")
        .select("id")
        .eq("user_id", schedule.user_id)
        .eq("recurring_id", schedule.recurring_id)
        .eq("due_date", schedule.due_date)
        .eq("reminder_offset", offset)
        .maybeSingle();
      if (existing) {
        skipped += 1;
        continue;
      }

      const { data: subscriptions, error: subscriptionError } = await serviceClient
        .from("charisna_push_subscriptions")
        .select("endpoint,p256dh,auth")
        .eq("user_id", schedule.user_id)
        .eq("enabled", true);
      if (subscriptionError) throw subscriptionError;

      let successCount = 0;
      let failureCount = 0;
      const dueText = offset === 0 ? "jatuh tempo hari ini" : offset === 1 ? "jatuh tempo besok" : `jatuh tempo ${offset} hari lagi`;
      const detailed = schedule.privacy_mode === "detailed";
      const bodyText = detailed
        ? `${schedule.title} ${dueText}${schedule.amount !== null ? ` · ${schedule.currency || ""} ${Number(schedule.amount).toLocaleString("id-ID")}` : ""}. Pastikan saldo mencukupi.`
        : `Ada tagihan yang ${dueText}. Buka CHARISNA untuk memeriksa saldo dan detailnya.`;

      for (const subscription of subscriptions || []) {
        try {
          await webpush.sendNotification(
            { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
            JSON.stringify({
              title: detailed ? schedule.title : "Pengingat Tagihan CHARISNA",
              body: bodyText,
              tag: `charisna-${schedule.recurring_id}-${schedule.due_date}-${offset}`,
              url: "/?open=reminders",
              scheduleId: schedule.recurring_id,
              dueDate: schedule.due_date,
              requireInteraction: offset <= 1,
            }),
          );
          successCount += 1;
        } catch (error: any) {
          failureCount += 1;
          if ([404, 410].includes(error?.statusCode)) {
            await serviceClient.from("charisna_push_subscriptions").delete().eq("endpoint", subscription.endpoint);
          }
        }
      }

      await serviceClient.from("charisna_push_delivery_log").insert({
        user_id: schedule.user_id,
        recurring_id: schedule.recurring_id,
        due_date: schedule.due_date,
        reminder_offset: offset,
        success_count: successCount,
        failure_count: failureCount,
      });

      delivered += successCount;
      failed += failureCount;
    }

    return baseResponse({ ok: true, delivered, failed, skipped });
  } catch (error) {
    console.error(error);
    return baseResponse({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
});
