.class public Lcom/getcapacitor/util/JSONUtils;
.super Ljava/lang/Object;
.source "JSONUtils.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 10
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static getArray(Lorg/json/JSONObject;Ljava/lang/String;[Ljava/lang/String;)[Ljava/lang/String;
    .locals 3

    .line 127
    invoke-static {p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestKey(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 129
    :try_start_0
    invoke-static {p0, p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestObject(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    .line 131
    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->getJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object p0

    if-nez p0, :cond_0

    goto :goto_1

    .line 136
    :cond_0
    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result p1

    .line 137
    new-array v0, p1, [Ljava/lang/String;

    const/4 v1, 0x0

    :goto_0
    if-ge v1, p1, :cond_1

    .line 140
    invoke-virtual {p0, v1}, Lorg/json/JSONArray;->get(I)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    aput-object v2, v0, v1
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    :cond_1
    return-object v0

    :catch_0
    :goto_1
    return-object p2
.end method

.method public static getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z
    .locals 1

    .line 46
    invoke-static {p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestKey(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 48
    :try_start_0
    invoke-static {p0, p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestObject(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    .line 50
    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->getBoolean(Ljava/lang/String;)Z

    move-result p0
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    return p0

    :catch_0
    return p2
.end method

.method private static getDeepestKey(Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 158
    const-string v0, "\\."

    invoke-virtual {p0, v0}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p0

    .line 159
    array-length v0, p0

    if-lez v0, :cond_0

    .line 160
    array-length v0, p0

    add-int/lit8 v0, v0, -0x1

    aget-object p0, p0, v0

    return-object p0

    :cond_0
    const/4 p0, 0x0

    return-object p0
.end method

.method private static getDeepestObject(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONObject;
    .locals 2
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .line 175
    const-string v0, "\\."

    invoke-virtual {p1, v0}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p1

    const/4 v0, 0x0

    .line 179
    :goto_0
    array-length v1, p1

    add-int/lit8 v1, v1, -0x1

    if-ge v0, v1, :cond_0

    .line 180
    aget-object v1, p1, v0

    .line 181
    invoke-virtual {p0, v1}, Lorg/json/JSONObject;->getJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    add-int/lit8 v0, v0, 0x1

    goto :goto_0

    :cond_0
    return-object p0
.end method

.method public static getDouble(Lorg/json/JSONObject;Ljava/lang/String;D)D
    .locals 1

    .line 87
    invoke-static {p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestKey(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 89
    :try_start_0
    invoke-static {p0, p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestObject(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    .line 90
    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->getDouble(Ljava/lang/String;)D

    move-result-wide p0
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    return-wide p0

    :catch_0
    return-wide p2
.end method

.method public static getInt(Lorg/json/JSONObject;Ljava/lang/String;I)I
    .locals 1

    .line 67
    invoke-static {p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestKey(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 69
    :try_start_0
    invoke-static {p0, p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestObject(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    .line 70
    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->getInt(Ljava/lang/String;)I

    move-result p0
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    return p0

    :catch_0
    return p2
.end method

.method public static getObject(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONObject;
    .locals 1

    .line 106
    invoke-static {p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestKey(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 108
    :try_start_0
    invoke-static {p0, p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestObject(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    .line 110
    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->getJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    return-object p0

    :catch_0
    const/4 p0, 0x0

    return-object p0
.end method

.method public static getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 21
    invoke-static {p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestKey(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 23
    :try_start_0
    invoke-static {p0, p1}, Lcom/getcapacitor/util/JSONUtils;->getDeepestObject(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    .line 25
    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    if-nez p0, :cond_0

    goto :goto_0

    :cond_0
    return-object p0

    :catch_0
    :goto_0
    return-object p2
.end method
