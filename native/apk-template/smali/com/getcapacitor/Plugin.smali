.class public Lcom/getcapacitor/Plugin;
.super Ljava/lang/Object;
.source "Plugin.java"


# static fields
.field private static final BUNDLE_PERSISTED_OPTIONS_JSON_KEY:Ljava/lang/String; = "_json"


# instance fields
.field private final activityLaunchers:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Landroidx/activity/result/ActivityResultLauncher<",
            "Landroid/content/Intent;",
            ">;>;"
        }
    .end annotation
.end field

.field protected bridge:Lcom/getcapacitor/Bridge;

.field private final eventListeners:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/util/List<",
            "Lcom/getcapacitor/PluginCall;",
            ">;>;"
        }
    .end annotation
.end field

.field protected handle:Lcom/getcapacitor/PluginHandle;

.field private lastPluginCallId:Ljava/lang/String;

.field private final permissionLaunchers:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Landroidx/activity/result/ActivityResultLauncher<",
            "[",
            "Ljava/lang/String;",
            ">;>;"
        }
    .end annotation
.end field

.field private final retainedEventArguments:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/util/List<",
            "Lcom/getcapacitor/JSObject;",
            ">;>;"
        }
    .end annotation
.end field

.field protected savedLastCall:Lcom/getcapacitor/PluginCall;
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation
.end field


# direct methods
.method public static synthetic $r8$lambda$7dmJ1HQ3Jrtmh-tOCDedcONSntE(Lcom/getcapacitor/Plugin;Ljava/lang/reflect/Method;Landroidx/activity/result/ActivityResult;)V
    .locals 0

    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/Plugin;->lambda$initializeActivityLaunchers$0(Ljava/lang/reflect/Method;Landroidx/activity/result/ActivityResult;)V

    return-void
.end method

.method public static synthetic $r8$lambda$MIUdFOWJqxyaYOIiq89xIboPNcM(Lcom/getcapacitor/Plugin;Ljava/lang/reflect/Method;Ljava/util/Map;)V
    .locals 0

    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/Plugin;->lambda$initializeActivityLaunchers$1(Ljava/lang/reflect/Method;Ljava/util/Map;)V

    return-void
.end method

.method public constructor <init>()V
    .locals 1

    .line 87
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 74
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/Plugin;->activityLaunchers:Ljava/util/Map;

    .line 79
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/Plugin;->permissionLaunchers:Ljava/util/Map;

    .line 88
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/Plugin;->eventListeners:Ljava/util/Map;

    .line 89
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/Plugin;->retainedEventArguments:Ljava/util/Map;

    return-void
.end method

