.class public Lcom/getcapacitor/WebViewLocalServer;
.super Ljava/lang/Object;
.source "WebViewLocalServer.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/getcapacitor/WebViewLocalServer$PathHandler;,
        Lcom/getcapacitor/WebViewLocalServer$LollipopLazyInputStream;,
        Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;
    }
.end annotation


# static fields
.field private static final capacitorContentStart:Ljava/lang/String; = "/_capacitor_content_"

.field private static final capacitorFileStart:Ljava/lang/String; = "/_capacitor_file_"


# instance fields
.field private final authorities:Ljava/util/ArrayList;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/ArrayList<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private basePath:Ljava/lang/String;

.field private final bridge:Lcom/getcapacitor/Bridge;

.field private final html5mode:Z

.field private isAsset:Z

.field private final jsInjector:Lcom/getcapacitor/JSInjector;

.field private final protocolHandler:Lcom/getcapacitor/AndroidProtocolHandler;

.field private final uriMatcher:Lcom/getcapacitor/UriMatcher;


# direct methods
.method static bridge synthetic -$$Nest$fgetbasePath(Lcom/getcapacitor/WebViewLocalServer;)Ljava/lang/String;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/WebViewLocalServer;->basePath:Ljava/lang/String;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetbridge(Lcom/getcapacitor/WebViewLocalServer;)Lcom/getcapacitor/Bridge;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetisAsset(Lcom/getcapacitor/WebViewLocalServer;)Z
    .locals 0

    iget-boolean p0, p0, Lcom/getcapacitor/WebViewLocalServer;->isAsset:Z

    return p0
.end method

.method static bridge synthetic -$$Nest$fgetprotocolHandler(Lcom/getcapacitor/WebViewLocalServer;)Lcom/getcapacitor/AndroidProtocolHandler;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/WebViewLocalServer;->protocolHandler:Lcom/getcapacitor/AndroidProtocolHandler;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fputisAsset(Lcom/getcapacitor/WebViewLocalServer;Z)V
    .locals 0

    iput-boolean p1, p0, Lcom/getcapacitor/WebViewLocalServer;->isAsset:Z

    return-void
.end method

.method constructor <init>(Landroid/content/Context;Lcom/getcapacitor/Bridge;Lcom/getcapacitor/JSInjector;Ljava/util/ArrayList;Z)V
    .locals 2
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/content/Context;",
            "Lcom/getcapacitor/Bridge;",
            "Lcom/getcapacitor/JSInjector;",
            "Ljava/util/ArrayList<",
            "Ljava/lang/String;",
            ">;Z)V"
        }
    .end annotation

    .line 149
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 150
    new-instance v0, Lcom/getcapacitor/UriMatcher;

    const/4 v1, 0x0

    invoke-direct {v0, v1}, Lcom/getcapacitor/UriMatcher;-><init>(Ljava/lang/Object;)V

    iput-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->uriMatcher:Lcom/getcapacitor/UriMatcher;

    .line 151
    iput-boolean p5, p0, Lcom/getcapacitor/WebViewLocalServer;->html5mode:Z

    .line 152
    new-instance p5, Lcom/getcapacitor/AndroidProtocolHandler;

    invoke-virtual {p1}, Landroid/content/Context;->getApplicationContext()Landroid/content/Context;

    move-result-object p1

    invoke-direct {p5, p1}, Lcom/getcapacitor/AndroidProtocolHandler;-><init>(Landroid/content/Context;)V

    iput-object p5, p0, Lcom/getcapacitor/WebViewLocalServer;->protocolHandler:Lcom/getcapacitor/AndroidProtocolHandler;

    .line 153
    iput-object p4, p0, Lcom/getcapacitor/WebViewLocalServer;->authorities:Ljava/util/ArrayList;

    .line 154
    iput-object p2, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    .line 155
    iput-object p3, p0, Lcom/getcapacitor/WebViewLocalServer;->jsInjector:Lcom/getcapacitor/JSInjector;

    return-void
.end method

