.class public Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;
.super Ljava/lang/Object;
.source "HttpRequestHandler.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/getcapacitor/plugin/util/HttpRequestHandler;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x9
    name = "HttpURLConnectionBuilder"
.end annotation


# instance fields
.field public connectTimeout:Ljava/lang/Integer;

.field public connection:Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

.field public disableRedirects:Ljava/lang/Boolean;

.field public headers:Lcom/getcapacitor/JSObject;

.field public method:Ljava/lang/String;

.field public readTimeout:Ljava/lang/Integer;

.field public url:Ljava/net/URL;


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 65
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method private static addUrlParam(Ljava/lang/StringBuilder;Ljava/lang/String;Ljava/lang/String;Z)V
    .locals 1

    .line 179
    const-string v0, "UTF-8"

    if-eqz p3, :cond_0

    .line 181
    :try_start_0
    invoke-static {p1, v0}, Ljava/net/URLEncoder;->encode(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    .line 182
    invoke-static {p2, v0}, Ljava/net/URLEncoder;->encode(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p2
    :try_end_0
    .catch Ljava/io/UnsupportedEncodingException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception p0

    .line 184
    new-instance p1, Ljava/lang/RuntimeException;

    invoke-virtual {p0}, Ljava/io/UnsupportedEncodingException;->getCause()Ljava/lang/Throwable;

    move-result-object p0

    invoke-direct {p1, p0}, Ljava/lang/RuntimeException;-><init>(Ljava/lang/Throwable;)V

    throw p1

    .line 187
    :cond_0
    :goto_0
    invoke-virtual {p0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    const-string p1, "="

    invoke-virtual {p0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    return-void
.end method


# virtual methods
.method public build()Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;
    .locals 1

    .line 191
    iget-object v0, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->connection:Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    return-object v0
.end method

.method public openConnection()Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;
    .locals 2
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 107
    new-instance v0, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    iget-object v1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->url:Ljava/net/URL;

    invoke-virtual {v1}, Ljava/net/URL;->openConnection()Ljava/net/URLConnection;

    move-result-object v1

    check-cast v1, Ljava/net/HttpURLConnection;

    invoke-direct {v0, v1}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;-><init>(Ljava/net/HttpURLConnection;)V

    iput-object v0, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->connection:Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    const/4 v1, 0x0

    .line 109
    invoke-virtual {v0, v1}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->setAllowUserInteraction(Z)V

    .line 110
    iget-object v0, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->connection:Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    iget-object v1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->method:Ljava/lang/String;

    invoke-virtual {v0, v1}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->setRequestMethod(Ljava/lang/String;)V

    .line 112
    iget-object v0, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->connectTimeout:Ljava/lang/Integer;

    if-eqz v0, :cond_0

    iget-object v1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->connection:Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    invoke-virtual {v0}, Ljava/lang/Integer;->intValue()I

    move-result v0

    invoke-virtual {v1, v0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->setConnectTimeout(I)V

    .line 113
    :cond_0
    iget-object v0, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->readTimeout:Ljava/lang/Integer;

    if-eqz v0, :cond_1

    iget-object v1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->connection:Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    invoke-virtual {v0}, Ljava/lang/Integer;->intValue()I

    move-result v0

    invoke-virtual {v1, v0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->setReadTimeout(I)V

    .line 114
    :cond_1
    iget-object v0, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->disableRedirects:Ljava/lang/Boolean;

    if-eqz v0, :cond_2

    iget-object v1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->connection:Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    invoke-virtual {v0}, Ljava/lang/Boolean;->booleanValue()Z

    move-result v0

    invoke-virtual {v1, v0}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->setDisableRedirects(Z)V

    .line 116
    :cond_2
    iget-object v0, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->connection:Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;

    iget-object v1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->headers:Lcom/getcapacitor/JSObject;

    invoke-virtual {v0, v1}, Lcom/getcapacitor/plugin/util/CapacitorHttpUrlConnection;->setRequestHeaders(Lcom/getcapacitor/JSObject;)V

    return-object p0
.end method

.method public setConnectTimeout(Ljava/lang/Integer;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;
    .locals 0

    .line 77
    iput-object p1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->connectTimeout:Ljava/lang/Integer;

    return-object p0
.end method

.method public setDisableRedirects(Ljava/lang/Boolean;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;
    .locals 0

    .line 87
    iput-object p1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->disableRedirects:Ljava/lang/Boolean;

    return-object p0
.end method

.method public setHeaders(Lcom/getcapacitor/JSObject;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;
    .locals 0

    .line 92
    iput-object p1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->headers:Lcom/getcapacitor/JSObject;

    return-object p0
.end method

.method public setMethod(Ljava/lang/String;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;
    .locals 0

    .line 97
    iput-object p1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->method:Ljava/lang/String;

    return-object p0
.end method

.method public setReadTimeout(Ljava/lang/Integer;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;
    .locals 0

    .line 82
    iput-object p1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->readTimeout:Ljava/lang/Integer;

    return-object p0
.end method

.method public setUrl(Ljava/net/URL;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;
    .locals 0

    .line 102
    iput-object p1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->url:Ljava/net/URL;

    return-object p0
.end method

.method public setUrlParams(Lcom/getcapacitor/JSObject;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/net/MalformedURLException;,
            Ljava/net/URISyntaxException;,
            Lorg/json/JSONException;
        }
    .end annotation

    const/4 v0, 0x1

    .line 121
    invoke-virtual {p0, p1, v0}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->setUrlParams(Lcom/getcapacitor/JSObject;Z)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;

    move-result-object p1

    return-object p1
.end method

.method public setUrlParams(Lcom/getcapacitor/JSObject;Z)Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;
    .locals 9
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/net/URISyntaxException;,
            Ljava/net/MalformedURLException;
        }
    .end annotation

    .line 126
    const-string v0, "&"

    iget-object v1, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->url:Ljava/net/URL;

    invoke-virtual {v1}, Ljava/net/URL;->getQuery()Ljava/lang/String;

    move-result-object v1

    .line 127
    const-string v2, ""

    if-nez v1, :cond_0

    move-object v1, v2

    .line 129
    :cond_0
    invoke-virtual {p1}, Lcom/getcapacitor/JSObject;->keys()Ljava/util/Iterator;

    move-result-object v3

    .line 131
    invoke-interface {v3}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    if-nez v4, :cond_1

    return-object p0

    .line 135
    :cond_1
    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 138
    :goto_0
    invoke-interface {v3}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_6

    .line 139
    invoke-interface {v3}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 143
    :try_start_0
    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5}, Ljava/lang/StringBuilder;-><init>()V

    .line 144
    invoke-virtual {p1, v1}, Lcom/getcapacitor/JSObject;->getJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v6

    const/4 v7, 0x0

    .line 145
    :goto_1
    invoke-virtual {v6}, Lorg/json/JSONArray;->length()I

    move-result v8

    if-ge v7, v8, :cond_3

    .line 146
    invoke-virtual {v6, v7}, Lorg/json/JSONArray;->getString(I)Ljava/lang/String;

    move-result-object v8

    invoke-static {v5, v1, v8, p2}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->addUrlParam(Ljava/lang/StringBuilder;Ljava/lang/String;Ljava/lang/String;Z)V

    .line 147
    invoke-virtual {v6}, Lorg/json/JSONArray;->length()I

    move-result v8

    add-int/lit8 v8, v8, -0x1

    if-eq v7, v8, :cond_2

    .line 148
    invoke-virtual {v5, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    :cond_2
    add-int/lit8 v7, v7, 0x1

    goto :goto_1

    .line 151
    :cond_3
    invoke-virtual {v4}, Ljava/lang/StringBuilder;->length()I

    move-result v6

    if-lez v6, :cond_4

    .line 152
    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 154
    :cond_4
    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/CharSequence;)Ljava/lang/StringBuilder;
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 156
    :catch_0
    invoke-virtual {v4}, Ljava/lang/StringBuilder;->length()I

    move-result v5

    if-lez v5, :cond_5

    .line 157
    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 159
    :cond_5
    invoke-virtual {p1, v1}, Lcom/getcapacitor/JSObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-static {v4, v1, v5, p2}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->addUrlParam(Ljava/lang/StringBuilder;Ljava/lang/String;Ljava/lang/String;Z)V

    goto :goto_0

    .line 163
    :cond_6
    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    .line 165
    iget-object p2, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->url:Ljava/net/URL;

    invoke-virtual {p2}, Ljava/net/URL;->toURI()Ljava/net/URI;

    move-result-object p2

    .line 166
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    .line 167
    invoke-virtual {p2}, Ljava/net/URI;->getScheme()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "://"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    .line 169
    invoke-virtual {p2}, Ljava/net/URI;->getAuthority()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    .line 170
    invoke-virtual {p2}, Ljava/net/URI;->getPath()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    .line 171
    invoke-virtual {p1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_7

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v3, "?"

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    goto :goto_2

    :cond_7
    move-object p1, v2

    :goto_2
    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    .line 172
    invoke-virtual {p2}, Ljava/net/URI;->getFragment()Ljava/lang/String;

    move-result-object v0

    if-eqz v0, :cond_8

    invoke-virtual {p2}, Ljava/net/URI;->getFragment()Ljava/lang/String;

    move-result-object v2

    :cond_8
    invoke-virtual {p1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    .line 173
    new-instance p2, Ljava/net/URL;

    invoke-direct {p2, p1}, Ljava/net/URL;-><init>(Ljava/lang/String;)V

    iput-object p2, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$HttpURLConnectionBuilder;->url:Ljava/net/URL;

    return-object p0
.end method
