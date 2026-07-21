.class public Lcom/getcapacitor/plugin/CapacitorCookies;
.super Lcom/getcapacitor/Plugin;
.source "CapacitorCookies.java"


# annotations
.annotation runtime Lcom/getcapacitor/annotation/CapacitorPlugin;
.end annotation


# instance fields
.field cookieManager:Lcom/getcapacitor/plugin/CapacitorCookieManager;


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 17
    invoke-direct {p0}, Lcom/getcapacitor/Plugin;-><init>()V

    return-void
.end method

.method static synthetic lambda$getCookies$0(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V
    .locals 10

    .line 50
    invoke-virtual {p1}, Ljava/lang/String;->length()I

    move-result v0

    const/4 v1, 0x1

    sub-int/2addr v0, v1

    invoke-virtual {p1, v1, v0}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object p1

    .line 51
    const-string v0, ";"

    invoke-virtual {p1, v0}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p1

    .line 53
    new-instance v0, Lcom/getcapacitor/JSObject;

    invoke-direct {v0}, Lcom/getcapacitor/JSObject;-><init>()V

    .line 55
    array-length v2, p1

    const/4 v3, 0x0

    move v4, v3

    :goto_0
    if-ge v4, v2, :cond_1

    aget-object v5, p1, v4

    .line 56
    invoke-virtual {v5}, Ljava/lang/String;->length()I

    move-result v6

    if-lez v6, :cond_0

    .line 57
    const-string v6, "="

    const/4 v7, 0x2

    invoke-virtual {v5, v6, v7}, Ljava/lang/String;->split(Ljava/lang/String;I)[Ljava/lang/String;

    move-result-object v5

    .line 59
    array-length v6, v5

    if-ne v6, v7, :cond_0

    .line 60
    aget-object v6, v5, v3

    invoke-virtual {v6}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v6

    .line 61
    aget-object v7, v5, v1

    invoke-virtual {v7}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v7

    .line 63
    :try_start_0
    aget-object v8, v5, v3

    invoke-virtual {v8}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v8

    sget-object v9, Ljava/nio/charset/StandardCharsets;->UTF_8:Ljava/nio/charset/Charset;

    invoke-virtual {v9}, Ljava/nio/charset/Charset;->name()Ljava/lang/String;

    move-result-object v9

    invoke-static {v8, v9}, Ljava/net/URLDecoder;->decode(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    .line 64
    aget-object v5, v5, v1

    invoke-virtual {v5}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v5

    sget-object v8, Ljava/nio/charset/StandardCharsets;->UTF_8:Ljava/nio/charset/Charset;

    invoke-virtual {v8}, Ljava/nio/charset/Charset;->name()Ljava/lang/String;

    move-result-object v8

    invoke-static {v5, v8}, Ljava/net/URLDecoder;->decode(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7
    :try_end_0
    .catch Ljava/io/UnsupportedEncodingException; {:try_start_0 .. :try_end_0} :catch_0

    .line 67
    :catch_0
    invoke-virtual {v0, v6, v7}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/String;)Lcom/getcapacitor/JSObject;

    :cond_0
    add-int/lit8 v4, v4, 0x1

    goto :goto_0

    .line 72
    :cond_1
    invoke-virtual {p0, v0}, Lcom/getcapacitor/PluginCall;->resolve(Lcom/getcapacitor/JSObject;)V

    return-void
.end method


# virtual methods
.method public clearAllCookies(Lcom/getcapacitor/PluginCall;)V
    .locals 1
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 116
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->cookieManager:Lcom/getcapacitor/plugin/CapacitorCookieManager;

    invoke-virtual {v0}, Lcom/getcapacitor/plugin/CapacitorCookieManager;->removeAllCookies()V

    .line 117
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void
.end method

.method public clearCookies(Lcom/getcapacitor/PluginCall;)V
    .locals 7
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 106
    const-string v0, "url"

    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 107
    iget-object v1, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->cookieManager:Lcom/getcapacitor/plugin/CapacitorCookieManager;

    invoke-virtual {v1, v0}, Lcom/getcapacitor/plugin/CapacitorCookieManager;->getCookies(Ljava/lang/String;)[Ljava/net/HttpCookie;

    move-result-object v1

    .line 108
    array-length v2, v1

    const/4 v3, 0x0

    :goto_0
    if-ge v3, v2, :cond_0

    aget-object v4, v1, v3

    .line 109
    iget-object v5, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->cookieManager:Lcom/getcapacitor/plugin/CapacitorCookieManager;

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v4}, Ljava/net/HttpCookie;->getName()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v6, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v6, "=; Expires=Wed, 31 Dec 2000 23:59:59 GMT"

    invoke-virtual {v4, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v5, v0, v4}, Lcom/getcapacitor/plugin/CapacitorCookieManager;->setCookie(Ljava/lang/String;Ljava/lang/String;)V

    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    .line 111
    :cond_0
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void
.end method

.method public deleteCookie(Lcom/getcapacitor/PluginCall;)V
    .locals 4
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 95
    const-string v0, "key"

    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    if-nez v0, :cond_0

    .line 97
    const-string v1, "Must provide key"

    invoke-virtual {p1, v1}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;)V

    .line 99
    :cond_0
    const-string v1, "url"

    invoke-virtual {p1, v1}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 100
    iget-object v2, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->cookieManager:Lcom/getcapacitor/plugin/CapacitorCookieManager;

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v3, "=; Expires=Wed, 31 Dec 2000 23:59:59 GMT"

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v1, v0}, Lcom/getcapacitor/plugin/CapacitorCookieManager;->setCookie(Ljava/lang/String;Ljava/lang/String;)V

    .line 101
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void
.end method

.method public getCookies(Lcom/getcapacitor/PluginCall;)V
    .locals 2
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 49
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->bridge:Lcom/getcapacitor/Bridge;

    new-instance v1, Lcom/getcapacitor/plugin/CapacitorCookies$$ExternalSyntheticLambda0;

    invoke-direct {v1, p1}, Lcom/getcapacitor/plugin/CapacitorCookies$$ExternalSyntheticLambda0;-><init>(Lcom/getcapacitor/PluginCall;)V

    const-string p1, "document.cookie"

    invoke-virtual {v0, p1, v1}, Lcom/getcapacitor/Bridge;->eval(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    return-void
.end method

.method protected handleOnDestroy()V
    .locals 1

    .line 32
    invoke-super {p0}, Lcom/getcapacitor/Plugin;->handleOnDestroy()V

    .line 33
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->cookieManager:Lcom/getcapacitor/plugin/CapacitorCookieManager;

    invoke-virtual {v0}, Lcom/getcapacitor/plugin/CapacitorCookieManager;->removeSessionCookies()V

    return-void
.end method

.method public isEnabled()Z
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 38
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/CapacitorCookies;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v0

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getConfig()Lcom/getcapacitor/CapConfig;

    move-result-object v0

    const-string v1, "CapacitorCookies"

    invoke-virtual {v0, v1}, Lcom/getcapacitor/CapConfig;->getPluginConfiguration(Ljava/lang/String;)Lcom/getcapacitor/PluginConfig;

    move-result-object v0

    .line 39
    const-string v1, "enabled"

    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Lcom/getcapacitor/PluginConfig;->getBoolean(Ljava/lang/String;Z)Z

    move-result v0

    return v0
.end method

.method public load()V
    .locals 4

    .line 23
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getWebView()Landroid/webkit/WebView;

    move-result-object v0

    const-string v1, "CapacitorCookiesAndroidInterface"

    invoke-virtual {v0, p0, v1}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    .line 24
    new-instance v0, Lcom/getcapacitor/plugin/CapacitorCookieManager;

    sget-object v1, Ljava/net/CookiePolicy;->ACCEPT_ALL:Ljava/net/CookiePolicy;

    iget-object v2, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->bridge:Lcom/getcapacitor/Bridge;

    const/4 v3, 0x0

    invoke-direct {v0, v3, v1, v2}, Lcom/getcapacitor/plugin/CapacitorCookieManager;-><init>(Ljava/net/CookieStore;Ljava/net/CookiePolicy;Lcom/getcapacitor/Bridge;)V

    iput-object v0, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->cookieManager:Lcom/getcapacitor/plugin/CapacitorCookieManager;

    .line 25
    invoke-virtual {v0}, Lcom/getcapacitor/plugin/CapacitorCookieManager;->removeSessionCookies()V

    .line 26
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->cookieManager:Lcom/getcapacitor/plugin/CapacitorCookieManager;

    invoke-static {v0}, Ljava/net/CookieHandler;->setDefault(Ljava/net/CookieHandler;)V

    .line 27
    invoke-super {p0}, Lcom/getcapacitor/Plugin;->load()V

    return-void
.end method

.method public setCookie(Lcom/getcapacitor/PluginCall;)V
    .locals 7
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 78
    const-string v0, "key"

    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    if-nez v3, :cond_0

    .line 80
    const-string v0, "Must provide key"

    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;)V

    .line 82
    :cond_0
    const-string v0, "value"

    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    if-nez v4, :cond_1

    .line 84
    const-string v0, "Must provide value"

    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;)V

    .line 86
    :cond_1
    const-string v0, "url"

    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 87
    const-string v0, "expires"

    const-string v1, ""

    invoke-virtual {p1, v0, v1}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    .line 88
    const-string v0, "path"

    const-string v1, "/"

    invoke-virtual {p1, v0, v1}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    .line 89
    iget-object v1, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->cookieManager:Lcom/getcapacitor/plugin/CapacitorCookieManager;

    invoke-virtual/range {v1 .. v6}, Lcom/getcapacitor/plugin/CapacitorCookieManager;->setCookie(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 90
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void
.end method

.method public setCookie(Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 44
    iget-object v0, p0, Lcom/getcapacitor/plugin/CapacitorCookies;->cookieManager:Lcom/getcapacitor/plugin/CapacitorCookieManager;

    invoke-virtual {v0, p1, p2}, Lcom/getcapacitor/plugin/CapacitorCookieManager;->setCookie(Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method
