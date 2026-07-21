.class public Lcom/getcapacitor/cordova/MockCordovaInterfaceImpl;
.super Lorg/apache/cordova/CordovaInterfaceImpl;
.source "MockCordovaInterfaceImpl.java"


# direct methods
.method public constructor <init>(Landroidx/appcompat/app/AppCompatActivity;)V
    .locals 1

    .line 13
    invoke-static {}, Ljava/util/concurrent/Executors;->newCachedThreadPool()Ljava/util/concurrent/ExecutorService;

    move-result-object v0

    invoke-direct {p0, p1, v0}, Lorg/apache/cordova/CordovaInterfaceImpl;-><init>(Landroidx/appcompat/app/AppCompatActivity;Ljava/util/concurrent/ExecutorService;)V

    return-void
.end method


# virtual methods
.method public getActivityResultCallback()Lorg/apache/cordova/CordovaPlugin;
    .locals 1

    .line 17
    iget-object v0, p0, Lcom/getcapacitor/cordova/MockCordovaInterfaceImpl;->activityResultCallback:Lorg/apache/cordova/CordovaPlugin;

    return-object v0
.end method

.method public handlePermissionResult(I[Ljava/lang/String;[I)Z
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lorg/json/JSONException;
        }
    .end annotation

    .line 31
    iget-object v0, p0, Lcom/getcapacitor/cordova/MockCordovaInterfaceImpl;->permissionResultCallbacks:Lorg/apache/cordova/CallbackMap;

    invoke-virtual {v0, p1}, Lorg/apache/cordova/CallbackMap;->getAndRemoveCallback(I)Landroid/util/Pair;

    move-result-object p1

    if-eqz p1, :cond_0

    .line 33
    iget-object v0, p1, Landroid/util/Pair;->first:Ljava/lang/Object;

    check-cast v0, Lorg/apache/cordova/CordovaPlugin;

    iget-object p1, p1, Landroid/util/Pair;->second:Ljava/lang/Object;

    check-cast p1, Ljava/lang/Integer;

    invoke-virtual {p1}, Ljava/lang/Integer;->intValue()I

    move-result p1

    invoke-virtual {v0, p1, p2, p3}, Lorg/apache/cordova/CordovaPlugin;->onRequestPermissionResult(I[Ljava/lang/String;[I)V

    const/4 p1, 0x1

    return p1

    :cond_0
    const/4 p1, 0x0

    return p1
.end method
