.class public Lcom/getcapacitor/PluginHandle;
.super Ljava/lang/Object;
.source "PluginHandle.java"


# instance fields
.field private final bridge:Lcom/getcapacitor/Bridge;

.field private instance:Lcom/getcapacitor/Plugin;

.field private legacyPluginAnnotation:Lcom/getcapacitor/NativePlugin;

.field private pluginAnnotation:Lcom/getcapacitor/annotation/CapacitorPlugin;

.field private final pluginClass:Ljava/lang/Class;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/lang/Class<",
            "+",
            "Lcom/getcapacitor/Plugin;",
            ">;"
        }
    .end annotation
.end field

.field private final pluginId:Ljava/lang/String;

.field private final pluginMethods:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Lcom/getcapacitor/PluginMethodHandle;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method public constructor <init>(Lcom/getcapacitor/Bridge;Lcom/getcapacitor/Plugin;)V
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lcom/getcapacitor/InvalidPluginException;
        }
    .end annotation

    .line 69
    invoke-virtual {p2}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v0

    invoke-direct {p0, v0, p1}, Lcom/getcapacitor/PluginHandle;-><init>(Ljava/lang/Class;Lcom/getcapacitor/Bridge;)V

    .line 70
    invoke-virtual {p0, p2}, Lcom/getcapacitor/PluginHandle;->loadInstance(Lcom/getcapacitor/Plugin;)Lcom/getcapacitor/Plugin;

    return-void
.end method

.method public constructor <init>(Lcom/getcapacitor/Bridge;Ljava/lang/Class;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Lcom/getcapacitor/Bridge;",
            "Ljava/lang/Class<",
            "+",
            "Lcom/getcapacitor/Plugin;",
            ">;)V"
        }
    .end annotation

    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lcom/getcapacitor/InvalidPluginException;,
            Lcom/getcapacitor/PluginLoadException;
        }
    .end annotation

    .line 64
    invoke-direct {p0, p2, p1}, Lcom/getcapacitor/PluginHandle;-><init>(Ljava/lang/Class;Lcom/getcapacitor/Bridge;)V

    .line 65
    invoke-virtual {p0}, Lcom/getcapacitor/PluginHandle;->load()Lcom/getcapacitor/Plugin;

    return-void
.end method

.method private constructor <init>(Ljava/lang/Class;Lcom/getcapacitor/Bridge;)V
    .locals 2
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/Class<",
            "+",
            "Lcom/getcapacitor/Plugin;",
            ">;",
            "Lcom/getcapacitor/Bridge;",
            ")V"
        }
    .end annotation

    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lcom/getcapacitor/InvalidPluginException;
        }
    .end annotation

    .line 31
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 19
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginMethods:Ljava/util/Map;

    .line 32
    iput-object p2, p0, Lcom/getcapacitor/PluginHandle;->bridge:Lcom/getcapacitor/Bridge;

    .line 33
    iput-object p1, p0, Lcom/getcapacitor/PluginHandle;->pluginClass:Ljava/lang/Class;

    .line 35
    const-class p2, Lcom/getcapacitor/annotation/CapacitorPlugin;

    invoke-virtual {p1, p2}, Ljava/lang/Class;->getAnnotation(Ljava/lang/Class;)Ljava/lang/annotation/Annotation;

    move-result-object p2

    check-cast p2, Lcom/getcapacitor/annotation/CapacitorPlugin;

    .line 36
    const-string v0, ""

    if-nez p2, :cond_2

    .line 38
    const-class p2, Lcom/getcapacitor/NativePlugin;

    invoke-virtual {p1, p2}, Ljava/lang/Class;->getAnnotation(Ljava/lang/Class;)Ljava/lang/annotation/Annotation;

    move-result-object p2

    check-cast p2, Lcom/getcapacitor/NativePlugin;

    if-eqz p2, :cond_1

    .line 43
    invoke-interface {p2}, Lcom/getcapacitor/NativePlugin;->name()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 44
    invoke-interface {p2}, Lcom/getcapacitor/NativePlugin;->name()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginId:Ljava/lang/String;

    goto :goto_0

    .line 46
    :cond_0
    invoke-virtual {p1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginId:Ljava/lang/String;

    .line 49
    :goto_0
    iput-object p2, p0, Lcom/getcapacitor/PluginHandle;->legacyPluginAnnotation:Lcom/getcapacitor/NativePlugin;

    goto :goto_2

    .line 40
    :cond_1
    new-instance p2, Lcom/getcapacitor/InvalidPluginException;

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "No @CapacitorPlugin annotation found for plugin "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p1}, Ljava/lang/Class;->getName()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-direct {p2, p1}, Lcom/getcapacitor/InvalidPluginException;-><init>(Ljava/lang/String;)V

    throw p2

    .line 51
    :cond_2
    invoke-interface {p2}, Lcom/getcapacitor/annotation/CapacitorPlugin;->name()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_3

    .line 52
    invoke-interface {p2}, Lcom/getcapacitor/annotation/CapacitorPlugin;->name()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginId:Ljava/lang/String;

    goto :goto_1

    .line 54
    :cond_3
    invoke-virtual {p1}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginId:Ljava/lang/String;

    .line 57
    :goto_1
    iput-object p2, p0, Lcom/getcapacitor/PluginHandle;->pluginAnnotation:Lcom/getcapacitor/annotation/CapacitorPlugin;

    .line 60
    :goto_2
    invoke-direct {p0, p1}, Lcom/getcapacitor/PluginHandle;->indexMethods(Ljava/lang/Class;)V

    return-void
