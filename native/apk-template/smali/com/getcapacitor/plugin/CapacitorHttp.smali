.class public Lcom/getcapacitor/plugin/CapacitorHttp;
.super Lcom/getcapacitor/Plugin;
.source "CapacitorHttp.java"


# annotations
.annotation runtime Lcom/getcapacitor/annotation/CapacitorPlugin;
    permissions = {
        .subannotation Lcom/getcapacitor/annotation/Permission;
            alias = "HttpWrite"
            strings = {
                "android.permission.WRITE_EXTERNAL_STORAGE"
            }
        .end subannotation,
        .subannotation Lcom/getcapacitor/annotation/Permission;
            alias = "HttpRead"
            strings = {
                "android.permission.READ_EXTERNAL_STORAGE"
            }
        .end subannotation
    }
.end annotation


# instance fields
.field private final activeRequests:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/Runnable;",
            "Lcom/getcapacitor/PluginCall;",
            ">;"
        }
    .end annotation
.end field

.field private final executor:Ljava/util/concurrent/ExecutorService;


# direct methods
.method static bridge synthetic -$$Nest$fgetactiveRequests(Lcom/getcapacitor/plugin/CapacitorHttp;)Ljava/util/Map;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/plugin/CapacitorHttp;->activeRequests:Ljava/util/Map;

    return-object p0
.end method

.method public constructor <init>()V
    .locals 1

    .line 25
    invoke-direct {p0}, Lcom/getcapacitor/Plugin;-><init>()V

    .line 27
    new-instance v0, Ljava/util/concurrent/ConcurrentHashMap;

    invoke-direct {v0}, Ljava/util/concurrent/ConcurrentHashMap;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/plugin/CapacitorHttp;->activeRequests:Ljava/util/Map;

    .line 28
    invoke-static {}, Ljava/util/concurrent/Executors;->newCachedThreadPool()Ljava/util/concurrent/ExecutorService;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/plugin/CapacitorHttp;->executor:Ljava/util/concurrent/ExecutorService;

    return-void
.end method