.method private createHostingDetails()V
    .locals 6

    .line 631
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->basePath:Ljava/lang/String;

    const/16 v1, 0x2a

    .line 633
    invoke-virtual {v0, v1}, Ljava/lang/String;->indexOf(I)I

    move-result v1

    const/4 v2, -0x1

    if-ne v1, v2, :cond_2

    .line 637
    new-instance v1, Lcom/getcapacitor/WebViewLocalServer$1;

    invoke-direct {v1, p0, v0}, Lcom/getcapacitor/WebViewLocalServer$1;-><init>(Lcom/getcapacitor/WebViewLocalServer;Ljava/lang/String;)V

    .line 678
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->authorities:Ljava/util/ArrayList;

    invoke-virtual {v0}, Ljava/util/ArrayList;->iterator()Ljava/util/Iterator;

    move-result-object v0

    :cond_0
    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_1

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    .line 679
    const-string v3, "http"

    invoke-direct {p0, v3, v1, v2}, Lcom/getcapacitor/WebViewLocalServer;->registerUriForScheme(Ljava/lang/String;Lcom/getcapacitor/WebViewLocalServer$PathHandler;Ljava/lang/String;)V

    .line 680
    const-string v4, "https"

    invoke-direct {p0, v4, v1, v2}, Lcom/getcapacitor/WebViewLocalServer;->registerUriForScheme(Ljava/lang/String;Lcom/getcapacitor/WebViewLocalServer$PathHandler;Ljava/lang/String;)V

    .line 682
    iget-object v5, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v5}, Lcom/getcapacitor/Bridge;->getScheme()Ljava/lang/String;

    move-result-object v5

    .line 683
    invoke-virtual {v5, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_0

    invoke-virtual {v5, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_0

    .line 684
    invoke-direct {p0, v5, v1, v2}, Lcom/getcapacitor/WebViewLocalServer;->registerUriForScheme(Ljava/lang/String;Lcom/getcapacitor/WebViewLocalServer$PathHandler;Ljava/lang/String;)V

    goto :goto_0

    :cond_1
    return-void

    .line 634
    :cond_2
    new-instance v0, Ljava/lang/IllegalArgumentException;

    const-string v1, "assetPath cannot contain the \'*\' character."

    invoke-direct {v0, v1}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    throw v0
.end method

.method private getMimeType(Ljava/lang/String;Ljava/io/InputStream;)Ljava/lang/String;
    .locals 3

    .line 550
    :try_start_0
    invoke-static {p1}, Ljava/net/URLConnection;->guessContentTypeFromName(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_1

    .line 551
    const-string v1, ".js"

    if-eqz v0, :cond_0

    :try_start_1
    invoke-virtual {p1, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_0

    const-string v2, "image/x-icon"

    invoke-virtual {v0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_0

    .line 552
    const-string v2, "We shouldn\'t be here"

    invoke-static {v2}, Lcom/getcapacitor/Logger;->debug(Ljava/lang/String;)V

    goto :goto_0

    :catch_0
    move-exception p2

    goto :goto_2

    :cond_0
    :goto_0
    if-nez v0, :cond_4

    .line 555
    invoke-virtual {p1, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, ".mjs"

    invoke-virtual {p1, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1

    goto :goto_1

    .line 558
    :cond_1
    const-string v1, ".wasm"

    invoke-virtual {p1, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_2

    .line 559
    const-string p1, "application/wasm"

    return-object p1

    .line 561
    :cond_2
    invoke-static {p2}, Ljava/net/URLConnection;->guessContentTypeFromStream(Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object p1

    return-object p1

    .line 557
    :cond_3
    :goto_1
    const-string p1, "application/javascript"
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    return-object p1

    :cond_4
    return-object v0

    :catch_1
    move-exception p2

    const/4 v0, 0x0

    .line 565
    :goto_2
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "Unable to get mime type"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-static {p1, p2}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/Throwable;)V

    return-object v0
.end method

.method private getReasonPhraseFromResponseCode(I)Ljava/lang/String;
    .locals 1

    const/16 v0, 0x64

    if-eq p1, v0, :cond_3

    const/16 v0, 0x65

    if-eq p1, v0, :cond_2

    const/16 v0, 0x190

    if-eq p1, v0, :cond_1

    const/16 v0, 0x191

    if-eq p1, v0, :cond_0

    packed-switch p1, :pswitch_data_0

    packed-switch p1, :pswitch_data_1

    packed-switch p1, :pswitch_data_2

    packed-switch p1, :pswitch_data_3

    .line 263
    const-string p1, "Unknown"

    return-object p1

    .line 262
    :pswitch_0
    const-string p1, "HTTP Version Not Supported"

    return-object p1

    .line 261
    :pswitch_1
    const-string p1, "Gateway Timeout"

    return-object p1

    .line 260
    :pswitch_2
    const-string p1, "Service Unavailable"

    return-object p1

    .line 259
    :pswitch_3
    const-string p1, "Bad Gateway"

    return-object p1

    .line 258
    :pswitch_4
    const-string p1, "Not Implemented"

    return-object p1

    .line 257
    :pswitch_5
    const-string p1, "Internal Server Error"

    return-object p1

    .line 256
    :pswitch_6
    const-string p1, "Gone"

    return-object p1

    .line 255
    :pswitch_7
    const-string p1, "Conflict"

    return-object p1

    .line 254
    :pswitch_8
    const-string p1, "Request Timeout"

    return-object p1

    .line 253
    :pswitch_9
    const-string p1, "Proxy Authentication Required"

    return-object p1

    .line 252
    :pswitch_a
    const-string p1, "Not Acceptable"

    return-object p1

    .line 251
    :pswitch_b
    const-string p1, "Method Not Allowed"

    return-object p1

    .line 250
    :pswitch_c
    const-string p1, "Not Found"

    return-object p1

    .line 249
    :pswitch_d
    const-string p1, "Forbidden"

    return-object p1

    .line 246
    :pswitch_e
    const-string p1, "Not Modified"

    return-object p1

    .line 245
    :pswitch_f
    const-string p1, "See Other"

    return-object p1

    .line 244
    :pswitch_10
    const-string p1, "Found"

    return-object p1

    .line 243
    :pswitch_11
    const-string p1, "Moved Permanently"

    return-object p1

    .line 242
    :pswitch_12
    const-string p1, "Multiple Choices"

    return-object p1

    .line 241
    :pswitch_13
    const-string p1, "Partial Content"

    return-object p1

    .line 240
    :pswitch_14
    const-string p1, "Reset Content"

    return-object p1

    .line 239
    :pswitch_15
    const-string p1, "No Content"

    return-object p1

    .line 238
    :pswitch_16
    const-string p1, "Non-Authoritative Information"

    return-object p1

    .line 237
    :pswitch_17
    const-string p1, "Accepted"

    return-object p1

    .line 236
    :pswitch_18
    const-string p1, "Created"

    return-object p1

    .line 235
    :pswitch_19
    const-string p1, "OK"

    return-object p1

    .line 248
    :cond_0
    const-string p1, "Unauthorized"

    return-object p1

    .line 247
    :cond_1
    const-string p1, "Bad Request"

    return-object p1

    .line 234
    :cond_2
    const-string p1, "Switching Protocols"

    return-object p1

    .line 233
    :cond_3
    const-string p1, "Continue"

    return-object p1

    nop

    :pswitch_data_0
    .packed-switch 0xc8
        :pswitch_19
        :pswitch_18
        :pswitch_17
        :pswitch_16
        :pswitch_15
        :pswitch_14
        :pswitch_13
    .end packed-switch

    :pswitch_data_1
    .packed-switch 0x12c
        :pswitch_12
        :pswitch_11
        :pswitch_10
        :pswitch_f
        :pswitch_e
    .end packed-switch

    :pswitch_data_2
    .packed-switch 0x193
        :pswitch_d
        :pswitch_c
        :pswitch_b
        :pswitch_a
        :pswitch_9
        :pswitch_8
        :pswitch_7
        :pswitch_6
    .end packed-switch

    :pswitch_data_3
    .packed-switch 0x1f4
        :pswitch_5
        :pswitch_4
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private getStatusCode(Ljava/io/InputStream;I)I
    .locals 1

    .line 573
    :try_start_0
    invoke-virtual {p1}, Ljava/io/InputStream;->available()I

    move-result p1
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0

    const/4 v0, -0x1

    if-ne p1, v0, :cond_0

    const/16 p1, 0x194

    return p1

    :cond_0
    return p2

    :catch_0
    const/16 p1, 0x1f4

    return p1
.end method

.method private handleCapacitorHttpRequest(Landroid/webkit/WebResourceRequest;)Landroid/webkit/WebResourceResponse;
    .locals 9
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 268
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v0

    const-string v1, "u"

    invoke-virtual {v0, v1}, Landroid/net/Uri;->getQueryParameter(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 269
    new-instance v1, Ljava/net/URL;

    invoke-direct {v1, v0}, Ljava/net/URL;-><init>(Ljava/lang/String;)V

    .line 270
    new-instance v0, Lcom/getcapacitor/JSObject;

    invoke-direct {v0}, Lcom/getcapacitor/JSObject;-><init>()V

    .line 272
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getRequestHeaders()Ljava/util/Map;

    move-result-object v2

    invoke-interface {v2}, Ljava/util/Map;->entrySet()Ljava/util/Set;

    move-result-object v2

    invoke-interface {v2}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v2

    :goto_0
    invoke-interface {v2}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_0

    invoke-interface {v2}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Ljava/util/Map$Entry;

    .line 273
    invoke-interface {v3}, Ljava/util/Map$Entry;->getKey()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Ljava/lang/String;

    invoke-interface {v3}, Ljava/util/Map$Entry;->getValue()Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Ljava/lang/String;

    invoke-virtual {v0, v4, v3}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/String;)Lcom/getcapacitor/JSObject;

    goto :goto_0

    .line 279
    :cond_0
    const-string v2, "x-cap-user-agent"

    invoke-virtual {v0, v2}, Lcom/getcapacitor/JSObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    if-eqz v3, :cond_1

    .line 281
    const-string v4, "User-Agent"

    invoke-virtual {v0, v4, v3}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/String;)Lcom/getcapacitor/JSObject;

    .line 283
    :cond_1
    invoke-virtual {v0, v2}, Lcom/getcapacitor/JSObject;->remove(Ljava/lang/String;)Ljava/lang/Object;

    .line 285
    new-instance v2, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    invoke-direct {v2}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;-><init>()V

    .line 286
    invoke-virtual {v2, v1}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setUrl(Ljava/net/URL;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v2

    .line 287
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getMethod()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setMethod(Ljava/lang/String;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v2

    .line 288
    invoke-virtual {v2, v0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setHeaders(Lcom/getcapacitor/JSObject;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v0

    .line 289
    invoke-virtual {v0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->openConnection()Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v0

    .line 291
    invoke-virtual {v0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->build()Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    move-result-object v0

    .line 293
    iget-object v2, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-static {v2, v1}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->isDomainExcludedFromSSL(Lcom/getcapacitor/Bridge;Ljava/net/URL;)Ljava/lang/Boolean;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/Boolean;->booleanValue()Z

    move-result v1

    if-nez v1, :cond_2

    .line 294
    iget-object v1, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0, v1}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->setSSLSocketFactory(Lcom/getcapacitor/Bridge;)V

    .line 297
    :cond_2
    invoke-virtual {v0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->connect()V

    .line 301
    new-instance v7, Ljava/util/LinkedHashMap;

    invoke-direct {v7}, Ljava/util/LinkedHashMap;-><init>()V

    .line 302
    invoke-virtual {v0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->getHeaderFields()Ljava/util/Map;

    move-result-object v1

    invoke-interface {v1}, Ljava/util/Map;->entrySet()Ljava/util/Set;

    move-result-object v1

    invoke-interface {v1}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v1

    const/4 v2, 0x0

    move-object v4, v2

    :goto_1
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_6

    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Ljava/util/Map$Entry;

    .line 303
    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5}, Ljava/lang/StringBuilder;-><init>()V

    .line 304
    invoke-interface {v3}, Ljava/util/Map$Entry;->getValue()Ljava/lang/Object;

    move-result-object v6

    check-cast v6, Ljava/util/List;

    invoke-interface {v6}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v6

    :goto_2
    invoke-interface {v6}, Ljava/util/Iterator;->hasNext()Z

    move-result v8

    if-eqz v8, :cond_3

    invoke-interface {v6}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v8

    check-cast v8, Ljava/lang/String;

    .line 305
    invoke-virtual {v5, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 306
    const-string v8, ", "

    invoke-virtual {v5, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_2

    .line 308
    :cond_3
    invoke-virtual {v5}, Ljava/lang/StringBuilder;->length()I

    move-result v6

    add-int/lit8 v6, v6, -0x2

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->setLength(I)V

    .line 310
    invoke-interface {v3}, Ljava/util/Map$Entry;->getKey()Ljava/lang/Object;

    move-result-object v6

    check-cast v6, Ljava/lang/String;

    const-string v8, "Content-Type"

    invoke-virtual {v8, v6}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v6

    if-eqz v6, :cond_5

    .line 311
    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, ";"

    invoke-virtual {v2, v3}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v2

    const/4 v3, 0x0

    .line 312
    aget-object v3, v2, v3

    invoke-virtual {v3}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v3

    .line 313
    array-length v5, v2

    const/4 v6, 0x1

    if-le v5, v6, :cond_4

    .line 314
    aget-object v2, v2, v6

    const-string v5, "="

    invoke-virtual {v2, v5}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v2

    .line 315
    array-length v5, v2

    if-le v5, v6, :cond_4

    .line 316
    aget-object v2, v2, v6

    invoke-virtual {v2}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v4

    :cond_4
    move-object v2, v3

    goto :goto_1

    .line 320
    :cond_5
    invoke-interface {v3}, Ljava/util/Map$Entry;->getKey()Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Ljava/lang/String;

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-interface {v7, v3, v5}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_1

    .line 324
    :cond_6
    invoke-virtual {v0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->getErrorStream()Ljava/io/InputStream;

    move-result-object v1

    if-nez v1, :cond_7

    .line 326
    invoke-virtual {v0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->getInputStream()Ljava/io/InputStream;

    move-result-object v1

    :cond_7
    move-object v8, v1

    if-nez v2, :cond_8

    .line 330
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object p1

    invoke-virtual {p1}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object p1

    invoke-direct {p0, p1, v8}, Lcom/getcapacitor/WebViewLocalServer;->getMimeType(Ljava/lang/String;Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object v2

    :cond_8
    move-object v3, v2

    .line 333
    invoke-virtual {v0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->getResponseCode()I

    move-result v5

    .line 334
    invoke-direct {p0, v5}, Lcom/getcapacitor/WebViewLocalServer;->getReasonPhraseFromResponseCode(I)Ljava/lang/String;

    move-result-object v6

    .line 336
    new-instance v2, Landroid/webkit/WebResourceResponse;

    invoke-direct/range {v2 .. v8}, Landroid/webkit/WebResourceResponse;-><init>(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;Ljava/util/Map;Ljava/io/InputStream;)V

    return-object v2
.end method

.method private handleLocalRequest(Landroid/webkit/WebResourceRequest;Lcom/getcapacitor/WebViewLocalServer$PathHandler;)Landroid/webkit/WebResourceResponse;
    .locals 13

    .line 340
    const-string v0, "/index.html"

    const-string v1, "-"

    .line 0
    const-string v2, "bytes "

    .line 340
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v3

    invoke-virtual {v3}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object v3

    .line 342
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getRequestHeaders()Ljava/util/Map;

    move-result-object v4

    .line 343
    const-string v5, "Range"

    invoke-interface {v4, v5}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v6

    if-eqz v6, :cond_0

    goto :goto_0

    :cond_0
    const-string v5, "range"

    :goto_0
    invoke-interface {v4, v5}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Ljava/lang/String;

    .line 345
    const-string v5, "/"

    if-eqz v4, :cond_2

    .line 346
    new-instance v12, Lcom/getcapacitor/WebViewLocalServer$LollipopLazyInputStream;

    invoke-direct {v12, p2, p1}, Lcom/getcapacitor/WebViewLocalServer$LollipopLazyInputStream;-><init>(Lcom/getcapacitor/WebViewLocalServer$PathHandler;Landroid/webkit/WebResourceRequest;)V

    .line 347
    invoke-direct {p0, v3, v12}, Lcom/getcapacitor/WebViewLocalServer;->getMimeType(Ljava/lang/String;Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object v7

    .line 348
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->buildDefaultResponseHeaders()Ljava/util/Map;

    move-result-object v11

    .line 351
    :try_start_0
    invoke-virtual {v12}, Ljava/io/InputStream;->available()I

    move-result p1

    .line 352
    const-string v0, "="

    invoke-virtual {v4, v0}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v0

    const/4 v3, 0x1

    .line 353
    aget-object v0, v0, v3

    invoke-virtual {v0, v1}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v0

    const/4 v4, 0x0

    .line 354
    aget-object v4, v0, v4

    add-int/lit8 v6, p1, -0x1

    .line 356
    array-length v8, v0

    if-le v8, v3, :cond_1

    .line 357
    aget-object v0, v0, v3

    invoke-static {v0}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result v6

    .line 359
    :cond_1
    const-string v0, "Accept-Ranges"

    const-string v3, "bytes"

    invoke-interface {v11, v0, v3}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 360
    const-string v0, "Content-Range"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v6}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-interface {v11, v0, p1}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0

    const/16 p1, 0xce

    goto :goto_1

    :catch_0
    const/16 p1, 0x194

    :goto_1
    move v9, p1

    .line 364
    new-instance v6, Landroid/webkit/WebResourceResponse;

    .line 366
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getEncoding()Ljava/lang/String;

    move-result-object v8

    .line 368
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getReasonPhrase()Ljava/lang/String;

    move-result-object v10

    invoke-direct/range {v6 .. v12}, Landroid/webkit/WebResourceResponse;-><init>(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;Ljava/util/Map;Ljava/io/InputStream;)V

    return-object v6

    .line 374
    :cond_2
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v1

    invoke-direct {p0, v1}, Lcom/getcapacitor/WebViewLocalServer;->isLocalFile(Landroid/net/Uri;)Z

    move-result v1

    if-nez v1, :cond_d

    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v1

    invoke-direct {p0, v1}, Lcom/getcapacitor/WebViewLocalServer;->isErrorUrl(Landroid/net/Uri;)Z

    move-result v1

    if-eqz v1, :cond_3

    goto/16 :goto_4

    .line 388
    :cond_3
    const-string v1, "/cordova.js"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_4

    .line 389
    new-instance v6, Landroid/webkit/WebResourceResponse;

    .line 391
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getEncoding()Ljava/lang/String;

    move-result-object v8

    .line 392
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getStatusCode()I

    move-result v9

    .line 393
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getReasonPhrase()Ljava/lang/String;

    move-result-object v10

    .line 394
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->buildDefaultResponseHeaders()Ljava/util/Map;

    move-result-object v11

    const/4 v12, 0x0

    const-string v7, "application/javascript"

    invoke-direct/range {v6 .. v12}, Landroid/webkit/WebResourceResponse;-><init>(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;Ljava/util/Map;Ljava/io/InputStream;)V

    return-object v6

    .line 399
    :cond_4
    invoke-virtual {v3, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    const/4 v2, 0x0

    if-nez v1, :cond_9

    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v1

    invoke-virtual {v1}, Landroid/net/Uri;->getLastPathSegment()Ljava/lang/String;

    move-result-object v1

    const-string v4, "."

    invoke-virtual {v1, v4}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_5

    iget-boolean v1, p0, Lcom/getcapacitor/WebViewLocalServer;->html5mode:Z

    if-eqz v1, :cond_5

    goto :goto_2

    .line 434
    :cond_5
    const-string v0, "/favicon.ico"

    invoke-virtual {v0, v3}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_6

    .line 436
    :try_start_1
    new-instance v0, Landroid/webkit/WebResourceResponse;

    const-string v1, "image/png"

    invoke-direct {v0, v1, v2, v2}, Landroid/webkit/WebResourceResponse;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/io/InputStream;)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    return-object v0

    :catch_1
    move-exception v0

    .line 438
    const-string v1, "favicon handling failed"

    invoke-static {v1, v0}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/Throwable;)V

    .line 442
    :cond_6
    invoke-virtual {v3, v4}, Ljava/lang/String;->lastIndexOf(Ljava/lang/String;)I

    move-result v0

    if-ltz v0, :cond_8

    .line 444
    invoke-virtual {v3, v4}, Ljava/lang/String;->lastIndexOf(Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v3, v0}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v0

    .line 446
    new-instance v1, Lcom/getcapacitor/WebViewLocalServer$LollipopLazyInputStream;

    invoke-direct {v1, p2, p1}, Lcom/getcapacitor/WebViewLocalServer$LollipopLazyInputStream;-><init>(Lcom/getcapacitor/WebViewLocalServer$PathHandler;Landroid/webkit/WebResourceRequest;)V

    .line 449
    const-string p1, ".html"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_7

    iget-object p1, p0, Lcom/getcapacitor/WebViewLocalServer;->jsInjector:Lcom/getcapacitor/JSInjector;

    if-eqz p1, :cond_7

    .line 450
    invoke-virtual {p1, v1}, Lcom/getcapacitor/JSInjector;->getInjectedStream(Ljava/io/InputStream;)Ljava/io/InputStream;

    move-result-object v1

    :cond_7
    move-object v10, v1

    .line 453
    invoke-direct {p0, v3, v10}, Lcom/getcapacitor/WebViewLocalServer;->getMimeType(Ljava/lang/String;Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object v5

    .line 454
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getStatusCode()I

    move-result p1

    invoke-direct {p0, v10, p1}, Lcom/getcapacitor/WebViewLocalServer;->getStatusCode(Ljava/io/InputStream;I)I

    move-result v7

    .line 455
    new-instance v4, Landroid/webkit/WebResourceResponse;

    .line 457
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getEncoding()Ljava/lang/String;

    move-result-object v6

    .line 459
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getReasonPhrase()Ljava/lang/String;

    move-result-object v8

    .line 460
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->buildDefaultResponseHeaders()Ljava/util/Map;

    move-result-object v9

    invoke-direct/range {v4 .. v10}, Landroid/webkit/WebResourceResponse;-><init>(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;Ljava/util/Map;Ljava/io/InputStream;)V

    return-object v4

    :cond_8
    return-object v2

    .line 402
    :cond_9
    :goto_2
    :try_start_2
    new-instance p1, Ljava/lang/StringBuilder;

    invoke-direct {p1}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v1, p0, Lcom/getcapacitor/WebViewLocalServer;->basePath:Ljava/lang/String;

    invoke-virtual {p1, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    .line 403
    iget-object v1, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v1}, Lcom/getcapacitor/Bridge;->getRouteProcessor()Lcom/getcapacitor/RouteProcessor;

    move-result-object v1

    if-eqz v1, :cond_a

    .line 404
    iget-object p1, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p1}, Lcom/getcapacitor/Bridge;->getRouteProcessor()Lcom/getcapacitor/RouteProcessor;

    move-result-object p1

    iget-object v1, p0, Lcom/getcapacitor/WebViewLocalServer;->basePath:Ljava/lang/String;

    invoke-interface {p1, v1, v0}, Lcom/getcapacitor/RouteProcessor;->process(Ljava/lang/String;Ljava/lang/String;)Lcom/getcapacitor/ProcessedRoute;

    move-result-object p1

    .line 405
    invoke-virtual {p1}, Lcom/getcapacitor/ProcessedRoute;->getPath()Ljava/lang/String;

    move-result-object v0

    .line 406
    invoke-virtual {p1}, Lcom/getcapacitor/ProcessedRoute;->isAsset()Z

    move-result p1

    iput-boolean p1, p0, Lcom/getcapacitor/WebViewLocalServer;->isAsset:Z

    move-object p1, v0

    .line 409
    :cond_a
    iget-boolean v0, p0, Lcom/getcapacitor/WebViewLocalServer;->isAsset:Z

    if-eqz v0, :cond_b

    .line 410
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->protocolHandler:Lcom/getcapacitor/AndroidProtocolHandler;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/AndroidProtocolHandler;->openAsset(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object p1

    goto :goto_3

    .line 412
    :cond_b
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->protocolHandler:Lcom/getcapacitor/AndroidProtocolHandler;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/AndroidProtocolHandler;->openFile(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object p1
    :try_end_2
    .catch Ljava/io/IOException; {:try_start_2 .. :try_end_2} :catch_2

    .line 419
    :goto_3
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->jsInjector:Lcom/getcapacitor/JSInjector;

    if-eqz v0, :cond_c

    .line 420
    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSInjector;->getInjectedStream(Ljava/io/InputStream;)Ljava/io/InputStream;

    move-result-object p1

    :cond_c
    move-object v6, p1

    .line 423
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getStatusCode()I

    move-result p1

    invoke-direct {p0, v6, p1}, Lcom/getcapacitor/WebViewLocalServer;->getStatusCode(Ljava/io/InputStream;I)I

    move-result v3

    .line 424
    new-instance v0, Landroid/webkit/WebResourceResponse;

    .line 426
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getEncoding()Ljava/lang/String;

    move-result-object v2

    .line 428
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getReasonPhrase()Ljava/lang/String;

    move-result-object v4

    .line 429
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->buildDefaultResponseHeaders()Ljava/util/Map;

    move-result-object v5

    const-string v1, "text/html"

    invoke-direct/range {v0 .. v6}, Landroid/webkit/WebResourceResponse;-><init>(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;Ljava/util/Map;Ljava/io/InputStream;)V

    return-object v0

    :catch_2
    move-exception v0

    move-object p1, v0

    .line 415
    const-string p2, "Unable to open index.html"

    invoke-static {p2, p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/Throwable;)V

    return-object v2

    .line 375
    :cond_d
    :goto_4
    new-instance v9, Lcom/getcapacitor/WebViewLocalServer$LollipopLazyInputStream;

    invoke-direct {v9, p2, p1}, Lcom/getcapacitor/WebViewLocalServer$LollipopLazyInputStream;-><init>(Lcom/getcapacitor/WebViewLocalServer$PathHandler;Landroid/webkit/WebResourceRequest;)V

    .line 376
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object p1

    invoke-virtual {p1}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object p1

    invoke-direct {p0, p1, v9}, Lcom/getcapacitor/WebViewLocalServer;->getMimeType(Ljava/lang/String;Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object v4

    .line 377
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getStatusCode()I

    move-result p1

    invoke-direct {p0, v9, p1}, Lcom/getcapacitor/WebViewLocalServer;->getStatusCode(Ljava/io/InputStream;I)I

    move-result v6

    .line 378
    new-instance v3, Landroid/webkit/WebResourceResponse;

    .line 380
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getEncoding()Ljava/lang/String;

    move-result-object v5

    .line 382
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getReasonPhrase()Ljava/lang/String;

    move-result-object v7

    .line 383
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->buildDefaultResponseHeaders()Ljava/util/Map;

    move-result-object v8

    invoke-direct/range {v3 .. v9}, Landroid/webkit/WebResourceResponse;-><init>(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;Ljava/util/Map;Ljava/io/InputStream;)V

    return-object v3
.end method

.method private handleProxyRequest(Landroid/webkit/WebResourceRequest;Lcom/getcapacitor/WebViewLocalServer$PathHandler;)Landroid/webkit/WebResourceResponse;
    .locals 8

    .line 490
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->jsInjector:Lcom/getcapacitor/JSInjector;

    if-eqz v0, :cond_5

    .line 491
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getMethod()Ljava/lang/String;

    move-result-object v0

    .line 492
    const-string v1, "GET"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_5

    .line 494
    :try_start_0
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v1

    invoke-virtual {v1}, Landroid/net/Uri;->toString()Ljava/lang/String;

    move-result-object v1

    .line 495
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getRequestHeaders()Ljava/util/Map;

    move-result-object v2

    .line 497
    invoke-interface {v2}, Ljava/util/Map;->entrySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v3

    :cond_0
    invoke-interface {v3}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    if-eqz v4, :cond_5

    invoke-interface {v3}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Ljava/util/Map$Entry;

    .line 498
    invoke-interface {v4}, Ljava/util/Map$Entry;->getKey()Ljava/lang/Object;

    move-result-object v5

    check-cast v5, Ljava/lang/String;

    const-string v6, "Accept"

    invoke-virtual {v5, v6}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v5

    if-eqz v5, :cond_0

    invoke-interface {v4}, Ljava/util/Map$Entry;->getValue()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Ljava/lang/String;

    invoke-virtual {v4}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object v4

    const-string v5, "text/html"

    invoke-virtual {v4, v5}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v4

    if-eqz v4, :cond_0

    .line 504
    new-instance v3, Ljava/net/URL;

    invoke-direct {v3, v1}, Ljava/net/URL;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3}, Ljava/net/URL;->openConnection()Ljava/net/URLConnection;

    move-result-object v3

    check-cast v3, Ljava/net/HttpURLConnection;

    .line 505
    invoke-interface {v2}, Ljava/util/Map;->entrySet()Ljava/util/Set;

    move-result-object v2

    invoke-interface {v2}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v2

    :goto_0
    invoke-interface {v2}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    if-eqz v4, :cond_1

    invoke-interface {v2}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Ljava/util/Map$Entry;

    .line 506
    invoke-interface {v4}, Ljava/util/Map$Entry;->getKey()Ljava/lang/Object;

    move-result-object v5

    check-cast v5, Ljava/lang/String;

    invoke-interface {v4}, Ljava/util/Map$Entry;->getValue()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Ljava/lang/String;

    invoke-virtual {v3, v5, v4}, Ljava/net/HttpURLConnection;->setRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_0

    .line 508
    :cond_1
    invoke-static {}, Landroid/webkit/CookieManager;->getInstance()Landroid/webkit/CookieManager;

    move-result-object v2

    invoke-virtual {v2, v1}, Landroid/webkit/CookieManager;->getCookie(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    if-eqz v2, :cond_2

    .line 510
    const-string v4, "Cookie"

    invoke-virtual {v3, v4, v2}, Ljava/net/HttpURLConnection;->setRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    .line 512
    :cond_2
    invoke-virtual {v3, v0}, Ljava/net/HttpURLConnection;->setRequestMethod(Ljava/lang/String;)V

    const/16 v0, 0x7530

    .line 513
    invoke-virtual {v3, v0}, Ljava/net/HttpURLConnection;->setReadTimeout(I)V

    .line 514
    invoke-virtual {v3, v0}, Ljava/net/HttpURLConnection;->setConnectTimeout(I)V

    .line 515
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v0

    invoke-virtual {v0}, Landroid/net/Uri;->getUserInfo()Ljava/lang/String;

    move-result-object v0

    if-eqz v0, :cond_3

    .line 516
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object p1

    invoke-virtual {p1}, Landroid/net/Uri;->getUserInfo()Ljava/lang/String;

    move-result-object p1

    sget-object v0, Ljava/nio/charset/StandardCharsets;->UTF_8:Ljava/nio/charset/Charset;

    invoke-virtual {p1, v0}, Ljava/lang/String;->getBytes(Ljava/nio/charset/Charset;)[B

    move-result-object p1

    const/4 v0, 0x2

    .line 517
    invoke-static {p1, v0}, Landroid/util/Base64;->encodeToString([BI)Ljava/lang/String;

    move-result-object p1

    .line 518
    const-string v0, "Authorization"

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "Basic "

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v3, v0, p1}, Ljava/net/HttpURLConnection;->setRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    .line 521
    :cond_3
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->getHeaderFields()Ljava/util/Map;

    move-result-object p1

    const-string v0, "Set-Cookie"

    invoke-interface {p1, v0}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object p1

    check-cast p1, Ljava/util/List;

    if-eqz p1, :cond_4

    .line 523
    invoke-interface {p1}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object p1

    :goto_1
    invoke-interface {p1}, Ljava/util/Iterator;->hasNext()Z

    move-result v0

    if-eqz v0, :cond_4

    invoke-interface {p1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    .line 524
    invoke-static {}, Landroid/webkit/CookieManager;->getInstance()Landroid/webkit/CookieManager;

    move-result-object v2

    invoke-virtual {v2, v1, v0}, Landroid/webkit/CookieManager;->setCookie(Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_1

    .line 527
    :cond_4
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->getInputStream()Ljava/io/InputStream;

    move-result-object p1

    .line 528
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->jsInjector:Lcom/getcapacitor/JSInjector;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSInjector;->getInjectedStream(Ljava/io/InputStream;)Ljava/io/InputStream;

    move-result-object v7

    .line 530
    new-instance v1, Landroid/webkit/WebResourceResponse;

    const-string v2, "text/html"

    .line 532
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getEncoding()Ljava/lang/String;

    move-result-object v3

    .line 533
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getStatusCode()I

    move-result v4

    .line 534
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->getReasonPhrase()Ljava/lang/String;

    move-result-object v5

    .line 535
    invoke-virtual {p2}, Lcom/getcapacitor/WebViewLocalServer$PathHandler;->buildDefaultResponseHeaders()Ljava/util/Map;

    move-result-object v6

    invoke-direct/range {v1 .. v7}, Landroid/webkit/WebResourceResponse;-><init>(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;Ljava/util/Map;Ljava/io/InputStream;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object v1

    :catch_0
    move-exception v0

    move-object p1, v0

    .line 540
    iget-object p2, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p2, p1}, Lcom/getcapacitor/Bridge;->handleAppUrlLoadError(Ljava/lang/Exception;)V

    :cond_5
    const/4 p1, 0x0

    return-object p1
.end method

.method private isAllowedUrl(Landroid/net/Uri;)Z
    .locals 1

    .line 228
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getServerUrl()Ljava/lang/String;

    move-result-object v0

    if-nez v0, :cond_1

    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getAppAllowNavigationMask()Lcom/getcapacitor/util/HostMask;

    move-result-object v0

    invoke-virtual {p1}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object p1

    invoke-interface {v0, p1}, Lcom/getcapacitor/util/HostMask;->matches(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_0

    goto :goto_0

    :cond_0
    const/4 p1, 0x0

    return p1

    :cond_1
    :goto_0
    const/4 p1, 0x1

    return p1
.end method

.method private isErrorUrl(Landroid/net/Uri;)Z
    .locals 1

    .line 219
    invoke-virtual {p1}, Landroid/net/Uri;->toString()Ljava/lang/String;

    move-result-object p1

    .line 220
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getErrorUrl()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    return p1
.end method

.method private isLocalFile(Landroid/net/Uri;)Z
    .locals 1

    .line 214
    invoke-virtual {p1}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object p1

    .line 215
    const-string v0, "/_capacitor_content_"

    invoke-virtual {p1, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_1

    const-string v0, "/_capacitor_file_"

    invoke-virtual {p1, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_0

    goto :goto_0

    :cond_0
    const/4 p1, 0x0

    return p1

    :cond_1
    :goto_0
    const/4 p1, 0x1

    return p1
.end method

.method private isMainUrl(Landroid/net/Uri;)Z
    .locals 1

    .line 224
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getServerUrl()Ljava/lang/String;

    move-result-object v0

    if-nez v0, :cond_0

    invoke-virtual {p1}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object p1

    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getHost()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p1, v0}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_0

    const/4 p1, 0x1

    return p1

    :cond_0
    const/4 p1, 0x0

    return p1
.end method

.method private static parseAndVerifyUrl(Ljava/lang/String;)Landroid/net/Uri;
    .locals 3

    const/4 v0, 0x0

    if-nez p0, :cond_0

    return-object v0

    .line 162
    :cond_0
    invoke-static {p0}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v1

    if-nez v1, :cond_1

    .line 164
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "Malformed URL: "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    invoke-static {p0}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    return-object v0

    .line 167
    :cond_1
    invoke-virtual {v1}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object v2

    if-eqz v2, :cond_3

    .line 168
    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    move-result v2

    if-eqz v2, :cond_2

    goto :goto_0

    :cond_2
    return-object v1

    .line 169
    :cond_3
    :goto_0
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "URL does not have a path: "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    invoke-static {p0}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    return-object v0
.end method

.method private registerUriForScheme(Ljava/lang/String;Lcom/getcapacitor/WebViewLocalServer$PathHandler;Ljava/lang/String;)V
    .locals 1

    .line 690
    new-instance v0, Landroid/net/Uri$Builder;

    invoke-direct {v0}, Landroid/net/Uri$Builder;-><init>()V

    .line 691
    invoke-virtual {v0, p1}, Landroid/net/Uri$Builder;->scheme(Ljava/lang/String;)Landroid/net/Uri$Builder;

    .line 692
    invoke-virtual {v0, p3}, Landroid/net/Uri$Builder;->authority(Ljava/lang/String;)Landroid/net/Uri$Builder;

    .line 693
    const-string p1, ""

    invoke-virtual {v0, p1}, Landroid/net/Uri$Builder;->path(Ljava/lang/String;)Landroid/net/Uri$Builder;

    .line 694
    invoke-virtual {v0}, Landroid/net/Uri$Builder;->build()Landroid/net/Uri;

    move-result-object p1

    .line 696
    const-string p3, "/"

    invoke-static {p1, p3}, Landroid/net/Uri;->withAppendedPath(Landroid/net/Uri;Ljava/lang/String;)Landroid/net/Uri;

    move-result-object p3

    invoke-virtual {p0, p3, p2}, Lcom/getcapacitor/WebViewLocalServer;->register(Landroid/net/Uri;Lcom/getcapacitor/WebViewLocalServer$PathHandler;)V

    .line 697
    const-string p3, "**"

    invoke-static {p1, p3}, Landroid/net/Uri;->withAppendedPath(Landroid/net/Uri;Ljava/lang/String;)Landroid/net/Uri;

    move-result-object p1

    invoke-virtual {p0, p1, p2}, Lcom/getcapacitor/WebViewLocalServer;->register(Landroid/net/Uri;Lcom/getcapacitor/WebViewLocalServer$PathHandler;)V

    return-void
.end method


# virtual methods
.method public getBasePath()Ljava/lang/String;
    .locals 1

    .line 771
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->basePath:Ljava/lang/String;

    return-object v0
.end method

.method public getJavaScriptInjectedStream(Ljava/io/InputStream;)Ljava/io/InputStream;
    .locals 1

    .line 476
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->jsInjector:Lcom/getcapacitor/JSInjector;

    if-eqz v0, :cond_0

    .line 477
    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSInjector;->getInjectedStream(Ljava/io/InputStream;)Ljava/io/InputStream;

    move-result-object p1

    :cond_0
    return-object p1
.end method

.method public hostAssets(Ljava/lang/String;)V
    .locals 1

    const/4 v0, 0x1

    .line 610
    iput-boolean v0, p0, Lcom/getcapacitor/WebViewLocalServer;->isAsset:Z

    .line 611
    iput-object p1, p0, Lcom/getcapacitor/WebViewLocalServer;->basePath:Ljava/lang/String;

    .line 612
    invoke-direct {p0}, Lcom/getcapacitor/WebViewLocalServer;->createHostingDetails()V

    return-void
.end method

.method public hostFiles(Ljava/lang/String;)V
    .locals 1

    const/4 v0, 0x0

    .line 625
    iput-boolean v0, p0, Lcom/getcapacitor/WebViewLocalServer;->isAsset:Z

    .line 626
    iput-object p1, p0, Lcom/getcapacitor/WebViewLocalServer;->basePath:Ljava/lang/String;

    .line 627
    invoke-direct {p0}, Lcom/getcapacitor/WebViewLocalServer;->createHostingDetails()V

    return-void
.end method

.method register(Landroid/net/Uri;Lcom/getcapacitor/WebViewLocalServer$PathHandler;)V
    .locals 4

    .line 595
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer;->uriMatcher:Lcom/getcapacitor/UriMatcher;

    monitor-enter v0

    .line 596
    :try_start_0
    iget-object v1, p0, Lcom/getcapacitor/WebViewLocalServer;->uriMatcher:Lcom/getcapacitor/UriMatcher;

    invoke-virtual {p1}, Landroid/net/Uri;->getScheme()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {p1}, Landroid/net/Uri;->getAuthority()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {p1}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v1, v2, v3, p1, p2}, Lcom/getcapacitor/UriMatcher;->addURI(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/Object;)V

    .line 597
    monitor-exit v0

    return-void

    :catchall_0
    move-exception p1

    monitor-exit v0
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    throw p1
.end method

.method public shouldInterceptRequest(Landroid/webkit/WebResourceRequest;)Landroid/webkit/WebResourceResponse;
    .locals 5

    .line 185
    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v0

    .line 187
    invoke-virtual {v0}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object v1

    const/4 v2, 0x0

    if-eqz v1, :cond_0

    invoke-virtual {v0}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object v1

    const-string v3, "/_capacitor_http_interceptor_"

    invoke-virtual {v1, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 188
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v3, "Handling CapacitorHttp request: "

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Lcom/getcapacitor/Logger;->debug(Ljava/lang/String;)V

    .line 190
    :try_start_0
    invoke-direct {p0, p1}, Lcom/getcapacitor/WebViewLocalServer;->handleCapacitorHttpRequest(Landroid/webkit/WebResourceRequest;)Landroid/webkit/WebResourceResponse;

    move-result-object p1
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object p1

    :catch_0
    move-exception p1

    .line 192
    invoke-virtual {p1}, Ljava/lang/Exception;->getLocalizedMessage()Ljava/lang/String;

    move-result-object p1

    invoke-static {p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    return-object v2

    .line 198
    :cond_0
    iget-object v1, p0, Lcom/getcapacitor/WebViewLocalServer;->uriMatcher:Lcom/getcapacitor/UriMatcher;

    monitor-enter v1

    .line 199
    :try_start_1
    iget-object v3, p0, Lcom/getcapacitor/WebViewLocalServer;->uriMatcher:Lcom/getcapacitor/UriMatcher;

    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v4

    invoke-virtual {v3, v4}, Lcom/getcapacitor/UriMatcher;->match(Landroid/net/Uri;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Lcom/getcapacitor/WebViewLocalServer$PathHandler;

    .line 200
    monitor-exit v1
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    if-nez v3, :cond_1

    return-object v2

    .line 205
    :cond_1
    invoke-direct {p0, v0}, Lcom/getcapacitor/WebViewLocalServer;->isLocalFile(Landroid/net/Uri;)Z

    move-result v1

    if-nez v1, :cond_3

    invoke-direct {p0, v0}, Lcom/getcapacitor/WebViewLocalServer;->isMainUrl(Landroid/net/Uri;)Z

    move-result v1

    if-nez v1, :cond_3

    invoke-direct {p0, v0}, Lcom/getcapacitor/WebViewLocalServer;->isAllowedUrl(Landroid/net/Uri;)Z

    move-result v1

    if-eqz v1, :cond_3

    invoke-direct {p0, v0}, Lcom/getcapacitor/WebViewLocalServer;->isErrorUrl(Landroid/net/Uri;)Z

    move-result v0

    if-eqz v0, :cond_2

    goto :goto_0

    .line 209
    :cond_2
    invoke-direct {p0, p1, v3}, Lcom/getcapacitor/WebViewLocalServer;->handleProxyRequest(Landroid/webkit/WebResourceRequest;Lcom/getcapacitor/WebViewLocalServer$PathHandler;)Landroid/webkit/WebResourceResponse;

    move-result-object p1

    return-object p1

    .line 206
    :cond_3
    :goto_0
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "Handling local request: "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-interface {p1}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v1

    invoke-virtual {v1}, Landroid/net/Uri;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Lcom/getcapacitor/Logger;->debug(Ljava/lang/String;)V

    .line 207
    invoke-direct {p0, p1, v3}, Lcom/getcapacitor/WebViewLocalServer;->handleLocalRequest(Landroid/webkit/WebResourceRequest;Lcom/getcapacitor/WebViewLocalServer$PathHandler;)Landroid/webkit/WebResourceResponse;

    move-result-object p1

    return-object p1

    :catchall_0
    move-exception p1

    .line 200
    :try_start_2
    monitor-exit v1
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_0

    throw p1
.end method