.end method

.method private indexMethods(Ljava/lang/Class;)V
    .locals 5
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/Class<",
            "+",
            "Lcom/getcapacitor/Plugin;",
            ">;)V"
        }
    .end annotation

    .line 147
    iget-object p1, p0, Lcom/getcapacitor/PluginHandle;->pluginClass:Ljava/lang/Class;

    invoke-virtual {p1}, Ljava/lang/Class;->getMethods()[Ljava/lang/reflect/Method;

    move-result-object p1

    .line 149
    array-length v0, p1

    const/4 v1, 0x0

    :goto_0
    if-ge v1, v0, :cond_1

    aget-object v2, p1, v1

    .line 150
    const-class v3, Lcom/getcapacitor/PluginMethod;

    invoke-virtual {v2, v3}, Ljava/lang/reflect/Method;->getAnnotation(Ljava/lang/Class;)Ljava/lang/annotation/Annotation;

    move-result-object v3

    check-cast v3, Lcom/getcapacitor/PluginMethod;

    if-nez v3, :cond_0

    goto :goto_1

    .line 156
    :cond_0
    new-instance v4, Lcom/getcapacitor/PluginMethodHandle;

    invoke-direct {v4, v2, v3}, Lcom/getcapacitor/PluginMethodHandle;-><init>(Ljava/lang/reflect/Method;Lcom/getcapacitor/PluginMethod;)V

    .line 157
    iget-object v3, p0, Lcom/getcapacitor/PluginHandle;->pluginMethods:Ljava/util/Map;

    invoke-virtual {v2}, Ljava/lang/reflect/Method;->getName()Ljava/lang/String;

    move-result-object v2

    invoke-interface {v3, v2, v4}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    :goto_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    :cond_1
    return-void
.end method


# virtual methods
.method public getId()Ljava/lang/String;
    .locals 1

    .line 78
    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginId:Ljava/lang/String;

    return-object v0
.end method

.method public getInstance()Lcom/getcapacitor/Plugin;
    .locals 1

    .line 91
    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->instance:Lcom/getcapacitor/Plugin;

    return-object v0
.end method

.method public getLegacyPluginAnnotation()Lcom/getcapacitor/NativePlugin;
    .locals 1

    .line 83
    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->legacyPluginAnnotation:Lcom/getcapacitor/NativePlugin;

    return-object v0
.end method

.method public getMethods()Ljava/util/Collection;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()",
            "Ljava/util/Collection<",
            "Lcom/getcapacitor/PluginMethodHandle;",
            ">;"
        }
    .end annotation

    .line 95
    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginMethods:Ljava/util/Map;

    invoke-interface {v0}, Ljava/util/Map;->values()Ljava/util/Collection;

    move-result-object v0

    return-object v0
.end method

.method public getPluginAnnotation()Lcom/getcapacitor/annotation/CapacitorPlugin;
    .locals 1

    .line 87
    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginAnnotation:Lcom/getcapacitor/annotation/CapacitorPlugin;

    return-object v0
.end method

.method public getPluginClass()Ljava/lang/Class;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()",
            "Ljava/lang/Class<",
            "+",
            "Lcom/getcapacitor/Plugin;",
            ">;"
        }
    .end annotation

    .line 74
    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginClass:Ljava/lang/Class;

    return-object v0
.end method

