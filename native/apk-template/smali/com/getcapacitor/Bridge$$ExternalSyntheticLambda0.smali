.class public final synthetic Lcom/getcapacitor/Bridge$$ExternalSyntheticLambda0;
.super Ljava/lang/Object;
.source "D8$$SyntheticClass"

# interfaces
.implements Ljava/lang/Runnable;


# instance fields
.field public final synthetic f$0:Lcom/getcapacitor/Bridge;

.field public final synthetic f$1:Lcom/getcapacitor/PluginHandle;

.field public final synthetic f$2:Ljava/lang/String;

.field public final synthetic f$3:Lcom/getcapacitor/PluginCall;


# direct methods
.method public synthetic constructor <init>(Lcom/getcapacitor/Bridge;Lcom/getcapacitor/PluginHandle;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V
    .locals 0

    .line 0
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/getcapacitor/Bridge$$ExternalSyntheticLambda0;->f$0:Lcom/getcapacitor/Bridge;

    iput-object p2, p0, Lcom/getcapacitor/Bridge$$ExternalSyntheticLambda0;->f$1:Lcom/getcapacitor/PluginHandle;

    iput-object p3, p0, Lcom/getcapacitor/Bridge$$ExternalSyntheticLambda0;->f$2:Ljava/lang/String;

    iput-object p4, p0, Lcom/getcapacitor/Bridge$$ExternalSyntheticLambda0;->f$3:Lcom/getcapacitor/PluginCall;

    return-void
.end method


# virtual methods
.method public final run()V
    .locals 4

    .line 0
    iget-object v0, p0, Lcom/getcapacitor/Bridge$$ExternalSyntheticLambda0;->f$0:Lcom/getcapacitor/Bridge;

    iget-object v1, p0, Lcom/getcapacitor/Bridge$$ExternalSyntheticLambda0;->f$1:Lcom/getcapacitor/PluginHandle;

    iget-object v2, p0, Lcom/getcapacitor/Bridge$$ExternalSyntheticLambda0;->f$2:Ljava/lang/String;

    iget-object v3, p0, Lcom/getcapacitor/Bridge$$ExternalSyntheticLambda0;->f$3:Lcom/getcapacitor/PluginCall;

    invoke-static {v0, v1, v2, v3}, Lcom/getcapacitor/Bridge;->$r8$lambda$FNYM7cvgeBk0k8YXQH7M96Mrf-c(Lcom/getcapacitor/Bridge;Lcom/getcapacitor/PluginHandle;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V

    return-void
.end method
