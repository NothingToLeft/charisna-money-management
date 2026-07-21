.class public Lcom/getcapacitor/CapConfig$Builder;
.super Ljava/lang/Object;
.source "CapConfig.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/getcapacitor/CapConfig;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x9
    name = "Builder"
.end annotation


# instance fields
.field private allowMixedContent:Z

.field private allowNavigation:[Ljava/lang/String;

.field private androidScheme:Ljava/lang/String;

.field private appendedUserAgentString:Ljava/lang/String;

.field private backgroundColor:Ljava/lang/String;

.field private captureInput:Z

.field private context:Landroid/content/Context;

.field private errorPath:Ljava/lang/String;

.field private hostname:Ljava/lang/String;

.field private html5mode:Z

.field private initialFocus:Z

.field private loggingEnabled:Z

.field private minHuaweiWebViewVersion:I

.field private minWebViewVersion:I

.field private overriddenUserAgentString:Ljava/lang/String;

.field private pluginsConfiguration:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Lcom/getcapacitor/PluginConfig;",
            ">;"
        }
    .end annotation
.end field

.field private resolveServiceWorkerRequests:Z

.field private serverUrl:Ljava/lang/String;

.field private startPath:Ljava/lang/String;

.field private useLegacyBridge:Z

.field private webContentsDebuggingEnabled:Ljava/lang/Boolean;

.field private zoomableWebView:Z


# direct methods
.method static bridge synthetic -$$Nest$fgetallowMixedContent(Lcom/getcapacitor/CapConfig$Builder;)Z
    .locals 0

    iget-boolean p0, p0, Lcom/getcapacitor/CapConfig$Builder;->allowMixedContent:Z

    return p0
.end method