.method public invoke(Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V
    .locals 2
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lcom/getcapacitor/PluginLoadException;,
            Lcom/getcapacitor/InvalidPluginMethodException;,
            Ljava/lang/reflect/InvocationTargetException;,
            Ljava/lang/IllegalAccessException;
        }
    .end annotation

    .line 128
    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->instance:Lcom/getcapacitor/Plugin;

    if-nez v0, :cond_0

    .line 130
    invoke-virtual {p0}, Lcom/getcapacitor/PluginHandle;->load()Lcom/getcapacitor/Plugin;

    .line 133
    :cond_0
    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginMethods:Ljava/util/Map;

    invoke-interface {v0, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/getcapacitor/PluginMethodHandle;

    if-eqz v0, :cond_1

    .line 138
    invoke-virtual {v0}, Lcom/getcapacitor/PluginMethodHandle;->getMethod()Ljava/lang/reflect/Method;

    move-result-object p1

    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->instance:Lcom/getcapacitor/Plugin;

    filled-new-array {p2}, [Ljava/lang/Object;

    move-result-object p2

    invoke-virtual {p1, v0, p2}, Ljava/lang/reflect/Method;->invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;

    return-void

    .line 135
    :cond_1
    new-instance p2, Lcom/getcapacitor/InvalidPluginMethodException;

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "No method "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    const-string v0, " found for plugin "

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginClass:Ljava/lang/Class;

    invoke-virtual {v0}, Ljava/lang/Class;->getName()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-direct {p2, p1}, Lcom/getcapacitor/InvalidPluginMethodException;-><init>(Ljava/lang/String;)V

    throw p2
.end method

.method public load()Lcom/getcapacitor/Plugin;
    .locals 3
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Lcom/getcapacitor/PluginLoadException;
        }
    .end annotation

    .line 99
    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->instance:Lcom/getcapacitor/Plugin;

    if-eqz v0, :cond_0

    return-object v0

    .line 104
    :cond_0
    :try_start_0
    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->pluginClass:Ljava/lang/Class;

    const/4 v1, 0x0

    new-array v2, v1, [Ljava/lang/Class;

    invoke-virtual {v0, v2}, Ljava/lang/Class;->getDeclaredConstructor([Ljava/lang/Class;)Ljava/lang/reflect/Constructor;

    move-result-object v0

    new-array v1, v1, [Ljava/lang/Object;

    invoke-virtual {v0, v1}, Ljava/lang/reflect/Constructor;->newInstance([Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/getcapacitor/Plugin;

    iput-object v0, p0, Lcom/getcapacitor/PluginHandle;->instance:Lcom/getcapacitor/Plugin;

    .line 105
    invoke-virtual {p0, v0}, Lcom/getcapacitor/PluginHandle;->loadInstance(Lcom/getcapacitor/Plugin;)Lcom/getcapacitor/Plugin;

    move-result-object v0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object v0

    .line 107
    :catch_0
    new-instance v0, Lcom/getcapacitor/PluginLoadException;

    const-string v1, "Unable to load plugin instance. Ensure plugin is publicly accessible"

    invoke-direct {v0, v1}, Lcom/getcapacitor/PluginLoadException;-><init>(Ljava/lang/String;)V

    throw v0
.end method

.method public loadInstance(Lcom/getcapacitor/Plugin;)Lcom/getcapacitor/Plugin;
    .locals 1

    .line 112
    iput-object p1, p0, Lcom/getcapacitor/PluginHandle;->instance:Lcom/getcapacitor/Plugin;

    .line 113
    invoke-virtual {p1, p0}, Lcom/getcapacitor/Plugin;->setPluginHandle(Lcom/getcapacitor/PluginHandle;)V

    .line 114
    iget-object p1, p0, Lcom/getcapacitor/PluginHandle;->instance:Lcom/getcapacitor/Plugin;

    iget-object v0, p0, Lcom/getcapacitor/PluginHandle;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p1, v0}, Lcom/getcapacitor/Plugin;->setBridge(Lcom/getcapacitor/Bridge;)V

    .line 115
    iget-object p1, p0, Lcom/getcapacitor/PluginHandle;->instance:Lcom/getcapacitor/Plugin;

    invoke-virtual {p1}, Lcom/getcapacitor/Plugin;->load()V

    .line 116
    iget-object p1, p0, Lcom/getcapacitor/PluginHandle;->instance:Lcom/getcapacitor/Plugin;

    invoke-virtual {p1}, Lcom/getcapacitor/Plugin;->initializeActivityLaunchers()V

    .line 117
    iget-object p1, p0, Lcom/getcapacitor/PluginHandle;->instance:Lcom/getcapacitor/Plugin;

    return-object p1
.end method
