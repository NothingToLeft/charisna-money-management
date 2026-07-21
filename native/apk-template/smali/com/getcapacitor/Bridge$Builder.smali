.class public Lcom/getcapacitor/Bridge$Builder;
.super Ljava/lang/Object;
.source "Bridge.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/getcapacitor/Bridge;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x9
    name = "Builder"
.end annotation


# instance fields
.field private activity:Landroidx/appcompat/app/AppCompatActivity;

.field private config:Lcom/getcapacitor/CapConfig;

.field private fragment:Landroidx/fragment/app/Fragment;

.field private instanceState:Landroid/os/Bundle;

.field private pluginInstances:Ljava/util/List;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/List<",
            "Lcom/getcapacitor/Plugin;",
            ">;"
        }
    .end annotation
.end field

.field private plugins:Ljava/util/List;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/List<",
            "Ljava/lang/Class<",
            "+",
            "Lcom/getcapacitor/Plugin;",
            ">;>;"
        }
    .end annotation
.end field

.field private routeProcessor:Lcom/getcapacitor/RouteProcessor;

.field private serverPath:Lcom/getcapacitor/ServerPath;

.field private final webViewListeners:Ljava/util/List;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/List<",
            "Lcom/getcapacitor/WebViewListener;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method public constructor <init>(Landroidx/appcompat/app/AppCompatActivity;)V
    .locals 1

    .line 1509
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const/4 v0, 0x0

    .line 1499
    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->instanceState:Landroid/os/Bundle;

    .line 1500
    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->config:Lcom/getcapacitor/CapConfig;

    .line 1501
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->plugins:Ljava/util/List;

    .line 1502
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->pluginInstances:Ljava/util/List;

    .line 1506
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->webViewListeners:Ljava/util/List;

    .line 1510
    iput-object p1, p0, Lcom/getcapacitor/Bridge$Builder;->activity:Landroidx/appcompat/app/AppCompatActivity;

    return-void
.end method

.method public constructor <init>(Landroidx/fragment/app/Fragment;)V
    .locals 1

    .line 1513
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const/4 v0, 0x0

    .line 1499
    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->instanceState:Landroid/os/Bundle;

    .line 1500
    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->config:Lcom/getcapacitor/CapConfig;

    .line 1501
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->plugins:Ljava/util/List;

    .line 1502
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->pluginInstances:Ljava/util/List;

    .line 1506
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->webViewListeners:Ljava/util/List;

    .line 1514
    invoke-virtual {p1}, Landroidx/fragment/app/Fragment;->getActivity()Landroidx/fragment/app/FragmentActivity;

    move-result-object v0

    check-cast v0, Landroidx/appcompat/app/AppCompatActivity;

    iput-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->activity:Landroidx/appcompat/app/AppCompatActivity;

    .line 1515
    iput-object p1, p0, Lcom/getcapacitor/Bridge$Builder;->fragment:Landroidx/fragment/app/Fragment;

    return-void
.end method


