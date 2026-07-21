.class public Lcom/getcapacitor/MessageHandler;
.super Ljava/lang/Object;
.source "MessageHandler.java"


# instance fields
.field private bridge:Lcom/getcapacitor/Bridge;

.field private cordovaPluginManager:Lorg/apache/cordova/PluginManager;

.field private javaScriptReplyProxy:Landroidx/webkit/JavaScriptReplyProxy;

.field private webView:Landroid/webkit/WebView;


# direct methods
.method public static synthetic $r8$lambda$NqeaDFIoN0gw3x9NS3830RcfMfI(Lcom/getcapacitor/MessageHandler;Landroid/webkit/WebView;Landroidx/webkit/WebMessageCompat;Landroid/net/Uri;ZLandroidx/webkit/JavaScriptReplyProxy;)V
    .locals 0

    invoke-direct/range {p0 .. p5}, Lcom/getcapacitor/MessageHandler;->lambda$new$0(Landroid/webkit/WebView;Landroidx/webkit/WebMessageCompat;Landroid/net/Uri;ZLandroidx/webkit/JavaScriptReplyProxy;)V

    return-void
.end method

.method public static synthetic $r8$lambda$Vub3GfX6oCEFJPq_YoWKfFaxYW4(Lcom/getcapacitor/MessageHandler;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    invoke-direct {p0, p1, p2, p3, p4}, Lcom/getcapacitor/MessageHandler;->lambda$callCordovaPluginMethod$2(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method public constructor <init>(Lcom/getcapacitor/Bridge;Landroid/webkit/WebView;Lorg/apache/cordova/PluginManager;)V
    .locals 1

    .line 21
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 22
    iput-object p1, p0, Lcom/getcapacitor/MessageHandler;->bridge:Lcom/getcapacitor/Bridge;

    .line 23
    iput-object p2, p0, Lcom/getcapacitor/MessageHandler;->webView:Landroid/webkit/WebView;

    .line 24
    iput-object p3, p0, Lcom/getcapacitor/MessageHandler;->cordovaPluginManager:Lorg/apache/cordova/PluginManager;

    .line 26
    const-string p3, "WEB_MESSAGE_LISTENER"

    invoke-static {p3}, Landroidx/webkit/WebViewFeature;->isFeatureSupported(Ljava/lang/String;)Z

    move-result p3

    const-string v0, "androidBridge"

    if-eqz p3, :cond_0

    invoke-virtual {p1}, Lcom/getcapacitor/Bridge;->getConfig()Lcom/getcapacitor/CapConfig;

    move-result-object p3

    invoke-virtual {p3}, Lcom/getcapacitor/CapConfig;->isUsingLegacyBridge()Z

    move-result p3

    if-nez p3, :cond_0

    .line 27
    new-instance p3, Lcom/getcapacitor/MessageHandler$$ExternalSyntheticLambda2;

    invoke-direct {p3, p0}, Lcom/getcapacitor/MessageHandler$$ExternalSyntheticLambda2;-><init>(Lcom/getcapacitor/MessageHandler;)V

    .line 36
    :try_start_0
    invoke-virtual {p1}, Lcom/getcapacitor/Bridge;->getAllowedOriginRules()Ljava/util/Set;

    move-result-object p1

    invoke-static {p2, v0, p1, p3}, Landroidx/webkit/WebViewCompat;->addWebMessageListener(Landroid/webkit/WebView;Ljava/lang/String;Ljava/util/Set;Landroidx/webkit/WebViewCompat$WebMessageListener;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 38
    :catch_0
    invoke-virtual {p2, p0, v0}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    :goto_0
    return-void

    .line 41
    :cond_0
    invoke-virtual {p2, p0, v0}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    return-void
.end method

.method private callCordovaPluginMethod(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 7

    .line 153
    iget-object v0, p0, Lcom/getcapacitor/MessageHandler;->bridge:Lcom/getcapacitor/Bridge;

    new-instance v1, Lcom/getcapacitor/MessageHandler$$ExternalSyntheticLambda1;

    move-object v2, p0

    move-object v5, p1

    move-object v3, p2

    move-object v4, p3

    move-object v6, p4

    invoke-direct/range {v1 .. v6}, Lcom/getcapacitor/MessageHandler$$ExternalSyntheticLambda1;-><init>(Lcom/getcapacitor/MessageHandler;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Lcom/getcapacitor/Bridge;->execute(Ljava/lang/Runnable;)V

    return-void
.end method

.method private callPluginMethod(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/getcapacitor/JSObject;)V
    .locals 6

    .line 148
    new-instance v0, Lcom/getcapacitor/PluginCall;

    move-object v1, p0

    move-object v3, p1

    move-object v2, p2

    move-object v4, p3

    move-object v5, p4

    invoke-direct/range {v0 .. v5}, Lcom/getcapacitor/PluginCall;-><init>(Lcom/getcapacitor/MessageHandler;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/getcapacitor/JSObject;)V

    .line 149
    iget-object p1, v1, Lcom/getcapacitor/MessageHandler;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p1, v2, v4, v0}, Lcom/getcapacitor/Bridge;->callPluginMethod(Ljava/lang/String;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V

    return-void
.end method

.method private synthetic lambda$callCordovaPluginMethod$2(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 1

    .line 154
    iget-object v0, p0, Lcom/getcapacitor/MessageHandler;->cordovaPluginManager:Lorg/apache/cordova/PluginManager;

    invoke-virtual {v0, p1, p2, p3, p4}, Lorg/apache/cordova/PluginManager;->exec(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method static synthetic lambda$legacySendResponseMessage$1(Landroid/webkit/WebView;Ljava/lang/String;)V
    .locals 1

    const/4 v0, 0x0

    .line 144
    invoke-virtual {p0, p1, v0}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    return-void
.end method

.method private synthetic lambda$new$0(Landroid/webkit/WebView;Landroidx/webkit/WebMessageCompat;Landroid/net/Uri;ZLandroidx/webkit/JavaScriptReplyProxy;)V
    .locals 0

    if-eqz p4, :cond_0

    .line 29
    invoke-virtual {p2}, Landroidx/webkit/WebMessageCompat;->getData()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p0, p1}, Lcom/getcapacitor/MessageHandler;->postMessage(Ljava/lang/String;)V

    .line 30
    iput-object p5, p0, Lcom/getcapacitor/MessageHandler;->javaScriptReplyProxy:Landroidx/webkit/JavaScriptReplyProxy;

    return-void

    .line 32
    :cond_0
    const-string p1, "Plugin execution is allowed in Main Frame only"

    invoke-static {p1}, Lcom/getcapacitor/Logger;->warn(Ljava/lang/String;)V

    return-void
.end method

.method private legacySendResponseMessage(Lcom/getcapacitor/PluginResult;)V
    .locals 2

    .line 142
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "window.Capacitor.fromNative("

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p1}, Lcom/getcapacitor/PluginResult;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    const-string v0, ")"

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    .line 143
    iget-object v0, p0, Lcom/getcapacitor/MessageHandler;->webView:Landroid/webkit/WebView;

    .line 144
    new-instance v1, Lcom/getcapacitor/MessageHandler$$ExternalSyntheticLambda0;

    invoke-direct {v1, v0, p1}, Lcom/getcapacitor/MessageHandler$$ExternalSyntheticLambda0;-><init>(Landroid/webkit/WebView;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->post(Ljava/lang/Runnable;)Z

    return-void
.end method


# virtual methods
.method public postMessage(Ljava/lang/String;)V
    .locals 10
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    const-string v0, "To native (Capacitor plugin): callbackId: "

    const-string v1, "To native (Cordova plugin): callbackId: "

    const-string v2, "JavaScript Error: "

    .line 54
    :try_start_0
    new-instance v3, Lcom/getcapacitor/JSObject;

    invoke-direct {v3, p1}, Lcom/getcapacitor/JSObject;-><init>(Ljava/lang/String;)V

    .line 56
    const-string v4, "type"

    invoke-virtual {v3, v4}, Lcom/getcapacitor/JSObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    const/4 v5, 0x1

    const/4 v6, 0x0

    if-eqz v4, :cond_0

    move v7, v5

    goto :goto_0

    :cond_0
    move v7, v6

    :goto_0
    if-eqz v7, :cond_1

    .line 59
    const-string v8, "cordova"

    invoke-virtual {v4, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_1

    move v8, v5

    goto :goto_1

    :cond_1
    move v8, v6

    :goto_1
    if-eqz v7, :cond_2

    .line 60
    const-string v7, "js.error"

    invoke-virtual {v4, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_2

    move v4, v5

    goto :goto_2

    :cond_2
    move v4, v6

    .line 62
    :goto_2
    const-string v7, "callbackId"

    invoke-virtual {v3, v7}, Lcom/getcapacitor/JSObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 64
    const-string v9, "Plugin"

    if-eqz v8, :cond_3

    .line 65
    :try_start_1
    const-string p1, "service"

    invoke-virtual {v3, p1}, Lcom/getcapacitor/JSObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    .line 66
    const-string v0, "action"

    invoke-virtual {v3, v0}, Lcom/getcapacitor/JSObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 67
    const-string v2, "actionArgs"

    invoke-virtual {v3, v2}, Lcom/getcapacitor/JSObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 69
    new-array v3, v5, [Ljava/lang/String;

    aput-object v9, v3, v6

    .line 70
    invoke-static {v3}, Lcom/getcapacitor/Logger;->tags([Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v4, ", service: "

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v4, ", action: "

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v4, ", actionArgs: "

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    .line 69
    invoke-static {v3, v1}, Lcom/getcapacitor/Logger;->verbose(Ljava/lang/String;Ljava/lang/String;)V

    .line 81
    invoke-direct {p0, v7, p1, v0, v2}, Lcom/getcapacitor/MessageHandler;->callCordovaPluginMethod(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void

    :cond_3
    if-eqz v4, :cond_4

    .line 83
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-static {p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    return-void

    .line 85
    :cond_4
    const-string p1, "pluginId"

    invoke-virtual {v3, p1}, Lcom/getcapacitor/JSObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    .line 86
    const-string v1, "methodName"

    invoke-virtual {v3, v1}, Lcom/getcapacitor/JSObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 87
    const-string v2, "options"

    new-instance v4, Lcom/getcapacitor/JSObject;

    invoke-direct {v4}, Lcom/getcapacitor/JSObject;-><init>()V

    invoke-virtual {v3, v2, v4}, Lcom/getcapacitor/JSObject;->getJSObject(Ljava/lang/String;Lcom/getcapacitor/JSObject;)Lcom/getcapacitor/JSObject;

    move-result-object v2

    .line 89
    new-array v3, v5, [Ljava/lang/String;

    aput-object v9, v3, v6

    .line 90
    invoke-static {v3}, Lcom/getcapacitor/Logger;->tags([Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v4, ", pluginId: "

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v4, ", methodName: "

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 89
    invoke-static {v3, v0}, Lcom/getcapacitor/Logger;->verbose(Ljava/lang/String;Ljava/lang/String;)V

    .line 94
    invoke-direct {p0, v7, p1, v1, v2}, Lcom/getcapacitor/MessageHandler;->callPluginMethod(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/getcapacitor/JSObject;)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    return-void

    :catch_0
    move-exception p1

    .line 97
    const-string v0, "Post message error:"

    invoke-static {v0, p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/Throwable;)V

    return-void
.end method

.method public sendResponseMessage(Lcom/getcapacitor/PluginCall;Lcom/getcapacitor/PluginResult;Lcom/getcapacitor/PluginResult;)V
    .locals 4

    const-string v0, "Sending plugin error: "

    .line 103
    :try_start_0
    new-instance v1, Lcom/getcapacitor/PluginResult;

    invoke-direct {v1}, Lcom/getcapacitor/PluginResult;-><init>()V

    .line 104
    const-string v2, "save"

    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->isKeptAlive()Z

    move-result v3

    invoke-virtual {v1, v2, v3}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Z)Lcom/getcapacitor/PluginResult;

    .line 105
    const-string v2, "callbackId"

    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->getCallbackId()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/PluginResult;

    .line 106
    const-string v2, "pluginId"

    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->getPluginId()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/PluginResult;

    .line 107
    const-string v2, "methodName"

    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->getMethodName()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/PluginResult;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 109
    const-string v2, "success"

    if-eqz p3, :cond_0

    const/4 p2, 0x0

    .line 111
    :try_start_1
    invoke-virtual {v1, v2, p2}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Z)Lcom/getcapacitor/PluginResult;

    .line 112
    const-string p2, "error"

    invoke-virtual {v1, p2, p3}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Lcom/getcapacitor/PluginResult;)Lcom/getcapacitor/PluginResult;

    .line 113
    new-instance p2, Ljava/lang/StringBuilder;

    invoke-direct {p2, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1}, Lcom/getcapacitor/PluginResult;->toString()Ljava/lang/String;

    move-result-object p3

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-static {p2}, Lcom/getcapacitor/Logger;->debug(Ljava/lang/String;)V

    goto :goto_0

    :cond_0
    const/4 p3, 0x1

    .line 115
    invoke-virtual {v1, v2, p3}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Z)Lcom/getcapacitor/PluginResult;

    if-eqz p2, :cond_1

    .line 117
    const-string p3, "data"

    invoke-virtual {v1, p3, p2}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Lcom/getcapacitor/PluginResult;)Lcom/getcapacitor/PluginResult;

    .line 121
    :cond_1
    :goto_0
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->getCallbackId()Ljava/lang/String;

    move-result-object p2

    const-string p3, "-1"

    invoke-virtual {p2, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p2

    if-nez p2, :cond_4

    .line 123
    iget-object p2, p0, Lcom/getcapacitor/MessageHandler;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p2}, Lcom/getcapacitor/Bridge;->getConfig()Lcom/getcapacitor/CapConfig;

    move-result-object p2

    invoke-virtual {p2}, Lcom/getcapacitor/CapConfig;->isUsingLegacyBridge()Z

    move-result p2

    if-eqz p2, :cond_2

    .line 124
    invoke-direct {p0, v1}, Lcom/getcapacitor/MessageHandler;->legacySendResponseMessage(Lcom/getcapacitor/PluginResult;)V

    goto :goto_1

    .line 125
    :cond_2
    const-string p2, "WEB_MESSAGE_LISTENER"

    invoke-static {p2}, Landroidx/webkit/WebViewFeature;->isFeatureSupported(Ljava/lang/String;)Z

    move-result p2

    if-eqz p2, :cond_3

    iget-object p2, p0, Lcom/getcapacitor/MessageHandler;->javaScriptReplyProxy:Landroidx/webkit/JavaScriptReplyProxy;

    if-eqz p2, :cond_3

    .line 126
    invoke-virtual {v1}, Lcom/getcapacitor/PluginResult;->toString()Ljava/lang/String;

    move-result-object p3

    invoke-virtual {p2, p3}, Landroidx/webkit/JavaScriptReplyProxy;->postMessage(Ljava/lang/String;)V

    goto :goto_1

    .line 128
    :cond_3
    invoke-direct {p0, v1}, Lcom/getcapacitor/MessageHandler;->legacySendResponseMessage(Lcom/getcapacitor/PluginResult;)V

    goto :goto_1

    .line 131
    :cond_4
    iget-object p2, p0, Lcom/getcapacitor/MessageHandler;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p2}, Lcom/getcapacitor/Bridge;->getApp()Lcom/getcapacitor/App;

    move-result-object p2

    invoke-virtual {p2, v1}, Lcom/getcapacitor/App;->fireRestoredResult(Lcom/getcapacitor/PluginResult;)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    goto :goto_1

    :catch_0
    move-exception p2

    .line 134
    new-instance p3, Ljava/lang/StringBuilder;

    const-string v0, "sendResponseMessage: error: "

    invoke-direct {p3, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p3, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-static {p2}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    .line 136
    :goto_1
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->isKeptAlive()Z

    move-result p2

    if-nez p2, :cond_5

    .line 137
    iget-object p2, p0, Lcom/getcapacitor/MessageHandler;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p1, p2}, Lcom/getcapacitor/PluginCall;->release(Lcom/getcapacitor/Bridge;)V

    :cond_5
    return-void
.end method
