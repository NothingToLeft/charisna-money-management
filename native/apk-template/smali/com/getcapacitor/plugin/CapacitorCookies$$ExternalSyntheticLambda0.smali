.class public final synthetic Lcom/getcapacitor/plugin/CapacitorCookies$$ExternalSyntheticLambda0;
.super Ljava/lang/Object;
.source "D8$$SyntheticClass"

# interfaces
.implements Landroid/webkit/ValueCallback;


# instance fields
.field public final synthetic f$0:Lcom/getcapacitor/PluginCall;


# direct methods
.method public synthetic constructor <init>(Lcom/getcapacitor/PluginCall;)V
    .locals 0

    .line 0
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/getcapacitor/plugin/CapacitorCookies$$ExternalSyntheticLambda0;->f$0:Lcom/getcapacitor/PluginCall;

    return-void
.end method


# virtual methods
.method public final onReceiveValue(Ljava/lang/Object;)V
    .locals 1

    .line 0
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorCookies$$ExternalSyntheticLambda0;->f$0:Lcom/getcapacitor/PluginCall;

    check-cast p1, Ljava/lang/String;

    invoke-static {v0, p1}, Lcom/getcapacitor/plugin/CapacitorCookies;->lambda$getCookies$0(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    return-void
.end method
