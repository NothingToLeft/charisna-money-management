.class public Lcom/getcapacitor/CapConfig;
.super Ljava/lang/Object;
.source "CapConfig.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/getcapacitor/CapConfig$Builder;
    }
.end annotation


# static fields
.field private static final LOG_BEHAVIOR_DEBUG:Ljava/lang/String; = "debug"

.field private static final LOG_BEHAVIOR_NONE:Ljava/lang/String; = "none"

.field private static final LOG_BEHAVIOR_PRODUCTION:Ljava/lang/String; = "production"


# instance fields
.field private allowMixedContent:Z

.field private allowNavigation:[Ljava/lang/String;

.field private androidScheme:Ljava/lang/String;

.field private appendedUserAgentString:Ljava/lang/String;

.field private backgroundColor:Ljava/lang/String;

.field private captureInput:Z

.field private configJSON:Lorg/json/JSONObject;

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

.field private webContentsDebuggingEnabled:Z

.field private zoomableWebView:Z


# direct methods
.method static bridge synthetic -$$Nest$smdeserializePluginsConfig(Lorg/json/JSONObject;)Ljava/util/Map;
    .locals 0

    invoke-static {p0}, Lcom/getcapacitor/CapConfig;->deserializePluginsConfig(Lorg/json/JSONObject;)Ljava/util/Map;

    move-result-object p0

    return-object p0
.end method

.method private constructor <init>()V
    .locals 3

    .line 70
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const/4 v0, 0x1

    .line 36
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->html5mode:Z

    .line 38
    const-string v1, "localhost"

    iput-object v1, p0, Lcom/getcapacitor/CapConfig;->hostname:Ljava/lang/String;

    .line 39
    const-string v1, "https"

    iput-object v1, p0, Lcom/getcapacitor/CapConfig;->androidScheme:Ljava/lang/String;

    const/4 v1, 0x0

    .line 46
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->allowMixedContent:Z

    .line 47
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->captureInput:Z

    .line 48
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->webContentsDebuggingEnabled:Z

    .line 49
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->loggingEnabled:Z

    .line 50
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->initialFocus:Z

    .line 51
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->useLegacyBridge:Z

    const/16 v2, 0x3c

    .line 52
    iput v2, p0, Lcom/getcapacitor/CapConfig;->minWebViewVersion:I

    const/16 v2, 0xa

    .line 53
    iput v2, p0, Lcom/getcapacitor/CapConfig;->minHuaweiWebViewVersion:I

    .line 55
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->zoomableWebView:Z

    .line 56
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->resolveServiceWorkerRequests:Z

    const/4 v0, 0x0

    .line 62
    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->pluginsConfiguration:Ljava/util/Map;

    .line 65
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    return-void
.end method

.method public constructor <init>(Landroid/content/res/AssetManager;Lorg/json/JSONObject;)V
    .locals 3
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 82
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const/4 v0, 0x1

    .line 36
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->html5mode:Z

    .line 38
    const-string v1, "localhost"

    iput-object v1, p0, Lcom/getcapacitor/CapConfig;->hostname:Ljava/lang/String;

    .line 39
    const-string v1, "https"

    iput-object v1, p0, Lcom/getcapacitor/CapConfig;->androidScheme:Ljava/lang/String;

    const/4 v1, 0x0

    .line 46
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->allowMixedContent:Z

    .line 47
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->captureInput:Z

    .line 48
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->webContentsDebuggingEnabled:Z

    .line 49
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->loggingEnabled:Z

    .line 50
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->initialFocus:Z

    .line 51
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->useLegacyBridge:Z

    const/16 v2, 0x3c

    .line 52
    iput v2, p0, Lcom/getcapacitor/CapConfig;->minWebViewVersion:I

    const/16 v2, 0xa

    .line 53
    iput v2, p0, Lcom/getcapacitor/CapConfig;->minHuaweiWebViewVersion:I

    .line 55
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->zoomableWebView:Z

    .line 56
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->resolveServiceWorkerRequests:Z

    const/4 v0, 0x0

    .line 62
    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->pluginsConfiguration:Ljava/util/Map;

    .line 65
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1}, Lorg/json/JSONObject;-><init>()V

    iput-object v1, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    if-eqz p2, :cond_0

    .line 84
    iput-object p2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    goto :goto_0

    .line 87
    :cond_0
    invoke-direct {p0, p1, v0}, Lcom/getcapacitor/CapConfig;->loadConfigFromAssets(Landroid/content/res/AssetManager;Ljava/lang/String;)V

    .line 90
    :goto_0
    invoke-direct {p0, v0}, Lcom/getcapacitor/CapConfig;->deserializeConfig(Landroid/content/Context;)V

    return-void
