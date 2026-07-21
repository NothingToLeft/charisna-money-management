.class public Lcom/getcapacitor/JSValue;
.super Ljava/lang/Object;
.source "JSValue.java"


# instance fields
.field private final value:Ljava/lang/Object;


# direct methods
.method public constructor <init>(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V
    .locals 0

    .line 16
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 17
    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/JSValue;->toValue(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1

    iput-object p1, p0, Lcom/getcapacitor/JSValue;->value:Ljava/lang/Object;

    return-void
.end method

.method private toValue(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)Ljava/lang/Object;
    .locals 2

    const/4 v0, 0x0

    .line 57
    invoke-virtual {p1, p2, v0}, Lcom/getcapacitor/PluginCall;->getArray(Ljava/lang/String;Lcom/getcapacitor/JSArray;)Lcom/getcapacitor/JSArray;

    move-result-object v1

    if-eqz v1, :cond_0

    return-object v1

    .line 59
    :cond_0
    invoke-virtual {p1, p2, v0}, Lcom/getcapacitor/PluginCall;->getObject(Ljava/lang/String;Lcom/getcapacitor/JSObject;)Lcom/getcapacitor/JSObject;

    move-result-object v1

    if-eqz v1, :cond_1

    return-object v1

    .line 61
    :cond_1
    invoke-virtual {p1, p2, v0}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    if-eqz v0, :cond_2

    return-object v0

    .line 63
    :cond_2
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->getData()Lcom/getcapacitor/JSObject;

    move-result-object p1

    invoke-virtual {p1, p2}, Lcom/getcapacitor/JSObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1

    return-object p1
.end method


# virtual methods
.method public getValue()Ljava/lang/Object;
    .locals 1

    .line 24
    iget-object v0, p0, Lcom/getcapacitor/JSValue;->value:Ljava/lang/Object;

    return-object v0
.end method

.method public toJSArray()Lcom/getcapacitor/JSArray;
    .locals 2
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .line 48
    iget-object v0, p0, Lcom/getcapacitor/JSValue;->value:Ljava/lang/Object;

    instance-of v1, v0, Lcom/getcapacitor/JSArray;

    if-eqz v1, :cond_0

    check-cast v0, Lcom/getcapacitor/JSArray;

    return-object v0

    .line 49
    :cond_0
    new-instance v0, Lorg/json/JSONException;

    const-string v1, "JSValue could not be coerced to JSArray."

    invoke-direct {v0, v1}, Lorg/json/JSONException;-><init>(Ljava/lang/String;)V

    throw v0
.end method

.method public toJSObject()Lcom/getcapacitor/JSObject;
    .locals 2
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .line 38
    iget-object v0, p0, Lcom/getcapacitor/JSValue;->value:Ljava/lang/Object;

    instance-of v1, v0, Lcom/getcapacitor/JSObject;

    if-eqz v1, :cond_0

    check-cast v0, Lcom/getcapacitor/JSObject;

    return-object v0

    .line 39
    :cond_0
    new-instance v0, Lorg/json/JSONException;

    const-string v1, "JSValue could not be coerced to JSObject."

    invoke-direct {v0, v1}, Lorg/json/JSONException;-><init>(Ljava/lang/String;)V

    throw v0
.end method

.method public toString()Ljava/lang/String;
    .locals 1

    .line 29
    invoke-virtual {p0}, Lcom/getcapacitor/JSValue;->getValue()Ljava/lang/Object;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/Object;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method
