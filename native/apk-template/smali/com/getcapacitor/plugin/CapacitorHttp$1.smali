.class Lcom/getcapacitor/plugin/CapacitorHttp$1;
.super Ljava/lang/Object;
.source "CapacitorHttp.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/getcapacitor/plugin/CapacitorHttp;->http(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/getcapacitor/plugin/CapacitorHttp;

.field final synthetic val$call:Lcom/getcapacitor/PluginCall;

.field final synthetic val$httpMethod:Ljava/lang/String;


# direct methods
.method constructor <init>(Lcom/getcapacitor/plugin/CapacitorHttp;Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V
    .locals 0
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x8010,
            0x1010,
            0x1010
        }
        names = {
            null,
            null,
            null
        }
    .end annotation

    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 62
    iput-object p1, p0, Lcom/getcapacitor/plugin/CapacitorHttp$1;->this$0:Lcom/getcapacitor/plugin/CapacitorHttp;

    iput-object p2, p0, Lcom/getcapacitor/plugin/CapacitorHttp$1;->val$call:Lcom/getcapacitor/PluginCall;

    iput-object p3, p0, Lcom/getcapacitor/plugin/CapacitorHttp$1;->val$httpMethod:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 4

    .line 66
    :try_start_0
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorHttp$1;->val$call:Lcom/getcapacitor/PluginCall;

    iget-object v1, p0, Lcom/getcapacitor/plugin/CapacitorHttp$1;->val$httpMethod:Ljava/lang/String;

    iget-object v2, p0, Lcom/getcapacitor/plugin/CapacitorHttp$1;->this$0:Lcom/getcapacitor/plugin/CapacitorHttp;

    invoke-virtual {v2}, Lcom/getcapacitor/plugin/CapacitorHttp;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v2

    invoke-static {v0, v1, v2}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->request(Lcom/getcapacitor/PluginCall;Ljava/lang/String;Lcom/getcapacitor/Bridge;)Lcom/getcapacitor/JSObject;

    move-result-object v0

    .line 67
    iget-object v1, p0, Lcom/getcapacitor/plugin/CapacitorHttp$1;->val$call:Lcom/getcapacitor/PluginCall;

    invoke-virtual {v1, v0}, Lcom/getcapacitor/PluginCall;->resolve(Lcom/getcapacitor/JSObject;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 71
    :goto_0
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorHttp$1;->this$0:Lcom/getcapacitor/plugin/CapacitorHttp;

    invoke-static {v0}, Lcom/getcapacitor/plugin/CapacitorHttp;->-$$Nest$fgetactiveRequests(Lcom/getcapacitor/plugin/CapacitorHttp;)Ljava/util/Map;

    move-result-object v0

    invoke-interface {v0, p0}, Ljava/util/Map;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    return-void

    :catchall_0
    move-exception v0

    goto :goto_1

    :catch_0
    move-exception v0

    .line 69
    :try_start_1
    iget-object v1, p0, Lcom/getcapacitor/plugin/CapacitorHttp$1;->val$call:Lcom/getcapacitor/PluginCall;

    invoke-virtual {v0}, Ljava/lang/Exception;->getLocalizedMessage()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3, v0}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;)V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    goto :goto_0

    .line 71
    :goto_1
    iget-object v1, p0, Lcom/getcapacitor/plugin/CapacitorHttp$1;->this$0:Lcom/getcapacitor/plugin/CapacitorHttp;

    invoke-static {v1}, Lcom/getcapacitor/plugin/CapacitorHttp;->-$$Nest$fgetactiveRequests(Lcom/getcapacitor/plugin/CapacitorHttp;)Ljava/util/Map;

    move-result-object v1

    invoke-interface {v1, p0}, Ljava/util/Map;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    .line 72
    throw v0
.end method