.end method

.method private constructor <init>(Lcom/getcapacitor/CapConfig$Builder;)V
    .locals 3

    .line 157
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const/4 v0, 0x1

    .line 36
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->html5mode:Z

    .line 38
    const-string v1, "localhost"

    iput-object v1, p0, Lcom/getcapacitor/CapConfig;->hostname:Ljava/lang/String;

    .line 39
    const-string v1, "https"

    iput-object v1, p0, Lcom/getcapacitor/CapConfig;->androidScheme:Ljava/lang/String;

    const/4 v1, 0x0

    .line 46
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->allowMixedContent:Z

    .line 47
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->captureInput:Z

    .line 48
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->webContentsDebuggingEnabled:Z

    .line 49
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->loggingEnabled:Z

    .line 50
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->initialFocus:Z

    .line 51
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->useLegacyBridge:Z

    const/16 v2, 0x3c

    .line 52
    iput v2, p0, Lcom/getcapacitor/CapConfig;->minWebViewVersion:I

    const/16 v2, 0xa

    .line 53
    iput v2, p0, Lcom/getcapacitor/CapConfig;->minHuaweiWebViewVersion:I

    .line 55
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->zoomableWebView:Z

    .line 56
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->resolveServiceWorkerRequests:Z

    const/4 v0, 0x0

    .line 62
    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->pluginsConfiguration:Ljava/util/Map;

    .line 65
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    .line 159
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgethtml5mode(Lcom/getcapacitor/CapConfig$Builder;)Z

    move-result v0

    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->html5mode:Z

    .line 160
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetserverUrl(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->serverUrl:Ljava/lang/String;

    .line 161
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgethostname(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->hostname:Ljava/lang/String;

    .line 163
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetandroidScheme(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;

    move-result-object v0

    invoke-direct {p0, v0}, Lcom/getcapacitor/CapConfig;->validateScheme(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 164
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetandroidScheme(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->androidScheme:Ljava/lang/String;

    .line 167
    :cond_0
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetallowNavigation(Lcom/getcapacitor/CapConfig$Builder;)[Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->allowNavigation:[Ljava/lang/String;

    .line 170
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetoverriddenUserAgentString(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->overriddenUserAgentString:Ljava/lang/String;

    .line 171
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetappendedUserAgentString(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->appendedUserAgentString:Ljava/lang/String;

    .line 172
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetbackgroundColor(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->backgroundColor:Ljava/lang/String;

    .line 173
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetallowMixedContent(Lcom/getcapacitor/CapConfig$Builder;)Z

    move-result v0

    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->allowMixedContent:Z

    .line 174
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetcaptureInput(Lcom/getcapacitor/CapConfig$Builder;)Z

    move-result v0

    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->captureInput:Z

    .line 175
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetwebContentsDebuggingEnabled(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/Boolean;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/Boolean;->booleanValue()Z

    move-result v0

    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->webContentsDebuggingEnabled:Z

    .line 176
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetloggingEnabled(Lcom/getcapacitor/CapConfig$Builder;)Z

    move-result v0

    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->loggingEnabled:Z

    .line 177
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetinitialFocus(Lcom/getcapacitor/CapConfig$Builder;)Z

    move-result v0

    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->initialFocus:Z

    .line 178
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetuseLegacyBridge(Lcom/getcapacitor/CapConfig$Builder;)Z

    move-result v0

    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->useLegacyBridge:Z

    .line 179
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetminWebViewVersion(Lcom/getcapacitor/CapConfig$Builder;)I

    move-result v0

    iput v0, p0, Lcom/getcapacitor/CapConfig;->minWebViewVersion:I

    .line 180
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetminHuaweiWebViewVersion(Lcom/getcapacitor/CapConfig$Builder;)I

    move-result v0

    iput v0, p0, Lcom/getcapacitor/CapConfig;->minHuaweiWebViewVersion:I

    .line 181
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgeterrorPath(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->errorPath:Ljava/lang/String;

    .line 182
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetzoomableWebView(Lcom/getcapacitor/CapConfig$Builder;)Z

    move-result v0

    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->zoomableWebView:Z

    .line 183
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetresolveServiceWorkerRequests(Lcom/getcapacitor/CapConfig$Builder;)Z

    move-result v0

    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->resolveServiceWorkerRequests:Z

    .line 186
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetstartPath(Lcom/getcapacitor/CapConfig$Builder;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->startPath:Ljava/lang/String;

    .line 189
    invoke-static {p1}, Lcom/getcapacitor/CapConfig$Builder;->-$$Nest$fgetpluginsConfiguration(Lcom/getcapacitor/CapConfig$Builder;)Ljava/util/Map;

    move-result-object p1

    iput-object p1, p0, Lcom/getcapacitor/CapConfig;->pluginsConfiguration:Ljava/util/Map;

    return-void
.end method

.method synthetic constructor <init>(Lcom/getcapacitor/CapConfig$Builder;Lcom/getcapacitor/CapConfig-IA;)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/getcapacitor/CapConfig;-><init>(Lcom/getcapacitor/CapConfig$Builder;)V

    return-void
.end method

.method private deserializeConfig(Landroid/content/Context;)V
    .locals 6

    const/4 v0, 0x1

    const/4 v1, 0x0

    if-eqz p1, :cond_0

    .line 245
    invoke-virtual {p1}, Landroid/content/Context;->getApplicationInfo()Landroid/content/pm/ApplicationInfo;

    move-result-object p1

    iget p1, p1, Landroid/content/pm/ApplicationInfo;->flags:I

    and-int/lit8 p1, p1, 0x2

    if-eqz p1, :cond_0

    move p1, v0

    goto :goto_0

    :cond_0
    move p1, v1

    .line 248
    :goto_0
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "server.html5mode"

    iget-boolean v4, p0, Lcom/getcapacitor/CapConfig;->html5mode:Z

    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result v2

    iput-boolean v2, p0, Lcom/getcapacitor/CapConfig;->html5mode:Z

    .line 249
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "server.url"

    const/4 v4, 0x0

    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/getcapacitor/CapConfig;->serverUrl:Ljava/lang/String;

    .line 250
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "server.hostname"

    iget-object v5, p0, Lcom/getcapacitor/CapConfig;->hostname:Ljava/lang/String;

    invoke-static {v2, v3, v5}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/getcapacitor/CapConfig;->hostname:Ljava/lang/String;

    .line 251
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "server.errorPath"

    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/getcapacitor/CapConfig;->errorPath:Ljava/lang/String;

    .line 252
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "server.appStartPath"

    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/getcapacitor/CapConfig;->startPath:Ljava/lang/String;

    .line 254
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "server.androidScheme"

    iget-object v5, p0, Lcom/getcapacitor/CapConfig;->androidScheme:Ljava/lang/String;

    invoke-static {v2, v3, v5}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 255
    invoke-direct {p0, v2}, Lcom/getcapacitor/CapConfig;->validateScheme(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_1

    .line 256
    iput-object v2, p0, Lcom/getcapacitor/CapConfig;->androidScheme:Ljava/lang/String;

    .line 259
    :cond_1
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "server.allowNavigation"

    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getArray(Lorg/json/JSONObject;Ljava/lang/String;[Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/getcapacitor/CapConfig;->allowNavigation:[Ljava/lang/String;

    .line 262
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "overrideUserAgent"

    .line 265
    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 262
    const-string v5, "android.overrideUserAgent"

    invoke-static {v2, v5, v3}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/getcapacitor/CapConfig;->overriddenUserAgentString:Ljava/lang/String;

    .line 267
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "appendUserAgent"

    .line 270
    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 267
    const-string v5, "android.appendUserAgent"

    invoke-static {v2, v5, v3}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/getcapacitor/CapConfig;->appendedUserAgentString:Ljava/lang/String;

    .line 272
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "backgroundColor"

    .line 275
    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 272
    const-string v4, "android.backgroundColor"

    invoke-static {v2, v4, v3}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/getcapacitor/CapConfig;->backgroundColor:Ljava/lang/String;

    .line 277
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "allowMixedContent"

    iget-boolean v4, p0, Lcom/getcapacitor/CapConfig;->allowMixedContent:Z

    .line 280
    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result v3

    .line 277
    const-string v4, "android.allowMixedContent"

    invoke-static {v2, v4, v3}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result v2

    iput-boolean v2, p0, Lcom/getcapacitor/CapConfig;->allowMixedContent:Z

    .line 282
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "android.minWebViewVersion"

    const/16 v4, 0x3c

    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getInt(Lorg/json/JSONObject;Ljava/lang/String;I)I

    move-result v2

    iput v2, p0, Lcom/getcapacitor/CapConfig;->minWebViewVersion:I

    .line 283
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "android.minHuaweiWebViewVersion"

    const/16 v4, 0xa

    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getInt(Lorg/json/JSONObject;Ljava/lang/String;I)I

    move-result v2

    iput v2, p0, Lcom/getcapacitor/CapConfig;->minHuaweiWebViewVersion:I

    .line 284
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "android.captureInput"

    iget-boolean v4, p0, Lcom/getcapacitor/CapConfig;->captureInput:Z

    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result v2

    iput-boolean v2, p0, Lcom/getcapacitor/CapConfig;->captureInput:Z

    .line 285
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "android.useLegacyBridge"

    iget-boolean v4, p0, Lcom/getcapacitor/CapConfig;->useLegacyBridge:Z

    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result v2

    iput-boolean v2, p0, Lcom/getcapacitor/CapConfig;->useLegacyBridge:Z

    .line 286
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "android.webContentsDebuggingEnabled"

    invoke-static {v2, v3, p1}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result v2

    iput-boolean v2, p0, Lcom/getcapacitor/CapConfig;->webContentsDebuggingEnabled:Z

    .line 287
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "zoomEnabled"

    invoke-static {v2, v3, v1}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result v3

    const-string v4, "android.zoomEnabled"

    invoke-static {v2, v4, v3}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result v2

    iput-boolean v2, p0, Lcom/getcapacitor/CapConfig;->zoomableWebView:Z

    .line 288
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "android.resolveServiceWorkerRequests"

    invoke-static {v2, v3, v0}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result v2

    iput-boolean v2, p0, Lcom/getcapacitor/CapConfig;->resolveServiceWorkerRequests:Z

    .line 290
    iget-object v2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v3, "loggingBehavior"

    const-string v4, "debug"

    .line 293
    invoke-static {v2, v3, v4}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 290
    const-string v4, "android.loggingBehavior"

    invoke-static {v2, v4, v3}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 295
    sget-object v3, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {v2, v3}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/String;->hashCode()I

    const-string v3, "none"

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_3

    const-string v1, "production"

    invoke-virtual {v2, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_2

    .line 303
    iput-boolean p1, p0, Lcom/getcapacitor/CapConfig;->loggingEnabled:Z

    goto :goto_1

    .line 297
    :cond_2
    iput-boolean v0, p0, Lcom/getcapacitor/CapConfig;->loggingEnabled:Z

    goto :goto_1

    .line 300
    :cond_3
    iput-boolean v1, p0, Lcom/getcapacitor/CapConfig;->loggingEnabled:Z

    .line 306
    :goto_1
    iget-object p1, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v0, "initialFocus"

    iget-boolean v1, p0, Lcom/getcapacitor/CapConfig;->initialFocus:Z

    .line 309
    invoke-static {p1, v0, v1}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result v0

    .line 306
    const-string v1, "android.initialFocus"

    invoke-static {p1, v1, v0}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result p1

    iput-boolean p1, p0, Lcom/getcapacitor/CapConfig;->initialFocus:Z

    .line 313
    iget-object p1, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const-string v0, "plugins"

    invoke-static {p1, v0}, Lcom/getcapacitor/util/JSONUtils;->getObject(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p1

    invoke-static {p1}, Lcom/getcapacitor/CapConfig;->deserializePluginsConfig(Lorg/json/JSONObject;)Ljava/util/Map;

    move-result-object p1

    iput-object p1, p0, Lcom/getcapacitor/CapConfig;->pluginsConfiguration:Ljava/util/Map;

    return-void
.end method

.method private static deserializePluginsConfig(Lorg/json/JSONObject;)Ljava/util/Map;
    .locals 5
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Lorg/json/JSONObject;",
            ")",
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Lcom/getcapacitor/PluginConfig;",
            ">;"
        }
    .end annotation

    .line 531
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    if-nez p0, :cond_0

    goto :goto_1

    .line 538
    :cond_0
    invoke-virtual {p0}, Lorg/json/JSONObject;->keys()Ljava/util/Iterator;

    move-result-object v1

    .line 540
    :goto_0
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_1

    .line 541
    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    .line 545
    :try_start_0
    invoke-virtual {p0, v2}, Lorg/json/JSONObject;->getJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v3

    .line 546
    new-instance v4, Lcom/getcapacitor/PluginConfig;

    invoke-direct {v4, v3}, Lcom/getcapacitor/PluginConfig;-><init>(Lorg/json/JSONObject;)V

    .line 547
    invoke-interface {v0, v2, v4}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v2

    .line 549
    invoke-virtual {v2}, Lorg/json/JSONException;->printStackTrace()V

    goto :goto_0

    :cond_1
    :goto_1
    return-object v0
.end method

.method private loadConfigFromAssets(Landroid/content/res/AssetManager;Ljava/lang/String;)V
    .locals 2

    if-nez p2, :cond_0

    .line 198
    const-string p2, ""

    goto :goto_0

    .line 201
    :cond_0
    invoke-virtual {p2}, Ljava/lang/String;->length()I

    move-result v0

    add-int/lit8 v0, v0, -0x1

    invoke-virtual {p2, v0}, Ljava/lang/String;->charAt(I)C

    move-result v0

    const/16 v1, 0x2f

    if-eq v0, v1, :cond_1

    .line 202
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    const-string v0, "/"

    invoke-virtual {p2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    .line 207
    :cond_1
    :goto_0
    :try_start_0
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    const-string v0, "capacitor.config.json"

    invoke-virtual {p2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-static {p1, p2}, Lcom/getcapacitor/FileUtils;->readFileFromAssets(Landroid/content/res/AssetManager;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    .line 208
    new-instance p2, Lorg/json/JSONObject;

    invoke-direct {p2, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    iput-object p2, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    :catch_0
    move-exception p1

    .line 212
    const-string p2, "Unable to parse capacitor.config.json. Make sure it\'s valid json"

    invoke-static {p2, p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/Throwable;)V

    goto :goto_1

    :catch_1
    move-exception p1

    .line 210
    const-string p2, "Unable to load capacitor.config.json. Run npx cap copy first"

    invoke-static {p2, p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/Throwable;)V

    :goto_1
    return-void
.end method

.method private loadConfigFromFile(Ljava/lang/String;)V
    .locals 2

    if-nez p1, :cond_0

    .line 222
    const-string p1, ""

    goto :goto_0

    .line 225
    :cond_0
    invoke-virtual {p1}, Ljava/lang/String;->length()I

    move-result v0

    add-int/lit8 v0, v0, -0x1

    invoke-virtual {p1, v0}, Ljava/lang/String;->charAt(I)C

    move-result v0

    const/16 v1, 0x2f

    if-eq v0, v1, :cond_1

    .line 226
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    const-string v0, "/"

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    .line 231
    :cond_1
    :goto_0
    :try_start_0
    new-instance v0, Ljava/io/File;

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    const-string v1, "capacitor.config.json"

    invoke-virtual {p1, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-direct {v0, p1}, Ljava/io/File;-><init>(Ljava/lang/String;)V

    .line 232
    invoke-static {v0}, Lcom/getcapacitor/FileUtils;->readFileFromDisk(Ljava/io/File;)Ljava/lang/String;

    move-result-object p1

    .line 233
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    iput-object v0, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;
    :try_end_0
    .catch Lorg/json/JSONException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    :catch_0
    move-exception p1

    .line 237
    const-string v0, "Unable to load capacitor.config.json."

    invoke-static {v0, p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/Throwable;)V

    goto :goto_1

    :catch_1
    move-exception p1

    .line 235
    const-string v0, "Unable to parse capacitor.config.json. Make sure it\'s valid json"

    invoke-static {v0, p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/Throwable;)V

    :goto_1
    return-void
.end method

.method public static loadDefault(Landroid/content/Context;)Lcom/getcapacitor/CapConfig;
    .locals 3

    .line 100
    new-instance v0, Lcom/getcapacitor/CapConfig;

    invoke-direct {v0}, Lcom/getcapacitor/CapConfig;-><init>()V

    if-nez p0, :cond_0

    .line 103
    const-string p0, "Capacitor Config could not be created from file. Context must not be null."

    invoke-static {p0}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    return-object v0

    .line 107
    :cond_0
    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v1

    const/4 v2, 0x0

    invoke-direct {v0, v1, v2}, Lcom/getcapacitor/CapConfig;->loadConfigFromAssets(Landroid/content/res/AssetManager;Ljava/lang/String;)V

    .line 108
    invoke-direct {v0, p0}, Lcom/getcapacitor/CapConfig;->deserializeConfig(Landroid/content/Context;)V

    return-object v0
.end method

.method public static loadFromAssets(Landroid/content/Context;Ljava/lang/String;)Lcom/getcapacitor/CapConfig;
    .locals 2

    .line 120
    new-instance v0, Lcom/getcapacitor/CapConfig;

    invoke-direct {v0}, Lcom/getcapacitor/CapConfig;-><init>()V

    if-nez p0, :cond_0

    .line 123
    const-string p0, "Capacitor Config could not be created from file. Context must not be null."

    invoke-static {p0}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    return-object v0

    .line 127
    :cond_0
    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v1

    invoke-direct {v0, v1, p1}, Lcom/getcapacitor/CapConfig;->loadConfigFromAssets(Landroid/content/res/AssetManager;Ljava/lang/String;)V

    .line 128
    invoke-direct {v0, p0}, Lcom/getcapacitor/CapConfig;->deserializeConfig(Landroid/content/Context;)V

    return-object v0
.end method

.method public static loadFromFile(Landroid/content/Context;Ljava/lang/String;)Lcom/getcapacitor/CapConfig;
    .locals 1

    .line 140
    new-instance v0, Lcom/getcapacitor/CapConfig;

    invoke-direct {v0}, Lcom/getcapacitor/CapConfig;-><init>()V

    if-nez p0, :cond_0

    .line 143
    const-string p0, "Capacitor Config could not be created from file. Context must not be null."

    invoke-static {p0}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    return-object v0

    .line 147
    :cond_0
    invoke-direct {v0, p1}, Lcom/getcapacitor/CapConfig;->loadConfigFromFile(Ljava/lang/String;)V

    .line 148
    invoke-direct {v0, p0}, Lcom/getcapacitor/CapConfig;->deserializeConfig(Landroid/content/Context;)V

    return-object v0
.end method

.method private validateScheme(Ljava/lang/String;)Z
    .locals 5

    const/16 v0, 0x8

    .line 317
    new-array v0, v0, [Ljava/lang/String;

    const-string v1, "file"

    const/4 v2, 0x0

    aput-object v1, v0, v2

    const-string v1, "ftp"

    const/4 v3, 0x1

    aput-object v1, v0, v3

    const/4 v1, 0x2

    const-string v4, "ftps"

    aput-object v4, v0, v1

    const/4 v1, 0x3

    const-string v4, "ws"

    aput-object v4, v0, v1

    const/4 v1, 0x4

    const-string v4, "wss"

    aput-object v4, v0, v1

    const/4 v1, 0x5

    const-string v4, "about"

    aput-object v4, v0, v1

    const/4 v1, 0x6

    const-string v4, "blob"

    aput-object v4, v0, v1

    const/4 v1, 0x7

    const-string v4, "data"

    aput-object v4, v0, v1

    invoke-static {v0}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object v0

    .line 318
    invoke-interface {v0, p1}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 319
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    const-string v0, " is not an allowed scheme.  Defaulting to https."

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-static {p1}, Lcom/getcapacitor/Logger;->warn(Ljava/lang/String;)V

    return v2

    .line 324
    :cond_0
    const-string v0, "http"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    const-string v0, "https"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    .line 325
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "Using a non-standard scheme: "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    const-string v0, " for Android. This is known to cause issues as of Android Webview 117."

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-static {p1}, Lcom/getcapacitor/Logger;->warn(Ljava/lang/String;)V

    :cond_1
    return v3
.end method


# virtual methods
.method public getAllowNavigation()[Ljava/lang/String;
    .locals 1

    .line 358
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->allowNavigation:[Ljava/lang/String;

    return-object v0
.end method

.method public getAndroidScheme()Ljava/lang/String;
    .locals 1

    .line 354
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->androidScheme:Ljava/lang/String;

    return-object v0
.end method

.method public getAppendedUserAgentString()Ljava/lang/String;
    .locals 1

    .line 366
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->appendedUserAgentString:Ljava/lang/String;

    return-object v0
.end method

.method public getArray(Ljava/lang/String;)[Ljava/lang/String;
    .locals 2
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 513
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const/4 v1, 0x0

    invoke-static {v0, p1, v1}, Lcom/getcapacitor/util/JSONUtils;->getArray(Lorg/json/JSONObject;Ljava/lang/String;[Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p1

    return-object p1
.end method

.method public getArray(Ljava/lang/String;[Ljava/lang/String;)[Ljava/lang/String;
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 527
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    invoke-static {v0, p1, p2}, Lcom/getcapacitor/util/JSONUtils;->getArray(Lorg/json/JSONObject;Ljava/lang/String;[Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p1

    return-object p1
.end method

.method public getBackgroundColor()Ljava/lang/String;
    .locals 1

    .line 370
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->backgroundColor:Ljava/lang/String;

    return-object v0
.end method

.method public getBoolean(Ljava/lang/String;Z)Z
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 486
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    invoke-static {v0, p1, p2}, Lcom/getcapacitor/util/JSONUtils;->getBoolean(Lorg/json/JSONObject;Ljava/lang/String;Z)Z

    move-result p1

    return p1
.end method

.method public getErrorPath()Ljava/lang/String;
    .locals 1

    .line 342
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->errorPath:Ljava/lang/String;

    return-object v0
.end method

.method public getHostname()Ljava/lang/String;
    .locals 1

    .line 346
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->hostname:Ljava/lang/String;

    return-object v0
.end method

.method public getInt(Ljava/lang/String;I)I
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 500
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    invoke-static {v0, p1, p2}, Lcom/getcapacitor/util/JSONUtils;->getInt(Lorg/json/JSONObject;Ljava/lang/String;I)I

    move-result p1

    return p1
.end method

.method public getMinHuaweiWebViewVersion()I
    .locals 2

    .line 415
    iget v0, p0, Lcom/getcapacitor/CapConfig;->minHuaweiWebViewVersion:I

    const/16 v1, 0xa

    if-ge v0, v1, :cond_0

    .line 416
    const-string v0, "Specified minimum Huawei webview version is too low, defaulting to 10"

    invoke-static {v0}, Lcom/getcapacitor/Logger;->warn(Ljava/lang/String;)V

    return v1

    :cond_0
    return v0
.end method

.method public getMinWebViewVersion()I
    .locals 2

    .line 406
    iget v0, p0, Lcom/getcapacitor/CapConfig;->minWebViewVersion:I

    const/16 v1, 0x37

    if-ge v0, v1, :cond_0

    .line 407
    const-string v0, "Specified minimum webview version is too low, defaulting to 55"

    invoke-static {v0}, Lcom/getcapacitor/Logger;->warn(Ljava/lang/String;)V

    return v1

    :cond_0
    return v0
.end method

.method public getObject(Ljava/lang/String;)Lorg/json/JSONObject;
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 443
    :try_start_0
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    invoke-virtual {v0, p1}, Lorg/json/JSONObject;->getJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p1
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object p1

    :catch_0
    const/4 p1, 0x0

    return-object p1
.end method

.method public getOverriddenUserAgentString()Ljava/lang/String;
    .locals 1

    .line 362
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->overriddenUserAgentString:Ljava/lang/String;

    return-object v0
.end method

.method public getPluginConfiguration(Ljava/lang/String;)Lcom/getcapacitor/PluginConfig;
    .locals 1

    .line 424
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->pluginsConfiguration:Ljava/util/Map;

    invoke-interface {v0, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object p1

    check-cast p1, Lcom/getcapacitor/PluginConfig;

    if-nez p1, :cond_0

    .line 426
    new-instance p1, Lcom/getcapacitor/PluginConfig;

    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    invoke-direct {p1, v0}, Lcom/getcapacitor/PluginConfig;-><init>(Lorg/json/JSONObject;)V

    :cond_0
    return-object p1
.end method

.method public getServerUrl()Ljava/lang/String;
    .locals 1

    .line 338
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->serverUrl:Ljava/lang/String;

    return-object v0
.end method

.method public getStartPath()Ljava/lang/String;
    .locals 1

    .line 350
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->startPath:Ljava/lang/String;

    return-object v0
.end method

.method public getString(Ljava/lang/String;)Ljava/lang/String;
    .locals 2
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 458
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    const/4 v1, 0x0

    invoke-static {v0, p1, v1}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    return-object p1
.end method

.method public getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 472
    iget-object v0, p0, Lcom/getcapacitor/CapConfig;->configJSON:Lorg/json/JSONObject;

    invoke-static {v0, p1, p2}, Lcom/getcapacitor/util/JSONUtils;->getString(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    return-object p1
.end method

.method public isHTML5Mode()Z
    .locals 1

    .line 334
    iget-boolean v0, p0, Lcom/getcapacitor/CapConfig;->html5mode:Z

    return v0
.end method

.method public isInitialFocus()Z
    .locals 1

    .line 398
    iget-boolean v0, p0, Lcom/getcapacitor/CapConfig;->initialFocus:Z

    return v0
.end method

.method public isInputCaptured()Z
    .locals 1

    .line 378
    iget-boolean v0, p0, Lcom/getcapacitor/CapConfig;->captureInput:Z

    return v0
.end method

.method public isLoggingEnabled()Z
    .locals 1

    .line 394
    iget-boolean v0, p0, Lcom/getcapacitor/CapConfig;->loggingEnabled:Z

    return v0
.end method

.method public isMixedContentAllowed()Z
    .locals 1

    .line 374
    iget-boolean v0, p0, Lcom/getcapacitor/CapConfig;->allowMixedContent:Z

    return v0
.end method

.method public isResolveServiceWorkerRequests()Z
    .locals 1

    .line 382
    iget-boolean v0, p0, Lcom/getcapacitor/CapConfig;->resolveServiceWorkerRequests:Z

    return v0
.end method

.method public isUsingLegacyBridge()Z
    .locals 1

    .line 402
    iget-boolean v0, p0, Lcom/getcapacitor/CapConfig;->useLegacyBridge:Z

    return v0
.end method

.method public isWebContentsDebuggingEnabled()Z
    .locals 1

    .line 386
    iget-boolean v0, p0, Lcom/getcapacitor/CapConfig;->webContentsDebuggingEnabled:Z

    return v0
.end method

.method public isZoomableWebView()Z
    .locals 1

    .line 390
    iget-boolean v0, p0, Lcom/getcapacitor/CapConfig;->zoomableWebView:Z

    return v0
.end method