.method private http(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V
    .locals 1

    .line 62
    new-instance v0, Lcom/getcapacitor/plugin/CapacitorHttp$1;

    invoke-direct {v0, p0, p1, p2}, Lcom/getcapacitor/plugin/CapacitorHttp$1;-><init>(Lcom/getcapacitor/plugin/CapacitorHttp;Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    .line 76
    iget-object p2, p0, Lcom/getcapacitor/plugin/CapacitorHttp;->executor:Ljava/util/concurrent/ExecutorService;

    invoke-interface {p2}, Ljava/util/concurrent/ExecutorService;->isShutdown()Z

    move-result p2

    if-nez p2, :cond_0

    .line 77
    iget-object p2, p0, Lcom/getcapacitor/plugin/CapacitorHttp;->activeRequests:Ljava/util/Map;

    invoke-interface {p2, v0, p1}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 78
    iget-object p1, p0, Lcom/getcapacitor/plugin/CapacitorHttp;->executor:Ljava/util/concurrent/ExecutorService;

    invoke-interface {p1, v0}, Ljava/util/concurrent/ExecutorService;->submit(Ljava/lang/Runnable;)Ljava/util/concurrent/Future;

    return-void

    .line 80
    :cond_0
    const-string p2, "Failed to execute request - Http Plugin was shutdown"

    invoke-virtual {p1, p2}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;)V

    return-void
.end method


# virtual methods
.method public delete(Lcom/getcapacitor/PluginCall;)V
    .locals 1
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 117
    const-string v0, "DELETE"

    invoke-direct {p0, p1, v0}, Lcom/getcapacitor/plugin/CapacitorHttp;->http(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    return-void
.end method

.method public get(Lcom/getcapacitor/PluginCall;)V
    .locals 1
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 97
    const-string v0, "GET"

    invoke-direct {p0, p1, v0}, Lcom/getcapacitor/plugin/CapacitorHttp;->http(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    return-void
.end method

.method protected handleOnDestroy()V
    .locals 4

    .line 38
    invoke-super {p0}, Lcom/getcapacitor/Plugin;->handleOnDestroy()V

    .line 40
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorHttp;->activeRequests:Ljava/util/Map;

    invoke-interface {v0}, Ljava/util/Map;->entrySet()Ljava/util/Set;

    move-result-object v0

    invoke-interface {v0}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_1

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/util/Map$Entry;

    .line 41
    invoke-interface {v1}, Ljava/util/Map$Entry;->getKey()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/Runnable;

    .line 42
    invoke-interface {v1}, Ljava/util/Map$Entry;->getValue()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/getcapacitor/PluginCall;

    .line 44
    invoke-virtual {v1}, Lcom/getcapacitor/PluginCall;->getData()Lcom/getcapacitor/JSObject;

    move-result-object v2

    const-string v3, "activeCapacitorHttpUrlConnection"

    invoke-virtual {v2, v3}, Lcom/getcapacitor/JSObject;->has(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_0

    .line 47
    :try_start_0
    invoke-virtual {v1}, Lcom/getcapacitor/PluginCall;->getData()Lcom/getcapacitor/JSObject;

    move-result-object v2

    .line 48
    invoke-virtual {v2, v3}, Lcom/getcapacitor/JSObject;->get(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    .line 49
    invoke-virtual {v2}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->disconnect()V

    .line 50
    invoke-virtual {v1}, Lcom/getcapacitor/PluginCall;->getData()Lcom/getcapacitor/JSObject;

    move-result-object v2

    invoke-virtual {v2, v3}, Lcom/getcapacitor/JSObject;->remove(Ljava/lang/String;)Ljava/lang/Object;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 54
    :catch_0
    :cond_0
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/CapacitorHttp;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v2

    invoke-virtual {v2, v1}, Lcom/getcapacitor/Bridge;->releaseCall(Lcom/getcapacitor/PluginCall;)V

    goto :goto_0

    .line 57
    :cond_1
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorHttp;->activeRequests:Ljava/util/Map;

    invoke-interface {v0}, Ljava/util/Map;->clear()V

    .line 58
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorHttp;->executor:Ljava/util/concurrent/ExecutorService;

    invoke-interface {v0}, Ljava/util/concurrent/ExecutorService;->shutdownNow()Ljava/util/List;

    return-void
.end method

.method public isEnabled()Z
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 86
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/CapacitorHttp;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v0

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getConfig()Lcom/getcapacitor/CapConfig;

    move-result-object v0

    const-string v1, "CapacitorHttp"

    invoke-virtual {v0, v1}, Lcom/getcapacitor/CapConfig;->getPluginConfiguration(Ljava/lang/String;)Lcom/getcapacitor/PluginConfig;

    move-result-object v0

    .line 87
    const-string v1, "enabled"

    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Lcom/getcapacitor/PluginConfig;->getBoolean(Ljava/lang/String;Z)Z

    move-result v0

    return v0
.end method

.method public load()V
    .locals 2

    .line 32
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorHttp;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getWebView()Landroid/webkit/WebView;

    move-result-object v0

    const-string v1, "CapacitorHttpAndroidInterface"

    invoke-virtual {v0, p0, v1}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    .line 33
    invoke-super {p0}, Lcom/getcapacitor/Plugin;->load()V

    return-void
.end method

.method public patch(Lcom/getcapacitor/PluginCall;)V
    .locals 1
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 112
    const-string v0, "PATCH"

    invoke-direct {p0, p1, v0}, Lcom/getcapacitor/plugin/CapacitorHttp;->http(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    return-void
.end method

.method public post(Lcom/getcapacitor/PluginCall;)V
    .locals 1
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 102
    const-string v0, "POST"

    invoke-direct {p0, p1, v0}, Lcom/getcapacitor/plugin/CapacitorHttp;->http(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    return-void
.end method

.method public put(Lcom/getcapacitor/PluginCall;)V
    .locals 1
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 107
    const-string v0, "PUT"

    invoke-direct {p0, p1, v0}, Lcom/getcapacitor/plugin/CapacitorHttp;->http(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    return-void
.end method

.method public request(Lcom/getcapacitor/PluginCall;)V
    .locals 1
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    const/4 v0, 0x0

    .line 92
    invoke-direct {p0, p1, v0}, Lcom/getcapacitor/plugin/CapacitorHttp;->http(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    return-void
.end method
