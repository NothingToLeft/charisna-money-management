.class public Lcom/getcapacitor/PluginCall;
.super Ljava/lang/Object;
.source "PluginCall.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/getcapacitor/PluginCall$PluginCallDataTypeException;
    }
.end annotation


# static fields
.field public static final CALLBACK_ID_DANGLING:Ljava/lang/String; = "-1"


# instance fields
.field private final callbackId:Ljava/lang/String;

.field private final data:Lcom/getcapacitor/JSObject;

.field private isReleased:Z
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation
.end field

.field private keepAlive:Z

.field private final methodName:Ljava/lang/String;

.field private final msgHandler:Lcom/getcapacitor/MessageHandler;

.field private final pluginId:Ljava/lang/String;


# direct methods
.method public constructor <init>(Lcom/getcapacitor/MessageHandler;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/getcapacitor/JSObject;)V
    .locals 1

    .line 36
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const/4 v0, 0x0

    .line 28
    iput-boolean v0, p0, Lcom/getcapacitor/PluginCall;->keepAlive:Z

    .line 33
    iput-boolean v0, p0, Lcom/getcapacitor/PluginCall;->isReleased:Z

    .line 37
    iput-object p1, p0, Lcom/getcapacitor/PluginCall;->msgHandler:Lcom/getcapacitor/MessageHandler;

    .line 38
    iput-object p2, p0, Lcom/getcapacitor/PluginCall;->pluginId:Ljava/lang/String;

    .line 39
    iput-object p3, p0, Lcom/getcapacitor/PluginCall;->callbackId:Ljava/lang/String;

    .line 40
    iput-object p4, p0, Lcom/getcapacitor/PluginCall;->methodName:Ljava/lang/String;

    .line 41
    iput-object p5, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    return-void
.end method


