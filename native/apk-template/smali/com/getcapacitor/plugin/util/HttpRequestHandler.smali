.class public Lcom/getcapacitor/plugin/util/HttpRequestHandler;
.super Ljava/lang/Object;
.source "HttpRequestHandler.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;,
        Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;,
        Lcom/getcapacitor/plugin/util/HttpRequestHandler$ProgressEmitter;
    }
.end annotation


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 31
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static buildResponse(Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;)Lcom/getcapacitor/JSObject;
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;,
            Lorg/json/JSONException;
        }
    .end annotation

    .line 203
    sget-object v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->DEFAULT:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    invoke-static {p0, v0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->buildResponse(Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;)Lcom/getcapacitor/JSObject;

    move-result-object p0

    return-object p0
.end method

.method public static buildResponse(Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;)Lcom/getcapacitor/JSObject;
    .locals 3
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;,
            Lorg/json/JSONException;
        }
    .end annotation

    .line 216
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->getResponseCode()I

    move-result v0

    .line 218
    new-instance v1, Lcom/getcapacitor/JSObject;

    invoke-direct {v1}, Lcom/getcapacitor/JSObject;-><init>()V

    .line 219
    const-string v2, "status"

    invoke-virtual {v1, v2, v0}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;I)Lcom/getcapacitor/JSObject;

    .line 220
    const-string v0, "headers"

    invoke-static {p0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->buildResponseHeaders(Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;)Lcom/getcapacitor/JSObject;

    move-result-object v2

    invoke-virtual {v1, v0, v2}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/JSObject;

    .line 221
    const-string v0, "url"

    invoke-virtual {p0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->getURL()Ljava/net/URL;

    move-result-object v2

    invoke-virtual {v1, v0, v2}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/JSObject;

    .line 222
    const-string v0, "data"

    invoke-static {p0, p1}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->readData(Lcom/getcapacitor/plugin/util/ICapacitorHttpUrlConnection;Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;)Ljava/lang/Object;

    move-result-object p1

    invoke-virtual {v1, v0, p1}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/JSObject;

    .line 224
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->getErrorStream()Ljava/io/InputStream;

    move-result-object p0

    if-eqz p0, :cond_0

    .line 226
    const-string p0, "error"

    const/4 p1, 0x1

    invoke-virtual {v1, p0, p1}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Z)Lcom/getcapacitor/JSObject;

    :cond_0
    return-object v1
.end method

.method public static buildResponseHeaders(Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;)Lcom/getcapacitor/JSObject;
    .locals 4

    .line 292
    new-instance v0, Lcom/getcapacitor/JSObject;

    invoke-direct {v0}, Lcom/getcapacitor/JSObject;-><init>()V

    .line 294
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->getHeaderFields()Ljava/util/Map;

    move-result-object p0

    invoke-interface {p0}, Ljava/util/Map;->entrySet()Ljava/util/Set;

    move-result-object p0

    invoke-interface {p0}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object p0

    :goto_0
    invoke-interface {p0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_0

    invoke-interface {p0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/util/Map$Entry;

    .line 295
    invoke-interface {v1}, Ljava/util/Map$Entry;->getValue()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/Iterable;

    const-string v3, ", "

    invoke-static {v3, v2}, Landroid/text/TextUtils;->join(Ljava/lang/CharSequence;Ljava/lang/Iterable;)Ljava/lang/String;

    move-result-object v2

    .line 296
    invoke-interface {v1}, Ljava/util/Map$Entry;->getKey()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    invoke-virtual {v0, v1, v2}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/String;)Lcom/getcapacitor/JSObject;

    goto :goto_0

    :cond_0
    return-object v0
.end method

.method public static isDomainExcludedFromSSL(Lcom/getcapacitor/Bridge;Ljava/net/URL;)Ljava/lang/Boolean;
    .locals 6

    const/4 v0, 0x0

    .line 453
    :try_start_0
    const-string v1, "io.ionic.sslpinning.SSLPinning"

    invoke-static {v1}, Ljava/lang/Class;->forName(Ljava/lang/String;)Ljava/lang/Class;

    move-result-object v1

    .line 454
    const-string v2, "isDomainExcluded"

    const/4 v3, 0x2

    new-array v3, v3, [Ljava/lang/Class;

    const-class v4, Lcom/getcapacitor/Bridge;

    aput-object v4, v3, v0

    const-class v4, Ljava/net/URL;

    const/4 v5, 0x1

    aput-object v4, v3, v5

    invoke-virtual {v1, v2, v3}, Ljava/lang/Class;->getDeclaredMethod(Ljava/lang/String;[Ljava/lang/Class;)Ljava/lang/reflect/Method;

    move-result-object v2

    .line 455
    new-array v3, v0, [Ljava/lang/Class;

    invoke-virtual {v1, v3}, Ljava/lang/Class;->getDeclaredConstructor([Ljava/lang/Class;)Ljava/lang/reflect/Constructor;

    move-result-object v1

    new-array v3, v0, [Ljava/lang/Object;

    invoke-virtual {v1, v3}, Ljava/lang/reflect/Constructor;->newInstance([Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    filled-new-array {p0, p1}, [Ljava/lang/Object;

    move-result-object p0

    invoke-virtual {v2, v1, p0}, Ljava/lang/reflect/Method;->invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object p0

    check-cast p0, Ljava/lang/Boolean;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object p0

    .line 457
    :catch_0
    invoke-static {v0}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object p0

    return-object p0
.end method

.method public static varargs isOneOf(Ljava/lang/String;[Lcom/getcapacitor/plugin/util/MimeType;)Z
    .locals 4

    const/4 v0, 0x0

    if-eqz p0, :cond_1

    .line 277
    array-length v1, p1

    move v2, v0

    :goto_0
    if-ge v2, v1, :cond_1

    aget-object v3, p1, v2

    .line 278
    invoke-virtual {v3}, Lcom/getcapacitor/plugin/util/MimeType;->getValue()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {p0, v3}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v3

    if-eqz v3, :cond_0

    const/4 p0, 0x1

    return p0

    :cond_0
    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    :cond_1
    return v0
.end method

.method public static parseJSON(Ljava/lang/String;)Ljava/lang/Object;
    .locals 3
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .line 309
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    .line 311
    :try_start_0
    const-string v0, "null"

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 312
    sget-object p0, Lorg/json/JSONObject;->NULL:Ljava/lang/Object;

    return-object p0

    .line 313
    :cond_0
    const-string v0, "true"

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const/4 v1, 0x1

    if-eqz v0, :cond_1

    .line 314
    invoke-static {v1}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object p0

    return-object p0

    .line 315
    :cond_1
    const-string v0, "false"

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_2

    const/4 v0, 0x0

    .line 316
    invoke-static {v0}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object p0

    return-object p0

    .line 317
    :cond_2
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v0

    if-gtz v0, :cond_3

    .line 318
    const-string p0, ""

    return-object p0

    .line 319
    :cond_3
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    const-string v2, "^\".*\"$"

    invoke-virtual {v0, v2}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_4

    .line 321
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/String;->length()I

    move-result v2

    sub-int/2addr v2, v1

    invoke-virtual {v0, v1, v2}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object p0

    return-object p0

    .line 322
    :cond_4
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    const-string v1, "^-?\\d+$"

    invoke-virtual {v0, v1}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_5

    .line 323
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result v0

    invoke-static {v0}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p0

    return-object p0

    .line 324
    :cond_5
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    const-string v1, "^-?\\d+(\\.\\d+)?$"

    invoke-virtual {v0, v1}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_6

    .line 325
    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Ljava/lang/Double;->parseDouble(Ljava/lang/String;)D

    move-result-wide v0

    invoke-static {v0, v1}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object p0
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_1

    return-object p0

    .line 328
    :cond_6
    :try_start_1
    new-instance v0, Lcom/getcapacitor/JSObject;

    invoke-direct {v0, p0}, Lcom/getcapacitor/JSObject;-><init>(Ljava/lang/String;)V
    :try_end_1
    .catch Lorg/json/JSONException; {:try_start_1 .. :try_end_1} :catch_0

    return-object v0

    .line 330
    :catch_0
    :try_start_2
    new-instance v0, Lcom/getcapacitor/JSArray;

    invoke-direct {v0, p0}, Lcom/getcapacitor/JSArray;-><init>(Ljava/lang/String;)V
    :try_end_2
    .catch Lorg/json/JSONException; {:try_start_2 .. :try_end_2} :catch_1

    return-object v0

    :catch_1
    return-object p0
.end method

.method public static readData(Lcom/getcapacitor/plugin/util/ICapacitorHttpUrlConnection;Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;)Ljava/lang/Object;
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;,
            Lorg/json/JSONException;
        }
    .end annotation

    .line 241
    invoke-interface {p0}, Lcom/getcapacitor/plugin/util/ICapacitorHttpUrlConnection;->getErrorStream()Ljava/io/InputStream;

    move-result-object v0

    .line 242
    const-string v1, "Content-Type"

    invoke-interface {p0, v1}, Lcom/getcapacitor/plugin/util/ICapacitorHttpUrlConnection;->getHeaderField(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    const/4 v2, 0x1

    if-eqz v0, :cond_1

    const/4 p0, 0x2

    .line 245
    new-array p0, p0, [Lcom/getcapacitor/plugin/util/MimeType;

    const/4 p1, 0x0

    sget-object v3, Lcom/getcapacitor/plugin/util/MimeType;->APPLICATION_JSON:Lcom/getcapacitor/plugin/util/MimeType;

    aput-object v3, p0, p1

    sget-object p1, Lcom/getcapacitor/plugin/util/MimeType;->APPLICATION_VND_API_JSON:Lcom/getcapacitor/plugin/util/MimeType;

    aput-object p1, p0, v2

    invoke-static {v1, p0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->isOneOf(Ljava/lang/String;[Lcom/getcapacitor/plugin/util/MimeType;)Z

    move-result p0

    if-eqz p0, :cond_0

    .line 246
    invoke-static {v0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->readStreamAsString(Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object p0

    invoke-static {p0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->parseJSON(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p0

    return-object p0

    .line 248
    :cond_0
    invoke-static {v0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->readStreamAsString(Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object p0

    return-object p0

    :cond_1
    if-eqz v1, :cond_2

    .line 250
    sget-object v0, Lcom/getcapacitor/plugin/util/MimeType;->APPLICATION_JSON:Lcom/getcapacitor/plugin/util/MimeType;

    invoke-virtual {v0}, Lcom/getcapacitor/plugin/util/MimeType;->getValue()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_2

    .line 252
    invoke-interface {p0}, Lcom/getcapacitor/plugin/util/ICapacitorHttpUrlConnection;->getInputStream()Ljava/io/InputStream;

    move-result-object p0

    invoke-static {p0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->readStreamAsString(Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object p0

    invoke-static {p0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->parseJSON(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p0

    return-object p0

    .line 254
    :cond_2
    invoke-interface {p0}, Lcom/getcapacitor/plugin/util/ICapacitorHttpUrlConnection;->getInputStream()Ljava/io/InputStream;

    move-result-object p0

    .line 255
    invoke-virtual {p1}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->ordinal()I

    move-result p1

    if-eqz p1, :cond_4

    if-eq p1, v2, :cond_4

    const/4 v0, 0x3

    if-eq p1, v0, :cond_3

    .line 264
    invoke-static {p0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->readStreamAsString(Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object p0

    return-object p0

    .line 260
    :cond_3
    invoke-static {p0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->readStreamAsString(Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object p0

    invoke-static {p0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->parseJSON(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p0

    return-object p0

    .line 258
    :cond_4
    invoke-static {p0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->readStreamAsBase64(Ljava/io/InputStream;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method public static readStreamAsBase64(Ljava/io/InputStream;)Ljava/lang/String;
    .locals 5
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 345
    new-instance v0, Ljava/io/ByteArrayOutputStream;

    invoke-direct {v0}, Ljava/io/ByteArrayOutputStream;-><init>()V

    const/16 v1, 0x400

    .line 346
    :try_start_0
    new-array v1, v1, [B

    .line 348
    :goto_0
    invoke-virtual {p0, v1}, Ljava/io/InputStream;->read([B)I

    move-result v2

    const/4 v3, -0x1

    const/4 v4, 0x0

    if-eq v2, v3, :cond_0

    .line 349
    invoke-virtual {v0, v1, v4, v2}, Ljava/io/ByteArrayOutputStream;->write([BII)V

    goto :goto_0

    .line 351
    :cond_0
    invoke-virtual {v0}, Ljava/io/ByteArrayOutputStream;->toByteArray()[B

    move-result-object p0

    .line 352
    array-length v1, p0

    invoke-static {p0, v4, v1, v4}, Landroid/util/Base64;->encodeToString([BIII)Ljava/lang/String;

    move-result-object p0
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 353
    invoke-virtual {v0}, Ljava/io/ByteArrayOutputStream;->close()V

    return-object p0

    :catchall_0
    move-exception p0

    .line 345
    :try_start_1
    invoke-virtual {v0}, Ljava/io/ByteArrayOutputStream;->close()V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_1

    goto :goto_1

    :catchall_1
    move-exception v0

    invoke-virtual {p0, v0}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    :goto_1
    throw p0
.end method

.method public static readStreamAsString(Ljava/io/InputStream;)Ljava/lang/String;
    .locals 3
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 363
    new-instance v0, Ljava/io/BufferedReader;

    new-instance v1, Ljava/io/InputStreamReader;

    invoke-direct {v1, p0}, Ljava/io/InputStreamReader;-><init>(Ljava/io/InputStream;)V

    invoke-direct {v0, v1}, Ljava/io/BufferedReader;-><init>(Ljava/io/Reader;)V

    .line 364
    :try_start_0
    new-instance p0, Ljava/lang/StringBuilder;

    invoke-direct {p0}, Ljava/lang/StringBuilder;-><init>()V

    .line 365
    invoke-virtual {v0}, Ljava/io/BufferedReader;->readLine()Ljava/lang/String;

    move-result-object v1

    :cond_0
    :goto_0
    if-eqz v1, :cond_1

    .line 367
    invoke-virtual {p0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 368
    invoke-virtual {v0}, Ljava/io/BufferedReader;->readLine()Ljava/lang/String;

    move-result-object v1

    if-eqz v1, :cond_0

    .line 370
    const-string v2, "line.separator"

    invoke-static {v2}, Ljava/lang/System;->getProperty(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {p0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_0

    .line 373
    :cond_1
    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 374
    invoke-virtual {v0}, Ljava/io/BufferedReader;->close()V

    return-object p0

    :catchall_0
    move-exception p0

    .line 363
    :try_start_1
    invoke-virtual {v0}, Ljava/io/BufferedReader;->close()V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_1

    goto :goto_1

    :catchall_1
    move-exception v0

    invoke-virtual {p0, v0}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    :goto_1
    throw p0
.end method

.method public static request(Lcom/getcapacitor/PluginCall;Ljava/lang/String;Lcom/getcapacitor/Bridge;)Lcom/getcapacitor/JSObject;
    .locals 16
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;,
            Ljava/net/URISyntaxException;,
            Lorg/json/JSONException;
        }
    .end annotation

    move-object/from16 v0, p0

    move-object/from16 v1, p1

    move-object/from16 v2, p2

    .line 387
    const-string v3, "url"

    const-string v4, ""

    invoke-virtual {v0, v3, v4}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 388
    new-instance v4, Lcom/getcapacitor/JSObject;

    invoke-direct {v4}, Lcom/getcapacitor/JSObject;-><init>()V

    const-string v5, "headers"

    invoke-virtual {v0, v5, v4}, Lcom/getcapacitor/PluginCall;->getObject(Ljava/lang/String;Lcom/getcapacitor/JSObject;)Lcom/getcapacitor/JSObject;

    move-result-object v4

    .line 389
    new-instance v5, Lcom/getcapacitor/JSObject;

    invoke-direct {v5}, Lcom/getcapacitor/JSObject;-><init>()V

    const-string v6, "params"

    invoke-virtual {v0, v6, v5}, Lcom/getcapacitor/PluginCall;->getObject(Ljava/lang/String;Lcom/getcapacitor/JSObject;)Lcom/getcapacitor/JSObject;

    move-result-object v5

    .line 390
    const-string v6, "connectTimeout"

    invoke-virtual {v0, v6}, Lcom/getcapacitor/PluginCall;->getInt(Ljava/lang/String;)Ljava/lang/Integer;

    move-result-object v6

    .line 391
    const-string v7, "readTimeout"

    invoke-virtual {v0, v7}, Lcom/getcapacitor/PluginCall;->getInt(Ljava/lang/String;)Ljava/lang/Integer;

    move-result-object v7

    .line 392
    const-string v8, "disableRedirects"

    invoke-virtual {v0, v8}, Lcom/getcapacitor/PluginCall;->getBoolean(Ljava/lang/String;)Ljava/lang/Boolean;

    move-result-object v8

    const/4 v9, 0x1

    .line 393
    invoke-static {v9}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v10

    const-string v11, "shouldEncodeUrlParams"

    invoke-virtual {v0, v11, v10}, Lcom/getcapacitor/PluginCall;->getBoolean(Ljava/lang/String;Ljava/lang/Boolean;)Ljava/lang/Boolean;

    move-result-object v10

    .line 394
    const-string v11, "responseType"

    invoke-virtual {v0, v11}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    invoke-static {v11}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->parse(Ljava/lang/String;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    move-result-object v11

    .line 395
    const-string v12, "dataType"

    invoke-virtual {v0, v12}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v12

    if-eqz v1, :cond_0

    goto :goto_0

    .line 397
    :cond_0
    const-string v1, "method"

    const-string v13, "GET"

    invoke-virtual {v0, v1, v13}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    :goto_0
    sget-object v13, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {v1, v13}, Ljava/lang/String;->toUpperCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v1

    .line 399
    const-string v13, "DELETE"

    invoke-virtual {v1, v13}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13

    if-nez v13, :cond_2

    const-string v13, "PATCH"

    invoke-virtual {v1, v13}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13

    if-nez v13, :cond_2

    const-string v13, "POST"

    invoke-virtual {v1, v13}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13

    if-nez v13, :cond_2

    const-string v13, "PUT"

    invoke-virtual {v1, v13}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13

    if-eqz v13, :cond_1

    goto :goto_1

    :cond_1
    const/4 v13, 0x0

    goto :goto_2

    :cond_2
    :goto_1
    move v13, v9

    .line 404
    :goto_2
    const-string v14, "x-cap-user-agent"

    invoke-virtual {v4, v14}, Lcom/getcapacitor/JSObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v15

    .line 405
    const-string v9, "User-Agent"

    if-eqz v15, :cond_3

    .line 406
    invoke-virtual {v4, v9, v15}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/String;)Lcom/getcapacitor/JSObject;

    .line 408
    :cond_3
    invoke-virtual {v4, v14}, Lcom/getcapacitor/JSObject;->remove(Ljava/lang/String;)Ljava/lang/Object;

    .line 410
    invoke-virtual {v4, v9}, Lcom/getcapacitor/JSObject;->has(Ljava/lang/String;)Z

    move-result v14

    if-nez v14, :cond_4

    const-string v14, "user-agent"

    invoke-virtual {v4, v14}, Lcom/getcapacitor/JSObject;->has(Ljava/lang/String;)Z

    move-result v14

    if-nez v14, :cond_4

    .line 411
    invoke-virtual {v2}, Lcom/getcapacitor/Bridge;->getConfig()Lcom/getcapacitor/CapConfig;

    move-result-object v14

    invoke-virtual {v14}, Lcom/getcapacitor/CapConfig;->getOverriddenUserAgentString()Ljava/lang/String;

    move-result-object v14

    invoke-virtual {v4, v9, v14}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/String;)Lcom/getcapacitor/JSObject;

    .line 414
    :cond_4
    new-instance v9, Ljava/net/URL;

    invoke-direct {v9, v3}, Ljava/net/URL;-><init>(Ljava/lang/String;)V

    .line 415
    new-instance v3, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    invoke-direct {v3}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;-><init>()V

    .line 416
    invoke-virtual {v3, v9}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setUrl(Ljava/net/URL;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v3

    .line 417
    invoke-virtual {v3, v1}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setMethod(Ljava/lang/String;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v1

    .line 418
    invoke-virtual {v1, v4}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setHeaders(Lcom/getcapacitor/JSObject;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v1

    .line 419
    invoke-virtual {v10}, Ljava/lang/Boolean;->booleanValue()Z

    move-result v3

    invoke-virtual {v1, v5, v3}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setUrlParams(Lcom/getcapacitor/JSObject;Z)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v1

    .line 420
    invoke-virtual {v1, v6}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setConnectTimeout(Ljava/lang/Integer;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v1

    .line 421
    invoke-virtual {v1, v7}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setReadTimeout(Ljava/lang/Integer;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v1

    .line 422
    invoke-virtual {v1, v8}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setDisableRedirects(Ljava/lang/Boolean;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v1

    .line 423
    invoke-virtual {v1}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->openConnection()Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object v1

    .line 425
    invoke-virtual {v1}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->build()Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    move-result-object v1

    if-eqz v2, :cond_5

    .line 427
    invoke-static {v2, v9}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->isDomainExcludedFromSSL(Lcom/getcapacitor/Bridge;Ljava/net/URL;)Ljava/lang/Boolean;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/Boolean;->booleanValue()Z

    move-result v3

    if-nez v3, :cond_5

    .line 428
    invoke-virtual {v1, v2}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->setSSLSocketFactory(Lcom/getcapacitor/Bridge;)V

    :cond_5
    if-eqz v13, :cond_6

    .line 433
    new-instance v2, Lcom/getcapacitor/JSValue;

    const-string v3, "data"

    invoke-direct {v2, v0, v3}, Lcom/getcapacitor/JSValue;-><init>(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    .line 434
    invoke-virtual {v2}, Lcom/getcapacitor/JSValue;->getValue()Ljava/lang/Object;

    move-result-object v3

    if-eqz v3, :cond_6

    const/4 v3, 0x1

    .line 435
    invoke-virtual {v1, v3}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->setDoOutput(Z)V

    .line 436
    invoke-virtual {v1, v0, v2, v12}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->setRequestBody(Lcom/getcapacitor/PluginCall;Lcom/getcapacitor/JSValue;Ljava/lang/String;)V

    .line 440
    :cond_6
    invoke-virtual {v0}, Lcom/getcapacitor/PluginCall;->getData()Lcom/getcapacitor/JSObject;

    move-result-object v2

    const-string v3, "activeCapacitorHttpUrlConnection"

    invoke-virtual {v2, v3, v1}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/JSObject;

    .line 441
    invoke-virtual {v1}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->connect()V

    .line 443
    invoke-static {v1, v11}, Lcom/getcapacitor/plugin/util/HttpRequestHandler;->buildResponse(Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;)Lcom/getcapacitor/JSObject;

    move-result-object v2

    .line 445
    invoke-virtual {v1}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->disconnect()V

    .line 446
    invoke-virtual {v0}, Lcom/getcapacitor/PluginCall;->getData()Lcom/getcapacitor/JSObject;

    move-result-object v0

    invoke-virtual {v0, v3}, Lcom/getcapacitor/JSObject;->remove(Ljava/lang/String;)Ljava/lang/Object;

    return-object v2
.end method