.method private addEventListener(Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V
    .locals 2

    .line 628
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->eventListeners:Ljava/util/Map;

    invoke-interface {v0, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/util/List;

    if-eqz v0, :cond_1

    .line 629
    invoke-interface {v0}, Ljava/util/List;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_0

    goto :goto_0

    .line 638
    :cond_0
    invoke-interface {v0, p2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    return-void

    .line 630
    :cond_1
    :goto_0
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    .line 631
    iget-object v1, p0, Lcom/getcapacitor/Plugin;->eventListeners:Ljava/util/Map;

    invoke-interface {v1, p1, v0}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 634
    invoke-interface {v0, p2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 636
    invoke-direct {p0, p1}, Lcom/getcapacitor/Plugin;->sendRetainedArgumentsForEvent(Ljava/lang/String;)V

    return-void
.end method

.method private getActivityLauncherOrReject(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)Landroidx/activity/result/ActivityResultLauncher;
    .locals 2
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Lcom/getcapacitor/PluginCall;",
            "Ljava/lang/String;",
            ")",
            "Landroidx/activity/result/ActivityResultLauncher<",
            "Landroid/content/Intent;",
            ">;"
        }
    .end annotation

    .line 523
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->activityLaunchers:Ljava/util/Map;

    invoke-interface {v0, p2}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroidx/activity/result/ActivityResultLauncher;

    if-nez v0, :cond_0

    .line 531
    sget-object v0, Ljava/util/Locale;->US:Ljava/util/Locale;

    filled-new-array {p2}, [Ljava/lang/Object;

    move-result-object p2

    const-string v1, "There is no ActivityCallback method registered for the name: %s. Please define a callback method annotated with @ActivityCallback that receives arguments: (PluginCall, ActivityResult)"

    invoke-static {v0, v1, p2}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p2

    .line 532
    invoke-static {p2}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    .line 533
    invoke-virtual {p1, p2}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;)V

    const/4 p1, 0x0

    return-object p1

    :cond_0
    return-object v0
.end method

.method private getPermissionLauncherOrReject(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)Landroidx/activity/result/ActivityResultLauncher;
    .locals 2
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Lcom/getcapacitor/PluginCall;",
            "Ljava/lang/String;",
            ")",
            "Landroidx/activity/result/ActivityResultLauncher<",
            "[",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .line 549
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->permissionLaunchers:Ljava/util/Map;

    invoke-interface {v0, p2}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroidx/activity/result/ActivityResultLauncher;

    if-nez v0, :cond_0

    .line 557
    sget-object v0, Ljava/util/Locale;->US:Ljava/util/Locale;

    filled-new-array {p2}, [Ljava/lang/Object;

    move-result-object p2

    const-string v1, "There is no PermissionCallback method registered for the name: %s. Please define a callback method annotated with @PermissionCallback that receives arguments: (PluginCall)"

    invoke-static {v0, v1, p2}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p2

    .line 558
    invoke-static {p2}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    .line 559
    invoke-virtual {p1, p2}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;)V

    const/4 p1, 0x0

    return-object p1

    :cond_0
    return-object v0
.end method

.method private getPermissionStringsForAliases([Ljava/lang/String;)[Ljava/lang/String;
    .locals 8

    .line 503
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v0}, Lcom/getcapacitor/PluginHandle;->getPluginAnnotation()Lcom/getcapacitor/annotation/CapacitorPlugin;

    move-result-object v0

    .line 504
    new-instance v1, Ljava/util/HashSet;

    invoke-direct {v1}, Ljava/util/HashSet;-><init>()V

    .line 505
    invoke-interface {v0}, Lcom/getcapacitor/annotation/CapacitorPlugin;->permissions()[Lcom/getcapacitor/annotation/Permission;

    move-result-object v0

    array-length v2, v0

    const/4 v3, 0x0

    move v4, v3

    :goto_0
    if-ge v4, v2, :cond_1

    aget-object v5, v0, v4

    .line 506
    invoke-static {p1}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object v6

    invoke-interface {v5}, Lcom/getcapacitor/annotation/Permission;->alias()Ljava/lang/String;

    move-result-object v7

    invoke-interface {v6, v7}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v6

    if-eqz v6, :cond_0

    .line 507
    invoke-interface {v5}, Lcom/getcapacitor/annotation/Permission;->strings()[Ljava/lang/String;

    move-result-object v5

    invoke-static {v5}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object v5

    invoke-virtual {v1, v5}, Ljava/util/HashSet;->addAll(Ljava/util/Collection;)Z

    :cond_0
    add-int/lit8 v4, v4, 0x1

    goto :goto_0

    .line 511
    :cond_1
    new-array p1, v3, [Ljava/lang/String;

    invoke-virtual {v1, p1}, Ljava/util/HashSet;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object p1

    check-cast p1, [Ljava/lang/String;

    return-object p1
.end method

.method private handleLegacyPermission(Lcom/getcapacitor/PluginCall;)V
    .locals 3

    .line 878
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v0}, Lcom/getcapacitor/PluginHandle;->getLegacyPluginAnnotation()Lcom/getcapacitor/NativePlugin;

    move-result-object v0

    .line 879
    invoke-interface {v0}, Lcom/getcapacitor/NativePlugin;->permissions()[Ljava/lang/String;

    move-result-object v1

    .line 880
    array-length v2, v1

    if-lez v2, :cond_0

    .line 881
    invoke-virtual {p0, p1}, Lcom/getcapacitor/Plugin;->saveCall(Lcom/getcapacitor/PluginCall;)V

    .line 882
    invoke-interface {v0}, Lcom/getcapacitor/NativePlugin;->permissionRequestCode()I

    move-result p1

    invoke-virtual {p0, v1, p1}, Lcom/getcapacitor/Plugin;->pluginRequestPermissions([Ljava/lang/String;I)V

    return-void

    .line 884
    :cond_0
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void
.end method

.method private synthetic lambda$initializeActivityLaunchers$0(Ljava/lang/reflect/Method;Landroidx/activity/result/ActivityResult;)V
    .locals 0

    .line 117
    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/Plugin;->triggerActivityCallback(Ljava/lang/reflect/Method;Landroidx/activity/result/ActivityResult;)V

    return-void
.end method

.method private synthetic lambda$initializeActivityLaunchers$1(Ljava/lang/reflect/Method;Ljava/util/Map;)V
    .locals 0

    .line 125
    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/Plugin;->triggerPermissionCallback(Ljava/lang/reflect/Method;Ljava/util/Map;)V

    return-void
.end method

.method private permissionActivityResult(Lcom/getcapacitor/PluginCall;[Ljava/lang/String;Ljava/lang/String;)V
    .locals 1

    .line 186
    invoke-direct {p0, p1, p3}, Lcom/getcapacitor/Plugin;->getPermissionLauncherOrReject(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)Landroidx/activity/result/ActivityResultLauncher;

    move-result-object p3

    if-nez p3, :cond_0

    return-void

    .line 192
    :cond_0
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/Bridge;->savePermissionCall(Lcom/getcapacitor/PluginCall;)V

    .line 193
    invoke-virtual {p3, p2}, Landroidx/activity/result/ActivityResultLauncher;->launch(Ljava/lang/Object;)V

    return-void
.end method

.method private removeEventListener(Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V
    .locals 1

    .line 648
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->eventListeners:Ljava/util/Map;

    invoke-interface {v0, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object p1

    check-cast p1, Ljava/util/List;

    if-nez p1, :cond_0

    return-void

    .line 653
    :cond_0
    invoke-interface {p1, p2}, Ljava/util/List;->remove(Ljava/lang/Object;)Z

    return-void
.end method

.method private sendRetainedArgumentsForEvent(Ljava/lang/String;)V
    .locals 2

    .line 714
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->retainedEventArguments:Ljava/util/Map;

    invoke-interface {v0, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/util/List;

    if-nez v0, :cond_0

    goto :goto_1

    .line 719
    :cond_0
    iget-object v1, p0, Lcom/getcapacitor/Plugin;->retainedEventArguments:Ljava/util/Map;

    invoke-interface {v1, p1}, Ljava/util/Map;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    .line 721
    invoke-interface {v0}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v0

    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_1

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/getcapacitor/JSObject;

    .line 722
    invoke-virtual {p0, p1, v1}, Lcom/getcapacitor/Plugin;->notifyListeners(Ljava/lang/String;Lcom/getcapacitor/JSObject;)V

    goto :goto_0

    :cond_1
    :goto_1
    return-void
.end method

.method private triggerActivityCallback(Ljava/lang/reflect/Method;Landroidx/activity/result/ActivityResult;)V
    .locals 2

    .line 148
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    iget-object v1, p0, Lcom/getcapacitor/Plugin;->lastPluginCallId:Ljava/lang/String;

    invoke-virtual {v0, v1}, Lcom/getcapacitor/Bridge;->getSavedCall(Ljava/lang/String;)Lcom/getcapacitor/PluginCall;

    move-result-object v0

    if-nez v0, :cond_0

    .line 150
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getPluginCallForLastActivity()Lcom/getcapacitor/PluginCall;

    move-result-object v0

    :cond_0
    const/4 v1, 0x1

    .line 154
    :try_start_0
    invoke-virtual {p1, v1}, Ljava/lang/reflect/Method;->setAccessible(Z)V

    .line 155
    filled-new-array {v0, p2}, [Ljava/lang/Object;

    move-result-object p2

    invoke-virtual {p1, p0, p2}, Ljava/lang/reflect/Method;->invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;
    :try_end_0
    .catch Ljava/lang/IllegalAccessException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    :catch_0
    move-exception p1

    goto :goto_0

    :catch_1
    move-exception p1

    .line 157
    :goto_0
    invoke-virtual {p1}, Ljava/lang/ReflectiveOperationException;->printStackTrace()V

    return-void
.end method

.method private triggerPermissionCallback(Ljava/lang/reflect/Method;Ljava/util/Map;)V
    .locals 2
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/reflect/Method;",
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/Boolean;",
            ">;)V"
        }
    .end annotation

    .line 134
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    iget-object v1, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v1}, Lcom/getcapacitor/PluginHandle;->getId()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Lcom/getcapacitor/Bridge;->getPermissionCall(Ljava/lang/String;)Lcom/getcapacitor/PluginCall;

    move-result-object v0

    .line 137
    iget-object v1, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v1, p0, v0, p2}, Lcom/getcapacitor/Bridge;->validatePermissions(Lcom/getcapacitor/Plugin;Lcom/getcapacitor/PluginCall;Ljava/util/Map;)Z

    move-result p2

    if-eqz p2, :cond_0

    const/4 p2, 0x1

    .line 139
    :try_start_0
    invoke-virtual {p1, p2}, Ljava/lang/reflect/Method;->setAccessible(Z)V

    .line 140
    filled-new-array {v0}, [Ljava/lang/Object;

    move-result-object p2

    invoke-virtual {p1, p0, p2}, Ljava/lang/reflect/Method;->invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;
    :try_end_0
    .catch Ljava/lang/IllegalAccessException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/lang/reflect/InvocationTargetException; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    :catch_0
    move-exception p1

    goto :goto_0

    :catch_1
    move-exception p1

    .line 142
    :goto_0
    invoke-virtual {p1}, Ljava/lang/ReflectiveOperationException;->printStackTrace()V

    :cond_0
    return-void
.end method


# virtual methods
.method public addListener(Lcom/getcapacitor/PluginCall;)V
    .locals 2
    .annotation runtime Lcom/getcapacitor/PluginMethod;
        returnType = "none"
    .end annotation

    .line 733
    const-string v0, "eventName"

    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const/4 v1, 0x1

    .line 734
    invoke-static {v1}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v1

    invoke-virtual {p1, v1}, Lcom/getcapacitor/PluginCall;->setKeepAlive(Ljava/lang/Boolean;)V

    .line 735
    invoke-direct {p0, v0, p1}, Lcom/getcapacitor/Plugin;->addEventListener(Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V

    return-void
.end method

.method public checkPermissions(Lcom/getcapacitor/PluginCall;)V
    .locals 4
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .annotation runtime Lcom/getcapacitor/annotation/PermissionCallback;
    .end annotation

    .line 779
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getPermissionStates()Ljava/util/Map;

    move-result-object v0

    .line 781
    invoke-interface {v0}, Ljava/util/Map;->size()I

    move-result v1

    if-nez v1, :cond_0

    .line 783
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void

    .line 785
    :cond_0
    new-instance v1, Lcom/getcapacitor/JSObject;

    invoke-direct {v1}, Lcom/getcapacitor/JSObject;-><init>()V

    .line 786
    invoke-interface {v0}, Ljava/util/Map;->entrySet()Ljava/util/Set;

    move-result-object v0

    invoke-interface {v0}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v0

    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_1

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/util/Map$Entry;

    .line 787
    invoke-interface {v2}, Ljava/util/Map$Entry;->getKey()Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Ljava/lang/String;

    invoke-interface {v2}, Ljava/util/Map$Entry;->getValue()Ljava/lang/Object;

    move-result-object v2

    invoke-virtual {v1, v3, v2}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lcom/getcapacitor/JSObject;

    goto :goto_0

    .line 790
    :cond_1
    invoke-virtual {p1, v1}, Lcom/getcapacitor/PluginCall;->resolve(Lcom/getcapacitor/JSObject;)V

    return-void
.end method

.method public execute(Ljava/lang/Runnable;)V
    .locals 1

    .line 1033
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/Bridge;->execute(Ljava/lang/Runnable;)V

    return-void
.end method

.method public freeSavedCall()V
    .locals 2
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 274
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->savedLastCall:Lcom/getcapacitor/PluginCall;

    iget-object v1, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0, v1}, Lcom/getcapacitor/PluginCall;->release(Lcom/getcapacitor/Bridge;)V

    const/4 v0, 0x0

    .line 275
    iput-object v0, p0, Lcom/getcapacitor/Plugin;->savedLastCall:Lcom/getcapacitor/PluginCall;

    return-void
.end method

.method public getActivity()Landroidx/appcompat/app/AppCompatActivity;
    .locals 1

    .line 209
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v0

    return-object v0
.end method

.method public getAppId()Ljava/lang/String;
    .locals 1

    .line 253
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getContext()Landroid/content/Context;

    move-result-object v0

    invoke-virtual {v0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public getBridge()Lcom/getcapacitor/Bridge;
    .locals 1

    .line 224
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    return-object v0
.end method

.method public getConfig()Lcom/getcapacitor/PluginConfig;
    .locals 2

    .line 296
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getConfig()Lcom/getcapacitor/CapConfig;

    move-result-object v0

    iget-object v1, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v1}, Lcom/getcapacitor/PluginHandle;->getId()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Lcom/getcapacitor/CapConfig;->getPluginConfiguration(Ljava/lang/String;)Lcom/getcapacitor/PluginConfig;

    move-result-object v0

    return-object v0
.end method

.method public getConfigValue(Ljava/lang/String;)Ljava/lang/Object;
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 310
    :try_start_0
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getConfig()Lcom/getcapacitor/PluginConfig;

    move-result-object v0

    .line 311
    invoke-virtual {v0}, Lcom/getcapacitor/PluginConfig;->getConfigJSON()Lorg/json/JSONObject;

    move-result-object v0

    invoke-virtual {v0, p1}, Lorg/json/JSONObject;->get(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p1
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    return-object p1

    :catch_0
    const/4 p1, 0x0

    return-object p1
.end method

.method public getContext()Landroid/content/Context;
    .locals 1

    .line 201
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getContext()Landroid/content/Context;

    move-result-object v0

    return-object v0
.end method

.method protected getLogTag()Ljava/lang/String;
    .locals 3

    const/4 v0, 0x1

    .line 1048
    new-array v0, v0, [Ljava/lang/String;

    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v1

    const/4 v2, 0x0

    aput-object v1, v0, v2

    invoke-static {v0}, Lcom/getcapacitor/Logger;->tags([Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method protected varargs getLogTag([Ljava/lang/String;)Ljava/lang/String;
    .locals 0

    .line 1041
    invoke-static {p1}, Lcom/getcapacitor/Logger;->tags([Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    return-object p1
.end method

.method public getPermissionState(Ljava/lang/String;)Lcom/getcapacitor/PermissionState;
    .locals 1

    .line 609
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getPermissionStates()Ljava/util/Map;

    move-result-object v0

    invoke-interface {v0, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object p1

    check-cast p1, Lcom/getcapacitor/PermissionState;

    return-object p1
.end method

.method public getPermissionStates()Ljava/util/Map;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()",
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Lcom/getcapacitor/PermissionState;",
            ">;"
        }
    .end annotation

    .line 619
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0, p0}, Lcom/getcapacitor/Bridge;->getPermissionStates(Lcom/getcapacitor/Plugin;)Ljava/util/Map;

    move-result-object v0

    return-object v0
.end method

.method public getPluginHandle()Lcom/getcapacitor/PluginHandle;
    .locals 1

    .line 245
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    return-object v0
.end method

.method public getSavedCall()Lcom/getcapacitor/PluginCall;
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 286
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->savedLastCall:Lcom/getcapacitor/PluginCall;

    return-object v0
.end method

.method protected handleOnActivityResult(IILandroid/content/Intent;)V
    .locals 0
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    return-void
.end method

.method protected handleOnConfigurationChanged(Landroid/content/res/Configuration;)V
    .locals 0

    return-void
.end method

.method protected handleOnDestroy()V
    .locals 0

    return-void
.end method

.method protected handleOnNewIntent(Landroid/content/Intent;)V
    .locals 0

    return-void
.end method

.method protected handleOnPause()V
    .locals 0

    return-void
.end method

.method protected handleOnRestart()V
    .locals 0

    return-void
.end method

.method protected handleOnResume()V
    .locals 0

    return-void
.end method

.method protected handleOnStart()V
    .locals 0

    return-void
.end method

.method protected handleOnStop()V
    .locals 0

    return-void
.end method

.method protected handleRequestPermissionsResult(I[Ljava/lang/String;[I)V
    .locals 3
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 900
    invoke-virtual {p0, p2}, Lcom/getcapacitor/Plugin;->hasDefinedPermissions([Ljava/lang/String;)Z

    move-result p1

    if-nez p1, :cond_1

    .line 901
    new-instance p1, Ljava/lang/StringBuilder;

    const-string p3, "Missing the following permissions in AndroidManifest.xml:\n"

    invoke-direct {p1, p3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 903
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getContext()Landroid/content/Context;

    move-result-object p3

    invoke-static {p3, p2}, Lcom/getcapacitor/util/PermissionHelper;->getUndefinedPermissions(Landroid/content/Context;[Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p2

    .line 904
    array-length p3, p2

    const/4 v0, 0x0

    :goto_0
    if-ge v0, p3, :cond_0

    aget-object v1, p2, v0

    .line 905
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, "\n"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {p1, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    add-int/lit8 v0, v0, 0x1

    goto :goto_0

    .line 907
    :cond_0
    iget-object p2, p0, Lcom/getcapacitor/Plugin;->savedLastCall:Lcom/getcapacitor/PluginCall;

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p2, p1}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;)V

    const/4 p1, 0x0

    .line 908
    iput-object p1, p0, Lcom/getcapacitor/Plugin;->savedLastCall:Lcom/getcapacitor/PluginCall;

    :cond_1
    return-void
.end method

.method public hasDefinedPermissions([Ljava/lang/String;)Z
    .locals 5
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 326
    array-length v0, p1

    const/4 v1, 0x0

    move v2, v1

    :goto_0
    if-ge v2, v0, :cond_1

    aget-object v3, p1, v2

    .line 327
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getContext()Landroid/content/Context;

    move-result-object v4

    invoke-static {v4, v3}, Lcom/getcapacitor/util/PermissionHelper;->hasDefinedPermission(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v3

    if-nez v3, :cond_0

    return v1

    :cond_0
    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    :cond_1
    const/4 p1, 0x1

    return p1
.end method

.method public hasDefinedRequiredPermissions()Z
    .locals 9
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 342
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v0}, Lcom/getcapacitor/PluginHandle;->getPluginAnnotation()Lcom/getcapacitor/annotation/CapacitorPlugin;

    move-result-object v0

    if-nez v0, :cond_0

    .line 345
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v0}, Lcom/getcapacitor/PluginHandle;->getLegacyPluginAnnotation()Lcom/getcapacitor/NativePlugin;

    move-result-object v0

    .line 346
    invoke-interface {v0}, Lcom/getcapacitor/NativePlugin;->permissions()[Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p0, v0}, Lcom/getcapacitor/Plugin;->hasDefinedPermissions([Ljava/lang/String;)Z

    move-result v0

    return v0

    .line 348
    :cond_0
    invoke-interface {v0}, Lcom/getcapacitor/annotation/CapacitorPlugin;->permissions()[Lcom/getcapacitor/annotation/Permission;

    move-result-object v0

    array-length v1, v0

    const/4 v2, 0x0

    move v3, v2

    :goto_0
    if-ge v3, v1, :cond_3

    aget-object v4, v0, v3

    .line 349
    invoke-interface {v4}, Lcom/getcapacitor/annotation/Permission;->strings()[Ljava/lang/String;

    move-result-object v4

    array-length v5, v4

    move v6, v2

    :goto_1
    if-ge v6, v5, :cond_2

    aget-object v7, v4, v6

    .line 350
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getContext()Landroid/content/Context;

    move-result-object v8

    invoke-static {v8, v7}, Lcom/getcapacitor/util/PermissionHelper;->hasDefinedPermission(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v7

    if-nez v7, :cond_1

    return v2

    :cond_1
    add-int/lit8 v6, v6, 0x1

    goto :goto_1

    :cond_2
    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    :cond_3
    const/4 v0, 0x1

    return v0
.end method

.method protected hasListeners(Ljava/lang/String;)Z
    .locals 1

    .line 700
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->eventListeners:Ljava/util/Map;

    invoke-interface {v0, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object p1

    check-cast p1, Ljava/util/List;

    if-nez p1, :cond_0

    const/4 p1, 0x0

    return p1

    .line 704
    :cond_0
    invoke-interface {p1}, Ljava/util/List;->isEmpty()Z

    move-result p1

    xor-int/lit8 p1, p1, 0x1

    return p1
.end method

.method public hasPermission(Ljava/lang/String;)Z
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 396
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getContext()Landroid/content/Context;

    move-result-object v0

    invoke-static {v0, p1}, Landroidx/core/app/ActivityCompat;->checkSelfPermission(Landroid/content/Context;Ljava/lang/String;)I

    move-result p1

    if-nez p1, :cond_0

    const/4 p1, 0x1

    return p1

    :cond_0
    const/4 p1, 0x0

    return p1
.end method

.method public hasRequiredPermissions()Z
    .locals 10
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 409
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v0}, Lcom/getcapacitor/PluginHandle;->getPluginAnnotation()Lcom/getcapacitor/annotation/CapacitorPlugin;

    move-result-object v0

    const/4 v1, 0x1

    const/4 v2, 0x0

    if-nez v0, :cond_2

    .line 412
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v0}, Lcom/getcapacitor/PluginHandle;->getLegacyPluginAnnotation()Lcom/getcapacitor/NativePlugin;

    move-result-object v0

    .line 413
    invoke-interface {v0}, Lcom/getcapacitor/NativePlugin;->permissions()[Ljava/lang/String;

    move-result-object v0

    array-length v3, v0

    move v4, v2

    :goto_0
    if-ge v4, v3, :cond_1

    aget-object v5, v0, v4

    .line 414
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getContext()Landroid/content/Context;

    move-result-object v6

    invoke-static {v6, v5}, Landroidx/core/app/ActivityCompat;->checkSelfPermission(Landroid/content/Context;Ljava/lang/String;)I

    move-result v5

    if-eqz v5, :cond_0

    return v2

    :cond_0
    add-int/lit8 v4, v4, 0x1

    goto :goto_0

    :cond_1
    return v1

    .line 422
    :cond_2
    invoke-interface {v0}, Lcom/getcapacitor/annotation/CapacitorPlugin;->permissions()[Lcom/getcapacitor/annotation/Permission;

    move-result-object v0

    array-length v3, v0

    move v4, v2

    :goto_1
    if-ge v4, v3, :cond_5

    aget-object v5, v0, v4

    .line 423
    invoke-interface {v5}, Lcom/getcapacitor/annotation/Permission;->strings()[Ljava/lang/String;

    move-result-object v5

    array-length v6, v5

    move v7, v2

    :goto_2
    if-ge v7, v6, :cond_4

    aget-object v8, v5, v7

    .line 424
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getContext()Landroid/content/Context;

    move-result-object v9

    invoke-static {v9, v8}, Landroidx/core/app/ActivityCompat;->checkSelfPermission(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8

    if-eqz v8, :cond_3

    return v2

    :cond_3
    add-int/lit8 v7, v7, 0x1

    goto :goto_2

    :cond_4
    add-int/lit8 v4, v4, 0x1

    goto :goto_1

    :cond_5
    return v1
.end method

.method initializeActivityLaunchers()V
    .locals 5

    .line 103
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    .line 105
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v1

    .line 106
    :goto_0
    invoke-virtual {v1}, Ljava/lang/Class;->getName()Ljava/lang/String;

    move-result-object v2

    const-class v3, Ljava/lang/Object;

    invoke-virtual {v3}, Ljava/lang/Class;->getName()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_0

    .line 109
    invoke-virtual {v1}, Ljava/lang/Class;->getDeclaredMethods()[Ljava/lang/reflect/Method;

    move-result-object v2

    invoke-static {v2}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object v2

    invoke-interface {v0, v2}, Ljava/util/List;->addAll(Ljava/util/Collection;)Z

    .line 107
    invoke-virtual {v1}, Ljava/lang/Class;->getSuperclass()Ljava/lang/Class;

    move-result-object v1

    goto :goto_0

    .line 112
    :cond_0
    invoke-interface {v0}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v0

    :cond_1
    :goto_1
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_3

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/reflect/Method;

    .line 113
    const-class v2, Lcom/getcapacitor/annotation/ActivityCallback;

    invoke-virtual {v1, v2}, Ljava/lang/reflect/Method;->isAnnotationPresent(Ljava/lang/Class;)Z

    move-result v2

    if-eqz v2, :cond_2

    .line 115
    iget-object v2, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    new-instance v3, Landroidx/activity/result/contract/ActivityResultContracts$StartActivityForResult;

    invoke-direct {v3}, Landroidx/activity/result/contract/ActivityResultContracts$StartActivityForResult;-><init>()V

    new-instance v4, Lcom/getcapacitor/Plugin$$ExternalSyntheticLambda0;

    invoke-direct {v4, p0, v1}, Lcom/getcapacitor/Plugin$$ExternalSyntheticLambda0;-><init>(Lcom/getcapacitor/Plugin;Ljava/lang/reflect/Method;)V

    invoke-virtual {v2, v3, v4}, Lcom/getcapacitor/Bridge;->registerForActivityResult(Landroidx/activity/result/contract/ActivityResultContract;Landroidx/activity/result/ActivityResultCallback;)Landroidx/activity/result/ActivityResultLauncher;

    move-result-object v2

    .line 120
    iget-object v3, p0, Lcom/getcapacitor/Plugin;->activityLaunchers:Ljava/util/Map;

    invoke-virtual {v1}, Ljava/lang/reflect/Method;->getName()Ljava/lang/String;

    move-result-object v1

    invoke-interface {v3, v1, v2}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_1

    .line 121
    :cond_2
    const-class v2, Lcom/getcapacitor/annotation/PermissionCallback;

    invoke-virtual {v1, v2}, Ljava/lang/reflect/Method;->isAnnotationPresent(Ljava/lang/Class;)Z

    move-result v2

    if-eqz v2, :cond_1

    .line 123
    iget-object v2, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    new-instance v3, Landroidx/activity/result/contract/ActivityResultContracts$RequestMultiplePermissions;

    invoke-direct {v3}, Landroidx/activity/result/contract/ActivityResultContracts$RequestMultiplePermissions;-><init>()V

    new-instance v4, Lcom/getcapacitor/Plugin$$ExternalSyntheticLambda1;

    invoke-direct {v4, p0, v1}, Lcom/getcapacitor/Plugin$$ExternalSyntheticLambda1;-><init>(Lcom/getcapacitor/Plugin;Ljava/lang/reflect/Method;)V

    invoke-virtual {v2, v3, v4}, Lcom/getcapacitor/Bridge;->registerForActivityResult(Landroidx/activity/result/contract/ActivityResultContract;Landroidx/activity/result/ActivityResultCallback;)Landroidx/activity/result/ActivityResultLauncher;

    move-result-object v2

    .line 128
    iget-object v3, p0, Lcom/getcapacitor/Plugin;->permissionLaunchers:Ljava/util/Map;

    invoke-virtual {v1}, Ljava/lang/reflect/Method;->getName()Ljava/lang/String;

    move-result-object v1

    invoke-interface {v3, v1, v2}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_1

    :cond_3
    return-void
.end method

.method public isPermissionDeclared(Ljava/lang/String;)Z
    .locals 6

    .line 366
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v0}, Lcom/getcapacitor/PluginHandle;->getPluginAnnotation()Lcom/getcapacitor/annotation/CapacitorPlugin;

    move-result-object v0

    const/4 v1, 0x0

    if-eqz v0, :cond_3

    .line 368
    invoke-interface {v0}, Lcom/getcapacitor/annotation/CapacitorPlugin;->permissions()[Lcom/getcapacitor/annotation/Permission;

    move-result-object v0

    array-length v2, v0

    move v3, v1

    :goto_0
    if-ge v3, v2, :cond_3

    aget-object v4, v0, v3

    .line 369
    invoke-interface {v4}, Lcom/getcapacitor/annotation/Permission;->alias()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {p1, v5}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v5

    if-eqz v5, :cond_2

    .line 371
    invoke-interface {v4}, Lcom/getcapacitor/annotation/Permission;->strings()[Ljava/lang/String;

    move-result-object p1

    array-length v0, p1

    const/4 v2, 0x1

    move v3, v1

    move v4, v2

    :goto_1
    if-ge v3, v0, :cond_1

    aget-object v5, p1, v3

    if-eqz v4, :cond_0

    .line 372
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getContext()Landroid/content/Context;

    move-result-object v4

    invoke-static {v4, v5}, Lcom/getcapacitor/util/PermissionHelper;->hasDefinedPermission(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v4

    if-eqz v4, :cond_0

    move v4, v2

    goto :goto_2

    :cond_0
    move v4, v1

    :goto_2
    add-int/lit8 v3, v3, 0x1

    goto :goto_1

    :cond_1
    return v4

    :cond_2
    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    .line 380
    :cond_3
    const-string v0, "isPermissionDeclared: No alias defined for %s or missing @CapacitorPlugin annotation."

    filled-new-array {p1}, [Ljava/lang/Object;

    move-result-object p1

    invoke-static {v0, p1}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p1

    invoke-static {p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    return v1
.end method

.method public load()V
    .locals 0

    return-void
.end method

.method protected notifyListeners(Ljava/lang/String;Lcom/getcapacitor/JSObject;)V
    .locals 1

    const/4 v0, 0x0

    .line 693
    invoke-virtual {p0, p1, p2, v0}, Lcom/getcapacitor/Plugin;->notifyListeners(Ljava/lang/String;Lcom/getcapacitor/JSObject;Z)V

    return-void
.end method

.method protected notifyListeners(Ljava/lang/String;Lcom/getcapacitor/JSObject;Z)V
    .locals 3

    .line 662
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getLogTag()Ljava/lang/String;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "Notifying listeners for event "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/getcapacitor/Logger;->verbose(Ljava/lang/String;Ljava/lang/String;)V

    .line 663
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->eventListeners:Ljava/util/Map;

    invoke-interface {v0, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/util/List;

    if-eqz v0, :cond_1

    .line 664
    invoke-interface {v0}, Ljava/util/List;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_0

    goto :goto_1

    .line 679
    :cond_0
    new-instance p1, Ljava/util/concurrent/CopyOnWriteArrayList;

    invoke-direct {p1, v0}, Ljava/util/concurrent/CopyOnWriteArrayList;-><init>(Ljava/util/Collection;)V

    .line 680
    invoke-virtual {p1}, Ljava/util/concurrent/CopyOnWriteArrayList;->iterator()Ljava/util/Iterator;

    move-result-object p1

    :goto_0
    invoke-interface {p1}, Ljava/util/Iterator;->hasNext()Z

    move-result p3

    if-eqz p3, :cond_3

    invoke-interface {p1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object p3

    check-cast p3, Lcom/getcapacitor/PluginCall;

    .line 681
    invoke-virtual {p3, p2}, Lcom/getcapacitor/PluginCall;->resolve(Lcom/getcapacitor/JSObject;)V

    goto :goto_0

    .line 665
    :cond_1
    :goto_1
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getLogTag()Ljava/lang/String;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "No listeners found for event "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/getcapacitor/Logger;->debug(Ljava/lang/String;Ljava/lang/String;)V

    if-eqz p3, :cond_3

    .line 667
    iget-object p3, p0, Lcom/getcapacitor/Plugin;->retainedEventArguments:Ljava/util/Map;

    invoke-interface {p3, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object p3

    check-cast p3, Ljava/util/List;

    if-nez p3, :cond_2

    .line 670
    new-instance p3, Ljava/util/ArrayList;

    invoke-direct {p3}, Ljava/util/ArrayList;-><init>()V

    .line 673
    :cond_2
    invoke-interface {p3, p2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 674
    iget-object p2, p0, Lcom/getcapacitor/Plugin;->retainedEventArguments:Ljava/util/Map;

    invoke-interface {p2, p1, p3}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    :cond_3
    return-void
.end method

.method public pluginRequestAllPermissions()V
    .locals 3
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 573
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v0}, Lcom/getcapacitor/PluginHandle;->getLegacyPluginAnnotation()Lcom/getcapacitor/NativePlugin;

    move-result-object v0

    .line 574
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v1

    invoke-interface {v0}, Lcom/getcapacitor/NativePlugin;->permissions()[Ljava/lang/String;

    move-result-object v2

    invoke-interface {v0}, Lcom/getcapacitor/NativePlugin;->permissionRequestCode()I

    move-result v0

    invoke-static {v1, v2, v0}, Landroidx/core/app/ActivityCompat;->requestPermissions(Landroid/app/Activity;[Ljava/lang/String;I)V

    return-void
.end method

.method public pluginRequestPermission(Ljava/lang/String;I)V
    .locals 3
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 586
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v0

    const/4 v1, 0x1

    new-array v1, v1, [Ljava/lang/String;

    const/4 v2, 0x0

    aput-object p1, v1, v2

    invoke-static {v0, v1, p2}, Landroidx/core/app/ActivityCompat;->requestPermissions(Landroid/app/Activity;[Ljava/lang/String;I)V

    return-void
.end method

.method public pluginRequestPermissions([Ljava/lang/String;I)V
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 599
    invoke-virtual {p0}, Lcom/getcapacitor/Plugin;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v0

    invoke-static {v0, p1, p2}, Landroidx/core/app/ActivityCompat;->requestPermissions(Landroid/app/Activity;[Ljava/lang/String;I)V

    return-void
.end method

.method public removeAllListeners()V
    .locals 1

    .line 766
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->eventListeners:Ljava/util/Map;

    invoke-interface {v0}, Ljava/util/Map;->clear()V

    return-void
.end method

.method public removeAllListeners(Lcom/getcapacitor/PluginCall;)V
    .locals 1
    .annotation runtime Lcom/getcapacitor/PluginMethod;
        returnType = "promise"
    .end annotation

    .line 761
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->eventListeners:Ljava/util/Map;

    invoke-interface {v0}, Ljava/util/Map;->clear()V

    .line 762
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void
.end method

.method public removeListener(Lcom/getcapacitor/PluginCall;)V
    .locals 2
    .annotation runtime Lcom/getcapacitor/PluginMethod;
        returnType = "none"
    .end annotation

    .line 745
    const-string v0, "eventName"

    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 746
    const-string v1, "callbackId"

    invoke-virtual {p1, v1}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    .line 747
    iget-object v1, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v1, p1}, Lcom/getcapacitor/Bridge;->getSavedCall(Ljava/lang/String;)Lcom/getcapacitor/PluginCall;

    move-result-object p1

    if-eqz p1, :cond_0

    .line 749
    invoke-direct {p0, v0, p1}, Lcom/getcapacitor/Plugin;->removeEventListener(Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V

    .line 750
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/Bridge;->releaseCall(Lcom/getcapacitor/PluginCall;)V

    :cond_0
    return-void
.end method

.method protected requestAllPermissions(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V
    .locals 6

    .line 445
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v0}, Lcom/getcapacitor/PluginHandle;->getPluginAnnotation()Lcom/getcapacitor/annotation/CapacitorPlugin;

    move-result-object v0

    if-eqz v0, :cond_1

    .line 447
    new-instance v1, Ljava/util/HashSet;

    invoke-direct {v1}, Ljava/util/HashSet;-><init>()V

    .line 448
    invoke-interface {v0}, Lcom/getcapacitor/annotation/CapacitorPlugin;->permissions()[Lcom/getcapacitor/annotation/Permission;

    move-result-object v0

    array-length v2, v0

    const/4 v3, 0x0

    move v4, v3

    :goto_0
    if-ge v4, v2, :cond_0

    aget-object v5, v0, v4

    .line 449
    invoke-interface {v5}, Lcom/getcapacitor/annotation/Permission;->strings()[Ljava/lang/String;

    move-result-object v5

    invoke-static {v5}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object v5

    invoke-virtual {v1, v5}, Ljava/util/HashSet;->addAll(Ljava/util/Collection;)Z

    add-int/lit8 v4, v4, 0x1

    goto :goto_0

    .line 452
    :cond_0
    new-array v0, v3, [Ljava/lang/String;

    invoke-virtual {v1, v0}, Ljava/util/HashSet;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object v0

    check-cast v0, [Ljava/lang/String;

    invoke-direct {p0, p1, v0, p2}, Lcom/getcapacitor/Plugin;->permissionActivityResult(Lcom/getcapacitor/PluginCall;[Ljava/lang/String;Ljava/lang/String;)V

    :cond_1
    return-void
.end method

.method protected requestPermissionForAlias(Ljava/lang/String;Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V
    .locals 2

    const/4 v0, 0x1

    .line 468
    new-array v0, v0, [Ljava/lang/String;

    const/4 v1, 0x0

    aput-object p1, v0, v1

    invoke-virtual {p0, v0, p2, p3}, Lcom/getcapacitor/Plugin;->requestPermissionForAliases([Ljava/lang/String;Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    return-void
.end method

.method protected requestPermissionForAliases([Ljava/lang/String;Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V
    .locals 1

    .line 483
    array-length v0, p1

    if-nez v0, :cond_0

    .line 484
    const-string p1, "No permission alias was provided"

    invoke-static {p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    return-void

    .line 488
    :cond_0
    invoke-direct {p0, p1}, Lcom/getcapacitor/Plugin;->getPermissionStringsForAliases([Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p1

    .line 490
    array-length v0, p1

    if-lez v0, :cond_1

    .line 491
    invoke-direct {p0, p2, p1, p3}, Lcom/getcapacitor/Plugin;->permissionActivityResult(Lcom/getcapacitor/PluginCall;[Ljava/lang/String;Ljava/lang/String;)V

    :cond_1
    return-void
.end method

.method public requestPermissions(Lcom/getcapacitor/PluginCall;)V
    .locals 10
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 805
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    invoke-virtual {v0}, Lcom/getcapacitor/PluginHandle;->getPluginAnnotation()Lcom/getcapacitor/annotation/CapacitorPlugin;

    move-result-object v0

    if-nez v0, :cond_0

    .line 807
    invoke-direct {p0, p1}, Lcom/getcapacitor/Plugin;->handleLegacyPermission(Lcom/getcapacitor/PluginCall;)V

    return-void

    .line 811
    :cond_0
    new-instance v1, Ljava/util/HashSet;

    invoke-direct {v1}, Ljava/util/HashSet;-><init>()V

    .line 815
    const-string v2, "permissions"

    invoke-virtual {p1, v2}, Lcom/getcapacitor/PluginCall;->getArray(Ljava/lang/String;)Lcom/getcapacitor/JSArray;

    move-result-object v2

    const/4 v3, 0x0

    if-eqz v2, :cond_1

    .line 820
    :try_start_0
    invoke-virtual {v2}, Lcom/getcapacitor/JSArray;->toList()Ljava/util/List;

    move-result-object v2
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    :cond_1
    move-object v2, v3

    .line 827
    :goto_0
    new-instance v4, Ljava/util/HashSet;

    invoke-direct {v4}, Ljava/util/HashSet;-><init>()V

    const/4 v5, 0x0

    if-eqz v2, :cond_6

    .line 828
    invoke-interface {v2}, Ljava/util/List;->isEmpty()Z

    move-result v6

    if-eqz v6, :cond_2

    goto :goto_2

    .line 843
    :cond_2
    invoke-interface {v0}, Lcom/getcapacitor/annotation/CapacitorPlugin;->permissions()[Lcom/getcapacitor/annotation/Permission;

    move-result-object v0

    array-length v6, v0

    move v7, v5

    :goto_1
    if-ge v7, v6, :cond_4

    aget-object v8, v0, v7

    .line 844
    invoke-interface {v8}, Lcom/getcapacitor/annotation/Permission;->alias()Ljava/lang/String;

    move-result-object v9

    invoke-interface {v2, v9}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v9

    if-eqz v9, :cond_3

    .line 845
    invoke-interface {v8}, Lcom/getcapacitor/annotation/Permission;->alias()Ljava/lang/String;

    move-result-object v8

    invoke-interface {v4, v8}, Ljava/util/Set;->add(Ljava/lang/Object;)Z

    :cond_3
    add-int/lit8 v7, v7, 0x1

    goto :goto_1

    .line 849
    :cond_4
    invoke-interface {v4}, Ljava/util/Set;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_5

    .line 850
    const-string v0, "No valid permission alias was requested of this plugin."

    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->reject(Ljava/lang/String;)V

    goto :goto_6

    .line 852
    :cond_5
    new-array v0, v5, [Ljava/lang/String;

    invoke-interface {v4, v0}, Ljava/util/Set;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object v0

    move-object v3, v0

    check-cast v3, [Ljava/lang/String;

    goto :goto_6

    .line 829
    :cond_6
    :goto_2
    invoke-interface {v0}, Lcom/getcapacitor/annotation/CapacitorPlugin;->permissions()[Lcom/getcapacitor/annotation/Permission;

    move-result-object v0

    array-length v2, v0

    move v3, v5

    :goto_3
    if-ge v3, v2, :cond_a

    aget-object v6, v0, v3

    .line 832
    invoke-interface {v6}, Lcom/getcapacitor/annotation/Permission;->strings()[Ljava/lang/String;

    move-result-object v7

    array-length v7, v7

    if-eqz v7, :cond_8

    invoke-interface {v6}, Lcom/getcapacitor/annotation/Permission;->strings()[Ljava/lang/String;

    move-result-object v7

    array-length v7, v7

    const/4 v8, 0x1

    if-ne v7, v8, :cond_7

    invoke-interface {v6}, Lcom/getcapacitor/annotation/Permission;->strings()[Ljava/lang/String;

    move-result-object v7

    aget-object v7, v7, v5

    invoke-virtual {v7}, Ljava/lang/String;->isEmpty()Z

    move-result v7

    if-eqz v7, :cond_7

    goto :goto_4

    .line 837
    :cond_7
    invoke-interface {v6}, Lcom/getcapacitor/annotation/Permission;->alias()Ljava/lang/String;

    move-result-object v6

    invoke-interface {v4, v6}, Ljava/util/Set;->add(Ljava/lang/Object;)Z

    goto :goto_5

    .line 833
    :cond_8
    :goto_4
    invoke-interface {v6}, Lcom/getcapacitor/annotation/Permission;->alias()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/String;->isEmpty()Z

    move-result v7

    if-nez v7, :cond_9

    .line 834
    invoke-interface {v6}, Lcom/getcapacitor/annotation/Permission;->alias()Ljava/lang/String;

    move-result-object v6

    invoke-interface {v1, v6}, Ljava/util/Set;->add(Ljava/lang/Object;)Z

    :cond_9
    :goto_5
    add-int/lit8 v3, v3, 0x1

    goto :goto_3

    .line 841
    :cond_a
    new-array v0, v5, [Ljava/lang/String;

    invoke-interface {v4, v0}, Ljava/util/Set;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object v0

    move-object v3, v0

    check-cast v3, [Ljava/lang/String;

    :goto_6
    if-eqz v3, :cond_b

    .line 856
    array-length v0, v3

    if-lez v0, :cond_b

    .line 858
    const-string v0, "checkPermissions"

    invoke-virtual {p0, v3, p1, v0}, Lcom/getcapacitor/Plugin;->requestPermissionForAliases([Ljava/lang/String;Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V

    goto :goto_8

    .line 859
    :cond_b
    invoke-interface {v1}, Ljava/util/Set;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_d

    .line 861
    new-instance v0, Lcom/getcapacitor/JSObject;

    invoke-direct {v0}, Lcom/getcapacitor/JSObject;-><init>()V

    .line 863
    invoke-interface {v1}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v1

    :goto_7
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_c

    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    .line 864
    sget-object v3, Lcom/getcapacitor/PermissionState;->GRANTED:Lcom/getcapacitor/PermissionState;

    invoke-virtual {v3}, Lcom/getcapacitor/PermissionState;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v2, v3}, Lcom/getcapacitor/JSObject;->put(Ljava/lang/String;Ljava/lang/String;)Lcom/getcapacitor/JSObject;

    goto :goto_7

    .line 867
    :cond_c
    invoke-virtual {p1, v0}, Lcom/getcapacitor/PluginCall;->resolve(Lcom/getcapacitor/JSObject;)V

    goto :goto_8

    .line 870
    :cond_d
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->resolve()V

    :goto_8
    return-void
.end method

.method protected restoreState(Landroid/os/Bundle;)V
    .locals 0

    return-void
.end method

.method public saveCall(Lcom/getcapacitor/PluginCall;)V
    .locals 0
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 265
    iput-object p1, p0, Lcom/getcapacitor/Plugin;->savedLastCall:Lcom/getcapacitor/PluginCall;

    return-void
.end method

.method protected saveInstanceState()Landroid/os/Bundle;
    .locals 3

    .line 922
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    iget-object v1, p0, Lcom/getcapacitor/Plugin;->lastPluginCallId:Ljava/lang/String;

    invoke-virtual {v0, v1}, Lcom/getcapacitor/Bridge;->getSavedCall(Ljava/lang/String;)Lcom/getcapacitor/PluginCall;

    move-result-object v0

    if-nez v0, :cond_0

    const/4 v0, 0x0

    return-object v0

    .line 928
    :cond_0
    new-instance v1, Landroid/os/Bundle;

    invoke-direct {v1}, Landroid/os/Bundle;-><init>()V

    .line 929
    invoke-virtual {v0}, Lcom/getcapacitor/PluginCall;->getData()Lcom/getcapacitor/JSObject;

    move-result-object v0

    if-eqz v0, :cond_1

    .line 932
    const-string v2, "_json"

    invoke-virtual {v0}, Lcom/getcapacitor/JSObject;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v2, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    :cond_1
    return-object v1
.end method

.method public setBridge(Lcom/getcapacitor/Bridge;)V
    .locals 0

    .line 217
    iput-object p1, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    return-void
.end method

.method public setPluginHandle(Lcom/getcapacitor/PluginHandle;)V
    .locals 0

    .line 234
    iput-object p1, p0, Lcom/getcapacitor/Plugin;->handle:Lcom/getcapacitor/PluginHandle;

    return-void
.end method

.method public shouldOverrideLoad(Landroid/net/Uri;)Ljava/lang/Boolean;
    .locals 0

    const/4 p1, 0x0

    return-object p1
.end method

.method protected startActivityForResult(Lcom/getcapacitor/PluginCall;Landroid/content/Intent;I)V
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 1025
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0, p1, p2, p3}, Lcom/getcapacitor/Bridge;->startActivityForPluginWithResult(Lcom/getcapacitor/PluginCall;Landroid/content/Intent;I)V

    return-void
.end method

.method public startActivityForResult(Lcom/getcapacitor/PluginCall;Landroid/content/Intent;Ljava/lang/String;)V
    .locals 1

    .line 174
    invoke-direct {p0, p1, p3}, Lcom/getcapacitor/Plugin;->getActivityLauncherOrReject(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)Landroidx/activity/result/ActivityResultLauncher;

    move-result-object p3

    if-nez p3, :cond_0

    return-void

    .line 179
    :cond_0
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/Bridge;->setPluginCallForLastActivity(Lcom/getcapacitor/PluginCall;)V

    .line 180
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->getCallbackId()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/Plugin;->lastPluginCallId:Ljava/lang/String;

    .line 181
    iget-object v0, p0, Lcom/getcapacitor/Plugin;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0, p1}, Lcom/getcapacitor/Bridge;->saveCall(Lcom/getcapacitor/PluginCall;)V

    .line 182
    invoke-virtual {p3, p2}, Landroidx/activity/result/ActivityResultLauncher;->launch(Ljava/lang/Object;)V

    return-void
.end method