# virtual methods
.method public addPlugin(Ljava/lang/Class;)Lcom/getcapacitor/Bridge$Builder;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/Class<",
            "+",
            "Lcom/getcapacitor/Plugin;",
            ">;)",
            "Lcom/getcapacitor/Bridge$Builder;"
        }
    .end annotation

    .line 1534
    iget-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->plugins:Ljava/util/List;

    invoke-interface {v0, p1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    return-object p0
.end method

.method public addPluginInstance(Lcom/getcapacitor/Plugin;)Lcom/getcapacitor/Bridge$Builder;
    .locals 1

    .line 1547
    iget-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->pluginInstances:Ljava/util/List;

    invoke-interface {v0, p1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    return-object p0
.end method

.method public addPluginInstances(Ljava/util/List;)Lcom/getcapacitor/Bridge$Builder;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List<",
            "Lcom/getcapacitor/Plugin;",
            ">;)",
            "Lcom/getcapacitor/Bridge$Builder;"
        }
    .end annotation

    .line 1552
    iget-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->pluginInstances:Ljava/util/List;

    invoke-interface {v0, p1}, Ljava/util/List;->addAll(Ljava/util/Collection;)Z

    return-object p0
.end method

.method public addPlugins(Ljava/util/List;)Lcom/getcapacitor/Bridge$Builder;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List<",
            "Ljava/lang/Class<",
            "+",
            "Lcom/getcapacitor/Plugin;",
            ">;>;)",
            "Lcom/getcapacitor/Bridge$Builder;"
        }
    .end annotation

    .line 1539
    invoke-interface {p1}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object p1

    :goto_0
    invoke-interface {p1}, Ljava/util/Iterator;->hasNext()Z

    move-result v0

    if-eqz v0, :cond_0

    invoke-interface {p1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/Class;

    .line 1540
    invoke-virtual {p0, v0}, Lcom/getcapacitor/Bridge$Builder;->addPlugin(Ljava/lang/Class;)Lcom/getcapacitor/Bridge$Builder;

    goto :goto_0

    :cond_0
    return-object p0
.end method

.method public addWebViewListener(Lcom/getcapacitor/WebViewListener;)Lcom/getcapacitor/Bridge$Builder;
    .locals 1

    .line 1557
    iget-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->webViewListeners:Ljava/util/List;

    invoke-interface {v0, p1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    return-object p0
.end method

.method public addWebViewListeners(Ljava/util/List;)Lcom/getcapacitor/Bridge$Builder;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List<",
            "Lcom/getcapacitor/WebViewListener;",
            ">;)",
            "Lcom/getcapacitor/Bridge$Builder;"
        }
    .end annotation

    .line 1562
    invoke-interface {p1}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object p1

    :goto_0
    invoke-interface {p1}, Ljava/util/Iterator;->hasNext()Z

    move-result v0

    if-eqz v0, :cond_0

    invoke-interface {p1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/getcapacitor/WebViewListener;

    .line 1563
    invoke-virtual {p0, v0}, Lcom/getcapacitor/Bridge$Builder;->addWebViewListener(Lcom/getcapacitor/WebViewListener;)Lcom/getcapacitor/Bridge$Builder;

    goto :goto_0

    :cond_0
    return-object p0
.end method

.method public create()Lcom/getcapacitor/Bridge;
    .locals 14

    .line 1581
    new-instance v0, Lorg/apache/cordova/ConfigXmlParser;

    invoke-direct {v0}, Lorg/apache/cordova/ConfigXmlParser;-><init>()V

    .line 1582
    iget-object v1, p0, Lcom/getcapacitor/Bridge$Builder;->activity:Landroidx/appcompat/app/AppCompatActivity;

    invoke-virtual {v1}, Landroidx/appcompat/app/AppCompatActivity;->getApplicationContext()Landroid/content/Context;

    move-result-object v1

    invoke-virtual {v0, v1}, Lorg/apache/cordova/ConfigXmlParser;->parse(Landroid/content/Context;)V

    .line 1583
    invoke-virtual {v0}, Lorg/apache/cordova/ConfigXmlParser;->getPreferences()Lorg/apache/cordova/CordovaPreferences;

    move-result-object v11

    .line 1584
    iget-object v1, p0, Lcom/getcapacitor/Bridge$Builder;->activity:Landroidx/appcompat/app/AppCompatActivity;

    invoke-virtual {v1}, Landroidx/appcompat/app/AppCompatActivity;->getIntent()Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v1}, Landroid/content/Intent;->getExtras()Landroid/os/Bundle;

    move-result-object v1

    invoke-virtual {v11, v1}, Lorg/apache/cordova/CordovaPreferences;->setPreferencesBundle(Landroid/os/Bundle;)V

    .line 1585
    invoke-virtual {v0}, Lorg/apache/cordova/ConfigXmlParser;->getPluginEntries()Ljava/util/ArrayList;

    move-result-object v0

    .line 1587
    new-instance v9, Lcom/getcapacitor/cordova/MockCordovaInterfaceImpl;

    iget-object v1, p0, Lcom/getcapacitor/Bridge$Builder;->activity:Landroidx/appcompat/app/AppCompatActivity;

    invoke-direct {v9, v1}, Lcom/getcapacitor/cordova/MockCordovaInterfaceImpl;-><init>(Landroidx/appcompat/app/AppCompatActivity;)V

    .line 1588
    iget-object v1, p0, Lcom/getcapacitor/Bridge$Builder;->instanceState:Landroid/os/Bundle;

    if-eqz v1, :cond_0

    .line 1589
    invoke-virtual {v9, v1}, Lcom/getcapacitor/cordova/MockCordovaInterfaceImpl;->restoreInstanceState(Landroid/os/Bundle;)V

    .line 1592
    :cond_0
    iget-object v1, p0, Lcom/getcapacitor/Bridge$Builder;->fragment:Landroidx/fragment/app/Fragment;

    if-eqz v1, :cond_1

    invoke-virtual {v1}, Landroidx/fragment/app/Fragment;->getView()Landroid/view/View;

    move-result-object v1

    sget v2, Lcom/getcapacitor/android/R$id;->webview:I

    invoke-virtual {v1, v2}, Landroid/view/View;->findViewById(I)Landroid/view/View;

    move-result-object v1

    goto :goto_0

    :cond_1
    iget-object v1, p0, Lcom/getcapacitor/Bridge$Builder;->activity:Landroidx/appcompat/app/AppCompatActivity;

    sget v2, Lcom/getcapacitor/android/R$id;->webview:I

    invoke-virtual {v1, v2}, Landroidx/appcompat/app/AppCompatActivity;->findViewById(I)Landroid/view/View;

    move-result-object v1

    :goto_0
    check-cast v1, Landroid/webkit/WebView;

    move-object v6, v1

    .line 1593
    new-instance v1, Lcom/getcapacitor/cordova/MockCordovaWebViewImpl;

    iget-object v2, p0, Lcom/getcapacitor/Bridge$Builder;->activity:Landroidx/appcompat/app/AppCompatActivity;

    invoke-virtual {v2}, Landroidx/appcompat/app/AppCompatActivity;->getApplicationContext()Landroid/content/Context;

    move-result-object v2

    invoke-direct {v1, v2}, Lcom/getcapacitor/cordova/MockCordovaWebViewImpl;-><init>(Landroid/content/Context;)V

    .line 1594
    invoke-virtual {v1, v9, v0, v11, v6}, Lcom/getcapacitor/cordova/MockCordovaWebViewImpl;->init(Lorg/apache/cordova/CordovaInterface;Ljava/util/List;Lorg/apache/cordova/CordovaPreferences;Landroid/webkit/WebView;)V

    .line 1595
    invoke-virtual {v1}, Lcom/getcapacitor/cordova/MockCordovaWebViewImpl;->getPluginManager()Lorg/apache/cordova/PluginManager;

    move-result-object v10

    .line 1596
    invoke-virtual {v9, v10}, Lcom/getcapacitor/cordova/MockCordovaInterfaceImpl;->onCordovaInit(Lorg/apache/cordova/PluginManager;)V

    .line 1599
    new-instance v2, Lcom/getcapacitor/Bridge;

    iget-object v3, p0, Lcom/getcapacitor/Bridge$Builder;->activity:Landroidx/appcompat/app/AppCompatActivity;

    iget-object v4, p0, Lcom/getcapacitor/Bridge$Builder;->serverPath:Lcom/getcapacitor/ServerPath;

    iget-object v5, p0, Lcom/getcapacitor/Bridge$Builder;->fragment:Landroidx/fragment/app/Fragment;

    iget-object v7, p0, Lcom/getcapacitor/Bridge$Builder;->plugins:Ljava/util/List;

    iget-object v8, p0, Lcom/getcapacitor/Bridge$Builder;->pluginInstances:Ljava/util/List;

    iget-object v12, p0, Lcom/getcapacitor/Bridge$Builder;->config:Lcom/getcapacitor/CapConfig;

    const/4 v13, 0x0

    invoke-direct/range {v2 .. v13}, Lcom/getcapacitor/Bridge;-><init>(Landroidx/appcompat/app/AppCompatActivity;Lcom/getcapacitor/ServerPath;Landroidx/fragment/app/Fragment;Landroid/webkit/WebView;Ljava/util/List;Ljava/util/List;Lcom/getcapacitor/cordova/MockCordovaInterfaceImpl;Lorg/apache/cordova/PluginManager;Lorg/apache/cordova/CordovaPreferences;Lcom/getcapacitor/CapConfig;Lcom/getcapacitor/Bridge-IA;)V

    .line 1612
    instance-of v0, v6, Lcom/getcapacitor/CapacitorWebView;

    if-eqz v0, :cond_2

    check-cast v6, Lcom/getcapacitor/CapacitorWebView;

    .line 1613
    invoke-virtual {v6, v2}, Lcom/getcapacitor/CapacitorWebView;->setBridge(Lcom/getcapacitor/Bridge;)V

    .line 1616
    :cond_2
    invoke-virtual {v2, v1}, Lcom/getcapacitor/Bridge;->setCordovaWebView(Lorg/apache/cordova/CordovaWebView;)V

    .line 1617
    iget-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->webViewListeners:Ljava/util/List;

    invoke-virtual {v2, v0}, Lcom/getcapacitor/Bridge;->setWebViewListeners(Ljava/util/List;)V

    .line 1618
    iget-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->routeProcessor:Lcom/getcapacitor/RouteProcessor;

    invoke-virtual {v2, v0}, Lcom/getcapacitor/Bridge;->setRouteProcessor(Lcom/getcapacitor/RouteProcessor;)V

    .line 1620
    iget-object v0, p0, Lcom/getcapacitor/Bridge$Builder;->instanceState:Landroid/os/Bundle;

    if-eqz v0, :cond_3

    .line 1621
    invoke-virtual {v2, v0}, Lcom/getcapacitor/Bridge;->restoreInstanceState(Landroid/os/Bundle;)V

    :cond_3
    return-object v2
.end method

.method public setConfig(Lcom/getcapacitor/CapConfig;)Lcom/getcapacitor/Bridge$Builder;
    .locals 0

    .line 1524
    iput-object p1, p0, Lcom/getcapacitor/Bridge$Builder;->config:Lcom/getcapacitor/CapConfig;

    return-object p0
.end method

.method public setInstanceState(Landroid/os/Bundle;)Lcom/getcapacitor/Bridge$Builder;
    .locals 0

    .line 1519
    iput-object p1, p0, Lcom/getcapacitor/Bridge$Builder;->instanceState:Landroid/os/Bundle;

    return-object p0
.end method

.method public setPlugins(Ljava/util/List;)Lcom/getcapacitor/Bridge$Builder;
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List<",
            "Ljava/lang/Class<",
            "+",
            "Lcom/getcapacitor/Plugin;",
            ">;>;)",
            "Lcom/getcapacitor/Bridge$Builder;"
        }
    .end annotation

    .line 1529
    iput-object p1, p0, Lcom/getcapacitor/Bridge$Builder;->plugins:Ljava/util/List;

    return-object p0
.end method

.method public setRouteProcessor(Lcom/getcapacitor/RouteProcessor;)Lcom/getcapacitor/Bridge$Builder;
    .locals 0

    .line 1570
    iput-object p1, p0, Lcom/getcapacitor/Bridge$Builder;->routeProcessor:Lcom/getcapacitor/RouteProcessor;

    return-object p0
.end method

.method public setServerPath(Lcom/getcapacitor/ServerPath;)Lcom/getcapacitor/Bridge$Builder;
    .locals 0

    .line 1575
    iput-object p1, p0, Lcom/getcapacitor/Bridge$Builder;->serverPath:Lcom/getcapacitor/ServerPath;

    return-object p0
.end method