# virtual methods
.method public errorCallback(Ljava/lang/String;)V
    .locals 5

    .line 63
    new-instance v0, Lcom/getcapacitor/PluginResult;

    invoke-direct {v0}, Lcom/getcapacitor/PluginResult;-><init>()V

    const/4 v1, 0x0

    .line 66
    :try_start_0
    const-string v2, "message"

    invoke-virtual {v0, v2, p1}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/PluginResult;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception p1

    const/4 v2, 0x1

    .line 68
    new-array v2, v2, [Ljava/lang/String;

    const/4 v3, 0x0

    const-string v4, "Plugin"

    aput-object v4, v2, v3

    invoke-static {v2}, Lcom/getcapacitor/Logger;->tags([Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {p1}, Ljava/lang/Exception;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-static {v2, p1, v1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)V

    .line 71
    :goto_0
    iget-object p1, p0, Lcom/getcapacitor/PluginCall;->msgHandler:Lcom/getcapacitor/MessageHandler;

    invoke-virtual {p1, p0, v1, v0}, Lcom/getcapacitor/MessageHandler;->sendResponseMessage(Lcom/getcapacitor/PluginCall;Lcom/getcapacitor/PluginResult;Lcom/getcapacitor/PluginResult;)V

    return-void
.end method

.method public getArray(Ljava/lang/String;)Lcom/getcapacitor/JSArray;
    .locals 1

    const/4 v0, 0x0

    .line 296
    invoke-virtual {p0, p1, v0}, Lcom/getcapacitor/PluginCall;->getArray(Ljava/lang/String;Lcom/getcapacitor/JSArray;)Lcom/getcapacitor/JSArray;

    move-result-object p1

    return-object p1
.end method

.method public getArray(Ljava/lang/String;Lcom/getcapacitor/JSArray;)Lcom/getcapacitor/JSArray;
    .locals 3

    .line 307
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1

    if-nez p1, :cond_0

    goto :goto_1

    .line 312
    :cond_0
    instance-of v0, p1, Lorg/json/JSONArray;

    if-eqz v0, :cond_2

    .line 314
    :try_start_0
    check-cast p1, Lorg/json/JSONArray;

    .line 315
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    const/4 v1, 0x0

    .line 316
    :goto_0
    invoke-virtual {p1}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-ge v1, v2, :cond_1

    .line 317
    invoke-virtual {p1, v1}, Lorg/json/JSONArray;->get(I)Ljava/lang/Object;

    move-result-object v2

    invoke-interface {v0, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 319
    :cond_1
    new-instance p1, Lcom/getcapacitor/JSArray;

    invoke-interface {v0}, Ljava/util/List;->toArray()[Ljava/lang/Object;

    move-result-object v0

    invoke-direct {p1, v0}, Lcom/getcapacitor/JSArray;-><init>(Ljava/lang/Object;)V
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    return-object p1

    :catch_0
    :cond_2
    :goto_1
    return-object p2
.end method

.method public getBoolean(Ljava/lang/String;)Ljava/lang/Boolean;
    .locals 1

    const/4 v0, 0x0

    .line 258
    invoke-virtual {p0, p1, v0}, Lcom/getcapacitor/PluginCall;->getBoolean(Ljava/lang/String;Ljava/lang/Boolean;)Ljava/lang/Boolean;

    move-result-object p1

    return-object p1
.end method

.method public getBoolean(Ljava/lang/String;Ljava/lang/Boolean;)Ljava/lang/Boolean;
    .locals 1

    .line 263
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1

    if-nez p1, :cond_0

    goto :goto_0

    .line 268
    :cond_0
    instance-of v0, p1, Ljava/lang/Boolean;

    if-eqz v0, :cond_1

    .line 269
    check-cast p1, Ljava/lang/Boolean;

    return-object p1

    :cond_1
    :goto_0
    return-object p2
.end method

.method public getCallbackId()Ljava/lang/String;
    .locals 1

    .line 143
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->callbackId:Ljava/lang/String;

    return-object v0
.end method

.method public getData()Lcom/getcapacitor/JSObject;
    .locals 1

    .line 151
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    return-object v0
.end method

.method public getDouble(Ljava/lang/String;)Ljava/lang/Double;
    .locals 1

    const/4 v0, 0x0

    .line 234
    invoke-virtual {p0, p1, v0}, Lcom/getcapacitor/PluginCall;->getDouble(Ljava/lang/String;Ljava/lang/Double;)Ljava/lang/Double;

    move-result-object p1

    return-object p1
.end method

.method public getDouble(Ljava/lang/String;Ljava/lang/Double;)Ljava/lang/Double;
    .locals 1

    .line 239
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1

    if-nez p1, :cond_0

    goto :goto_0

    .line 244
    :cond_0
    instance-of v0, p1, Ljava/lang/Double;

    if-eqz v0, :cond_1

    .line 245
    check-cast p1, Ljava/lang/Double;

    return-object p1

    .line 247
    :cond_1
    instance-of v0, p1, Ljava/lang/Float;

    if-eqz v0, :cond_2

    .line 248
    check-cast p1, Ljava/lang/Float;

    invoke-virtual {p1}, Ljava/lang/Float;->doubleValue()D

    move-result-wide p1

    invoke-static {p1, p2}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object p1

    return-object p1

    .line 250
    :cond_2
    instance-of v0, p1, Ljava/lang/Integer;

    if-eqz v0, :cond_3

    .line 251
    check-cast p1, Ljava/lang/Integer;

    invoke-virtual {p1}, Ljava/lang/Integer;->doubleValue()D

    move-result-wide p1

    invoke-static {p1, p2}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object p1

    return-object p1

    :cond_3
    :goto_0
    return-object p2
.end method

.method public getFloat(Ljava/lang/String;)Ljava/lang/Float;
    .locals 1

    const/4 v0, 0x0

    .line 210
    invoke-virtual {p0, p1, v0}, Lcom/getcapacitor/PluginCall;->getFloat(Ljava/lang/String;Ljava/lang/Float;)Ljava/lang/Float;

    move-result-object p1

    return-object p1
.end method

.method public getFloat(Ljava/lang/String;Ljava/lang/Float;)Ljava/lang/Float;
    .locals 1

    .line 215
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1

    if-nez p1, :cond_0

    goto :goto_0

    .line 220
    :cond_0
    instance-of v0, p1, Ljava/lang/Float;

    if-eqz v0, :cond_1

    .line 221
    check-cast p1, Ljava/lang/Float;

    return-object p1

    .line 223
    :cond_1
    instance-of v0, p1, Ljava/lang/Double;

    if-eqz v0, :cond_2

    .line 224
    check-cast p1, Ljava/lang/Double;

    invoke-virtual {p1}, Ljava/lang/Double;->floatValue()F

    move-result p1

    invoke-static {p1}, Ljava/lang/Float;->valueOf(F)Ljava/lang/Float;

    move-result-object p1

    return-object p1

    .line 226
    :cond_2
    instance-of v0, p1, Ljava/lang/Integer;

    if-eqz v0, :cond_3

    .line 227
    check-cast p1, Ljava/lang/Integer;

    invoke-virtual {p1}, Ljava/lang/Integer;->floatValue()F

    move-result p1

    invoke-static {p1}, Ljava/lang/Float;->valueOf(F)Ljava/lang/Float;

    move-result-object p1

    return-object p1

    :cond_3
    :goto_0
    return-object p2
.end method

.method public getInt(Ljava/lang/String;)Ljava/lang/Integer;
    .locals 1

    const/4 v0, 0x0

    .line 174
    invoke-virtual {p0, p1, v0}, Lcom/getcapacitor/PluginCall;->getInt(Ljava/lang/String;Ljava/lang/Integer;)Ljava/lang/Integer;

    move-result-object p1

    return-object p1
.end method

.method public getInt(Ljava/lang/String;Ljava/lang/Integer;)Ljava/lang/Integer;
    .locals 1

    .line 179
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1

    if-nez p1, :cond_0

    goto :goto_0

    .line 184
    :cond_0
    instance-of v0, p1, Ljava/lang/Integer;

    if-eqz v0, :cond_1

    .line 185
    check-cast p1, Ljava/lang/Integer;

    return-object p1

    :cond_1
    :goto_0
    return-object p2
.end method

.method public getLong(Ljava/lang/String;)Ljava/lang/Long;
    .locals 1

    const/4 v0, 0x0

    .line 192
    invoke-virtual {p0, p1, v0}, Lcom/getcapacitor/PluginCall;->getLong(Ljava/lang/String;Ljava/lang/Long;)Ljava/lang/Long;

    move-result-object p1

    return-object p1
.end method

.method public getLong(Ljava/lang/String;Ljava/lang/Long;)Ljava/lang/Long;
    .locals 1

    .line 197
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1

    if-nez p1, :cond_0

    goto :goto_0

    .line 202
    :cond_0
    instance-of v0, p1, Ljava/lang/Long;

    if-eqz v0, :cond_1

    .line 203
    check-cast p1, Ljava/lang/Long;

    return-object p1

    :cond_1
    :goto_0
    return-object p2
.end method

.method public getMethodName()Ljava/lang/String;
    .locals 1

    .line 147
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->methodName:Ljava/lang/String;

    return-object v0
.end method

.method public getObject(Ljava/lang/String;)Lcom/getcapacitor/JSObject;
    .locals 1

    const/4 v0, 0x0

    .line 275
    invoke-virtual {p0, p1, v0}, Lcom/getcapacitor/PluginCall;->getObject(Ljava/lang/String;Lcom/getcapacitor/JSObject;)Lcom/getcapacitor/JSObject;

    move-result-object p1

    return-object p1
.end method

.method public getObject(Ljava/lang/String;Lcom/getcapacitor/JSObject;)Lcom/getcapacitor/JSObject;
    .locals 1

    .line 280
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1

    if-nez p1, :cond_0

    goto :goto_0

    .line 285
    :cond_0
    instance-of v0, p1, Lorg/json/JSONObject;

    if-eqz v0, :cond_1

    .line 287
    :try_start_0
    check-cast p1, Lorg/json/JSONObject;

    invoke-static {p1}, Lcom/getcapacitor/JSObject;->fromJSONObject(Lorg/json/JSONObject;)Lcom/getcapacitor/JSObject;

    move-result-object p1
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    return-object p1

    :catch_0
    :cond_1
    :goto_0
    return-object p2
.end method

.method public getPluginId()Ljava/lang/String;
    .locals 1

    .line 139
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->pluginId:Ljava/lang/String;

    return-object v0
.end method

.method public getString(Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    const/4 v0, 0x0

    .line 156
    invoke-virtual {p0, p1, v0}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    return-object p1
.end method

.method public getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 161
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1

    if-nez p1, :cond_0

    goto :goto_0

    .line 166
    :cond_0
    instance-of v0, p1, Ljava/lang/String;

    if-eqz v0, :cond_1

    .line 167
    check-cast p1, Ljava/lang/String;

    return-object p1

    :cond_1
    :goto_0
    return-object p2
.end method

.method public hasOption(Ljava/lang/String;)Z
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 335
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->data:Lcom/getcapacitor/JSObject;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/JSObject;->has(Ljava/lang/String;)Z

    move-result p1

    return p1
.end method

.method public isKeptAlive()Z
    .locals 1

    .line 380
    iget-boolean v0, p0, Lcom/getcapacitor/PluginCall;->keepAlive:Z

    return v0
.end method

.method public isReleased()Z
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 385
    iget-boolean v0, p0, Lcom/getcapacitor/PluginCall;->isReleased:Z

    return v0
.end method

.method public isSaved()Z
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 372
    invoke-virtual {p0}, Lcom/getcapacitor/PluginCall;->isKeptAlive()Z

    move-result v0

    return v0
.end method

.method public reject(Ljava/lang/String;)V
    .locals 1

    const/4 v0, 0x0

    .line 119
    invoke-virtual {p0, p1, v0, v0, v0}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V

    return-void
.end method

.method public reject(Ljava/lang/String;Lcom/getcapacitor/JSObject;)V
    .locals 1

    const/4 v0, 0x0

    .line 107
    invoke-virtual {p0, p1, v0, v0, p2}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V

    return-void
.end method

.method public reject(Ljava/lang/String;Ljava/lang/Exception;)V
    .locals 1

    const/4 v0, 0x0

    .line 111
    invoke-virtual {p0, p1, v0, p2, v0}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V

    return-void
.end method

.method public reject(Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V
    .locals 1

    const/4 v0, 0x0

    .line 95
    invoke-virtual {p0, p1, v0, p2, p3}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V

    return-void
.end method

.method public reject(Ljava/lang/String;Ljava/lang/String;)V
    .locals 1

    const/4 v0, 0x0

    .line 115
    invoke-virtual {p0, p1, p2, v0, v0}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V

    return-void
.end method

.method public reject(Ljava/lang/String;Ljava/lang/String;Lcom/getcapacitor/JSObject;)V
    .locals 1

    const/4 v0, 0x0

    .line 99
    invoke-virtual {p0, p1, p2, v0, p3}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V

    return-void
.end method

.method public reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;)V
    .locals 1

    const/4 v0, 0x0

    .line 103
    invoke-virtual {p0, p1, p2, p3, v0}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V

    return-void
.end method

.method public reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V
    .locals 5

    .line 75
    new-instance v0, Lcom/getcapacitor/PluginResult;

    invoke-direct {v0}, Lcom/getcapacitor/PluginResult;-><init>()V

    .line 77
    const-string v1, "Plugin"

    const/4 v2, 0x0

    const/4 v3, 0x1

    if-eqz p3, :cond_0

    .line 78
    new-array v4, v3, [Ljava/lang/String;

    aput-object v1, v4, v2

    invoke-static {v4}, Lcom/getcapacitor/Logger;->tags([Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4, p1, p3}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)V

    .line 82
    :cond_0
    :try_start_0
    const-string p3, "message"

    invoke-virtual {v0, p3, p1}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/PluginResult;

    .line 83
    const-string p1, "code"

    invoke-virtual {v0, p1, p2}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/PluginResult;

    if-eqz p4, :cond_1

    .line 85
    const-string p1, "data"

    invoke-virtual {v0, p1, p4}, Lcom/getcapacitor/PluginResult;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/PluginResult;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception p1

    .line 88
    new-array p2, v3, [Ljava/lang/String;

    aput-object v1, p2, v2

    invoke-static {p2}, Lcom/getcapacitor/Logger;->tags([Ljava/lang/String;)Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object p3

    invoke-static {p2, p3, p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)V

    .line 91
    :cond_1
    :goto_0
    iget-object p1, p0, Lcom/getcapacitor/PluginCall;->msgHandler:Lcom/getcapacitor/MessageHandler;

    const/4 p2, 0x0

    invoke-virtual {p1, p0, p2, v0}, Lcom/getcapacitor/MessageHandler;->sendResponseMessage(Lcom/getcapacitor/PluginCall;Lcom/getcapacitor/PluginResult;Lcom/getcapacitor/PluginResult;)V

    return-void
.end method

.method public release(Lcom/getcapacitor/Bridge;)V
    .locals 1

    const/4 v0, 0x0

    .line 361
    iput-boolean v0, p0, Lcom/getcapacitor/PluginCall;->keepAlive:Z

    .line 362
    invoke-virtual {p1, p0}, Lcom/getcapacitor/Bridge;->releaseCall(Lcom/getcapacitor/PluginCall;)V

    const/4 p1, 0x1

    .line 363
    iput-boolean p1, p0, Lcom/getcapacitor/PluginCall;->isReleased:Z

    return-void
.end method

.method public resolve()V
    .locals 2

    .line 59
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->msgHandler:Lcom/getcapacitor/MessageHandler;

    const/4 v1, 0x0

    invoke-virtual {v0, p0, v1, v1}, Lcom/getcapacitor/MessageHandler;->sendResponseMessage(Lcom/getcapacitor/PluginCall;Lcom/getcapacitor/PluginResult;Lcom/getcapacitor/PluginResult;)V

    return-void
.end method

.method public resolve(Lcom/getcapacitor/JSObject;)V
    .locals 2

    .line 54
    new-instance v0, Lcom/getcapacitor/PluginResult;

    invoke-direct {v0, p1}, Lcom/getcapacitor/PluginResult;-><init>(Lcom/getcapacitor/JSObject;)V

    .line 55
    iget-object p1, p0, Lcom/getcapacitor/PluginCall;->msgHandler:Lcom/getcapacitor/MessageHandler;

    const/4 v1, 0x0

    invoke-virtual {p1, p0, v0, v1}, Lcom/getcapacitor/MessageHandler;->sendResponseMessage(Lcom/getcapacitor/PluginCall;Lcom/getcapacitor/PluginResult;Lcom/getcapacitor/PluginResult;)V

    return-void
.end method

.method public save()V
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    const/4 v0, 0x1

    .line 346
    invoke-static {v0}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v0

    invoke-virtual {p0, v0}, Lcom/getcapacitor/PluginCall;->setKeepAlive(Ljava/lang/Boolean;)V

    return-void
.end method

.method public setKeepAlive(Ljava/lang/Boolean;)V
    .locals 0

    .line 357
    invoke-virtual {p1}, Ljava/lang/Boolean;->booleanValue()Z

    move-result p1

    iput-boolean p1, p0, Lcom/getcapacitor/PluginCall;->keepAlive:Z

    return-void
.end method

.method public successCallback(Lcom/getcapacitor/PluginResult;)V
    .locals 2

    .line 45
    const-string v0, "-1"

    iget-object v1, p0, Lcom/getcapacitor/PluginCall;->callbackId:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    return-void

    .line 50
    :cond_0
    iget-object v0, p0, Lcom/getcapacitor/PluginCall;->msgHandler:Lcom/getcapacitor/MessageHandler;

    const/4 v1, 0x0

    invoke-virtual {v0, p0, p1, v1}, Lcom/getcapacitor/MessageHandler;->sendResponseMessage(Lcom/getcapacitor/PluginCall;Lcom/getcapacitor/PluginResult;Lcom/getcapacitor/PluginResult;)V

    return-void
.end method

.method public unavailable()V
    .locals 1

    .line 131
    const-string v0, "not available"

    invoke-virtual {p0, v0}, Lcom/getcapacitor/PluginCall;->unavailable(Ljava/lang/String;)V

    return-void
.end method

.method public unavailable(Ljava/lang/String;)V
    .locals 2

    .line 135
    const-string v0, "UNAVAILABLE"

    const/4 v1, 0x0

    invoke-virtual {p0, p1, v0, v1, v1}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V

    return-void
.end method

.method public unimplemented()V
    .locals 1

    .line 123
    const-string v0, "not implemented"

    invoke-virtual {p0, v0}, Lcom/getcapacitor/PluginCall;->unimplemented(Ljava/lang/String;)V

    return-void
.end method

.method public unimplemented(Ljava/lang/String;)V
    .locals 2

    .line 127
    const-string v0, "UNIMPLEMENTED"

    const/4 v1, 0x0

    invoke-virtual {p0, p1, v0, v1, v1}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Exception;Lcom/getcapacitor/JSObject;)V

    return-void
.end method