.method static bridge synthetic -$$Nest$fgetallowNavigation(Lcom/getcapacitor/CapConfig$Builder;)[Ljava/lang/String;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->allowNavigation:[Ljava/lang/String;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetandroidScheme(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->androidScheme:Ljava/lang/String;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetappendedUserAgentString(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->appendedUserAgentString:Ljava/lang/String;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetbackgroundColor(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->backgroundColor:Ljava/lang/String;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetcaptureInput(Lcom/getcapacitor/CapConfig$Builder;)Z
    .locals 0

    iget-boolean p0, p0, Lcom/getcapacitor/CapConfig$Builder;->captureInput:Z

    return p0
.end method

.method static bridge synthetic -$$Nest$fgeterrorPath(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->errorPath:Ljava/lang/String;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgethostname(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->hostname:Ljava/lang/String;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgethtml5mode(Lcom/getcapacitor/CapConfig$Builder;)Z
    .locals 0

    iget-boolean p0, p0, Lcom/getcapacitor/CapConfig$Builder;->html5mode:Z

    return p0
.end method

.method static bridge synthetic -$$Nest$fgetinitialFocus(Lcom/getcapacitor/CapConfig$Builder;)Z
    .locals 0

    iget-boolean p0, p0, Lcom/getcapacitor/CapConfig$Builder;->initialFocus:Z

    return p0
.end method

.method static bridge synthetic -$$Nest$fgetloggingEnabled(Lcom/getcapacitor/CapConfig$Builder;)Z
    .locals 0

    iget-boolean p0, p0, Lcom/getcapacitor/CapConfig$Builder;->loggingEnabled:Z

    return p0
.end method

.method static bridge synthetic -$$Nest$fgetminHuaweiWebViewVersion(Lcom/getcapacitor/CapConfig$Builder;)I
    .locals 0

    iget p0, p0, Lcom/getcapacitor/CapConfig$Builder;->minHuaweiWebViewVersion:I

    return p0
.end method

.method static bridge synthetic -$$Nest$fgetminWebViewVersion(Lcom/getcapacitor/CapConfig$Builder;)I
    .locals 0

    iget p0, p0, Lcom/getcapacitor/CapConfig$Builder;->minWebViewVersion:I

    return p0
.end method

.method static bridge synthetic -$$Nest$fgetoverriddenUserAgentString(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->overriddenUserAgentString:Ljava/lang/String;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetpluginsConfiguration(Lcom/getcapacitor/CapConfig$Builder;)Ljava/util/Map;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->pluginsConfiguration:Ljava/util/Map;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetresolveServiceWorkerRequests(Lcom/getcapacitor/CapConfig$Builder;)Z
    .locals 0

    iget-boolean p0, p0, Lcom/getcapacitor/CapConfig$Builder;->resolveServiceWorkerRequests:Z

    return p0
.end method

.method static bridge synthetic -$$Nest$fgetserverUrl(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->serverUrl:Ljava/lang/String;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetstartPath(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->startPath:Ljava/lang/String;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetuseLegacyBridge(Lcom/getcapacitor/CapConfig$Builder;)Z
    .locals 0

    iget-boolean p0, p0, Lcom/getcapacitor/CapConfig$Builder;->useLegacyBridge:Z

    return p0
.end method

.method static bridge synthetic -$$Nest$fgetwebContentsDebuggingEnabled(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/Boolean;
    .locals 0

    iget-object p0, p0, Lcom/getcapacitor/CapConfig$Builder;->webContentsDebuggingEnabled:Ljava/lang/Boolean;

    return-object p0
.end method

.method static bridge synthetic -$$Nest$fgetzoomableWebView(Lcom/getcapacitor/CapConfig$Builder;)Z
    .locals 0

    iget-boolean p0, p0, Lcom/getcapacitor/CapConfig$Builder;->zoomableWebView:Z

    return p0
.end method

.method public constructor <init>(Landroid/content/Context;)V
    .locals 4

    .line 597
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const/4 v0, 0x1

    .line 564
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig$Builder;->html5mode:Z

    .line 567
    const-string v1, "localhost"

    iput-object v1, p0, Lcom/getcapacitor/CapConfig$Builder;->hostname:Ljava/lang/String;

    .line 568
    const-string v1, "https"

    iput-object v1, p0, Lcom/getcapacitor/CapConfig$Builder;->androidScheme:Ljava/lang/String;

    const/4 v1, 0x0

    .line 575
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig$Builder;->allowMixedContent:Z

    .line 576
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig$Builder;->captureInput:Z

    const/4 v2, 0x0

    .line 577
    iput-object v2, p0, Lcom/getcapacitor/CapConfig$Builder;->webContentsDebuggingEnabled:Ljava/lang/Boolean;

    .line 578
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig$Builder;->loggingEnabled:Z

    .line 579
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig$Builder;->initialFocus:Z

    .line 580
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig$Builder;->useLegacyBridge:Z

    const/16 v3, 0x3c

    .line 581
    iput v3, p0, Lcom/getcapacitor/CapConfig$Builder;->minWebViewVersion:I

    const/16 v3, 0xa

    .line 582
    iput v3, p0, Lcom/getcapacitor/CapConfig$Builder;->minHuaweiWebViewVersion:I

    .line 583
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig$Builder;->zoomableWebView:Z

    .line 584
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig$Builder;->resolveServiceWorkerRequests:Z

    .line 587
    iput-object v2, p0, Lcom/getcapacitor/CapConfig$Builder;->startPath:Ljava/lang/String;

    .line 590
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/CapConfig$Builder;->pluginsConfiguration:Ljava/util/Map;

    .line 598
    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->context:Landroid/content/Context;

    return-void
.end method


# virtual methods
.method public create()Lcom/getcapacitor/CapConfig;
    .locals 2

    .line 607
    iget-object v0, p0, Lcom/getcapacitor/CapConfig$Builder;->webContentsDebuggingEnabled:Ljava/lang/Boolean;

    if-nez v0, :cond_1

    .line 608
    iget-object v0, p0, Lcom/getcapacitor/CapConfig$Builder;->context:Landroid/content/Context;

    invoke-virtual {v0}, Landroid/content/Context;->getApplicationInfo()Landroid/content/pm/ApplicationInfo;

    move-result-object v0

    iget v0, v0, Landroid/content/pm/ApplicationInfo;->flags:I

    and-int/lit8 v0, v0, 0x2

    if-eqz v0, :cond_0

    const/4 v0, 0x1

    goto :goto_0

    :cond_0
    const/4 v0, 0x0

    :goto_0
    invoke-static {v0}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/CapConfig$Builder;->webContentsDebuggingEnabled:Ljava/lang/Boolean;

    .line 611
    :cond_1
    new-instance v0, Lcom/getcapacitor/CapConfig;

    const/4 v1, 0x0

    invoke-direct {v0, p0, v1}, Lcom/getcapacitor/CapConfig;-><init>(Lcom/getcapacitor/CapConfig$Builder;Lcom/getcapacitor/CapConfig-IA;)V

    return-object v0
.end method

.method public setAllowMixedContent(Z)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 670
    iput-boolean p1, p0, Lcom/getcapacitor/CapConfig$Builder;->allowMixedContent:Z

    return-object p0
.end method

.method public setAllowNavigation([Ljava/lang/String;)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 650
    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->allowNavigation:[Ljava/lang/String;

    return-object p0
.end method

.method public setAndroidScheme(Ljava/lang/String;)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 645
    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->androidScheme:Ljava/lang/String;

    return-object p0
.end method

.method public setAppendedUserAgentString(Ljava/lang/String;)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 660
    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->appendedUserAgentString:Ljava/lang/String;

    return-object p0
.end method

.method public setBackgroundColor(Ljava/lang/String;)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 665
    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->backgroundColor:Ljava/lang/String;

    return-object p0
.end method

.method public setCaptureInput(Z)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 675
    iput-boolean p1, p0, Lcom/getcapacitor/CapConfig$Builder;->captureInput:Z

    return-object p0
.end method

.method public setErrorPath(Ljava/lang/String;)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 630
    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->errorPath:Ljava/lang/String;

    return-object p0
.end method

.method public setHTML5mode(Z)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 620
    iput-boolean p1, p0, Lcom/getcapacitor/CapConfig$Builder;->html5mode:Z

    return-object p0
.end method

.method public setHostname(Ljava/lang/String;)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 635
    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->hostname:Ljava/lang/String;

    return-object p0
.end method

.method public setInitialFocus(Z)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 705
    iput-boolean p1, p0, Lcom/getcapacitor/CapConfig$Builder;->initialFocus:Z

    return-object p0
.end method

.method public setLoggingEnabled(Z)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 700
    iput-boolean p1, p0, Lcom/getcapacitor/CapConfig$Builder;->loggingEnabled:Z

    return-object p0
.end method

.method public setOverriddenUserAgentString(Ljava/lang/String;)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 655
    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->overriddenUserAgentString:Ljava/lang/String;

    return-object p0
.end method

.method public setPluginsConfiguration(Lorg/json/JSONObject;)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 615
    invoke-static {p1}, Lcom/getcapacitor/CapConfig;->-$$Nest$smdeserializePluginsConfig(Lorg/json/JSONObject;)Ljava/util/Map;

    move-result-object p1

    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->pluginsConfiguration:Ljava/util/Map;

    return-object p0
.end method

.method public setResolveServiceWorkerRequests(Z)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 685
    iput-boolean p1, p0, Lcom/getcapacitor/CapConfig$Builder;->resolveServiceWorkerRequests:Z

    return-object p0
.end method

.method public setServerUrl(Ljava/lang/String;)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 625
    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->serverUrl:Ljava/lang/String;

    return-object p0
.end method

.method public setStartPath(Ljava/lang/String;)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 640
    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->startPath:Ljava/lang/String;

    return-object p0
.end method

.method public setUseLegacyBridge(Z)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 680
    iput-boolean p1, p0, Lcom/getcapacitor/CapConfig$Builder;->useLegacyBridge:Z

    return-object p0
.end method

.method public setWebContentsDebuggingEnabled(Z)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 690
    invoke-static {p1}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object p1

    iput-object p1, p0, Lcom/getcapacitor/CapConfig$Builder;->webContentsDebuggingEnabled:Ljava/lang/Boolean;

    return-object p0
.end method

.method public setZoomableWebView(Z)Lcom/getcapacitor/CapConfig$Builder;
    .locals 0

    .line 695
    iput-boolean p1, p0, Lcom/getcapacitor/CapConfig$Builder;->zoomableWebView:Z

    return-object p0
.end method
