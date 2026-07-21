.class public final Landroidx/activity/Api36Impl;
.super Ljava/lang/Object;
.source "BackEventCompat.kt"


# annotations
.annotation runtime Lkotlin/Metadata;
    d1 = {
        "\u0000(\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\u0008\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0007\n\u0002\u0008\u0003\n\u0002\u0010\u0008\n\u0000\n\u0002\u0010\t\n\u0002\u0008\u0002\u0008\u00c1\u0002\u0018\u00002\u00020\u0001B\t\u0008\u0002\u00a2\u0006\u0004\u0008\u0002\u0010\u0003J.\u0010\u0004\u001a\u00020\u00052\u0006\u0010\u0006\u001a\u00020\u00072\u0006\u0010\u0008\u001a\u00020\u00072\u0006\u0010\t\u001a\u00020\u00072\u0006\u0010\n\u001a\u00020\u000b2\u0006\u0010\u000c\u001a\u00020\rJ\u000e\u0010\u000c\u001a\u00020\r2\u0006\u0010\u000e\u001a\u00020\u0005\u00a8\u0006\u000f"
    }
    d2 = {
        "Landroidx/activity/Api36Impl;",
        "",
        "<init>",
        "()V",
        "createOnBackEvent",
        "Landroid/window/BackEvent;",
        "touchX",
        "",
        "touchY",
        "progress",
        "swipeEdge",
        "",
        "frameTimeMillis",
        "",
        "backEvent",
        "activity_release"
    }
    k = 0x1
    mv = {
        0x2,
        0x0,
        0x0
    }
    xi = 0x30
.end annotation


# static fields
.field public static final INSTANCE:Landroidx/activity/Api36Impl;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    new-instance v0, Landroidx/activity/Api36Impl;

    invoke-direct {v0}, Landroidx/activity/Api36Impl;-><init>()V

    sput-object v0, Landroidx/activity/Api36Impl;->INSTANCE:Landroidx/activity/Api36Impl;

    return-void
.end method

.method private constructor <init>()V
    .locals 0

    .line 122
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public final createOnBackEvent(FFFIJ)Landroid/window/BackEvent;
    .locals 7

    .line 130
    new-instance v0, Landroid/window/BackEvent;

    move v1, p1

    move v2, p2

    move v3, p3

    move v4, p4

    move-wide v5, p5

    invoke-direct/range {v0 .. v6}, Landroid/window/BackEvent;-><init>(FFFIJ)V

    return-object v0
.end method

.method public final frameTimeMillis(Landroid/window/BackEvent;)J
    .locals 2

    const-string v0, "backEvent"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 132
    invoke-virtual {p1}, Landroid/window/BackEvent;->getFrameTimeMillis()J

    move-result-wide v0

    return-wide v0
.end method
