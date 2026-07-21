.class public Lcom/getcapacitor/plugin/SystemBars;
.super Lcom/getcapacitor/Plugin;
.source "SystemBars.java"


# annotations
.annotation runtime Lcom/getcapacitor/annotation/CapacitorPlugin;
.end annotation


# static fields
.field static final BAR_GESTURE_BAR:Ljava/lang/String; = "NavigationBar"

.field static final BAR_STATUS_BAR:Ljava/lang/String; = "StatusBar"

.field static final INSETS_HANDLING_CSS:Ljava/lang/String; = "css"

.field static final INSETS_HANDLING_DISABLE:Ljava/lang/String; = "disable"

.field static final STYLE_DARK:Ljava/lang/String; = "DARK"

.field static final STYLE_DEFAULT:Ljava/lang/String; = "DEFAULT"

.field static final STYLE_LIGHT:Ljava/lang/String; = "LIGHT"

.field private static final WEBVIEW_VERSION_WITH_SAFE_AREA_FIX:I = 0x8c

.field private static final WEBVIEW_VERSION_WITH_SAFE_AREA_KEYBOARD_FIX:I = 0x90

.field static final viewportMetaJSFunction:Ljava/lang/String; = "function capacitorSystemBarsCheckMetaViewport() {\n    const meta = document.querySelectorAll(\"meta[name=viewport]\");\n    if (meta.length == 0) {\n        return false;\n    }\n    // get the last found meta viewport tag\n    const metaContent = meta[meta.length - 1].content;\n    return metaContent.includes(\"viewport-fit=cover\");\n}\ncapacitorSystemBarsCheckMetaViewport();\n"


# instance fields
.field private currentGestureBarStyle:Ljava/lang/String;

.field private currentStatusBarStyle:Ljava/lang/String;

.field private hasViewportCover:Z

.field private insetsHandling:Ljava/lang/String;


# direct methods
.method public static synthetic $r8$lambda$EvylPBzZjLdoAOeHbCFhbstdvp8(Lcom/getcapacitor/plugin/SystemBars;Ljava/lang/String;Z)V
    .locals 0

    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/plugin/SystemBars;->lambda$initSystemBars$0(Ljava/lang/String;Z)V

    return-void
.end method

.method public static synthetic $r8$lambda$HlI18or9g2v3jxTp55f72skUXyo(Lcom/getcapacitor/plugin/SystemBars;FFFF)V
    .locals 0

    invoke-direct {p0, p1, p2, p3, p4}, Lcom/getcapacitor/plugin/SystemBars;->lambda$injectSafeAreaCSS$7(FFFF)V

    return-void
.end method

.method public static synthetic $r8$lambda$MxcIqheKqAh0CeZVgL9o8jfnslI(Lcom/getcapacitor/plugin/SystemBars;Ljava/lang/String;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V
    .locals 0

    invoke-direct {p0, p1, p2, p3}, Lcom/getcapacitor/plugin/SystemBars;->lambda$setStyle$1(Ljava/lang/String;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V

    return-void
.end method

.method public static synthetic $r8$lambda$QMjT0isIammsCKWnfmRyRvdoGco(Lcom/getcapacitor/plugin/SystemBars;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V
    .locals 0

    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/plugin/SystemBars;->lambda$hide$3(Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V

    return-void
.end method

.method public static synthetic $r8$lambda$UjDIyPOa6OlxC3ysdJABQVA9OtA(Lcom/getcapacitor/plugin/SystemBars;Landroid/view/View;Landroidx/core/view/WindowInsetsCompat;)Landroidx/core/view/WindowInsetsCompat;
    .locals 0

    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/plugin/SystemBars;->lambda$initWindowInsetsListener$6(Landroid/view/View;Landroidx/core/view/WindowInsetsCompat;)Landroidx/core/view/WindowInsetsCompat;

    move-result-object p0

    return-object p0
.end method

.method public static synthetic $r8$lambda$_TR-y5xYaIeYtWKuA4ceEIMUVag(Lcom/getcapacitor/plugin/SystemBars;)V
    .locals 0

    invoke-direct {p0}, Lcom/getcapacitor/plugin/SystemBars;->lambda$onDOMReady$5()V

    return-void
.end method

.method public static synthetic $r8$lambda$mx3q8c48aQqW-qpHkXPpUu2eByA(Lcom/getcapacitor/plugin/SystemBars;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V
    .locals 0

    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/plugin/SystemBars;->lambda$show$2(Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V

    return-void
.end method

.method public static synthetic $r8$lambda$ze9BKCK53rNqvFx6uwVYQomNzYY(Lcom/getcapacitor/plugin/SystemBars;Ljava/lang/String;)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/getcapacitor/plugin/SystemBars;->lambda$onDOMReady$4(Ljava/lang/String;)V

    return-void
.end method

.method public constructor <init>()V
    .locals 1

    .line 28
    invoke-direct {p0}, Lcom/getcapacitor/Plugin;-><init>()V

    .line 58
    const-string v0, "css"

    iput-object v0, p0, Lcom/getcapacitor/plugin/SystemBars;->insetsHandling:Ljava/lang/String;

    const/4 v0, 0x0

    .line 59
    iput-boolean v0, p0, Lcom/getcapacitor/plugin/SystemBars;->hasViewportCover:Z

    .line 61
    const-string v0, "DEFAULT"

    iput-object v0, p0, Lcom/getcapacitor/plugin/SystemBars;->currentStatusBarStyle:Ljava/lang/String;

    .line 62
    iput-object v0, p0, Lcom/getcapacitor/plugin/SystemBars;->currentGestureBarStyle:Ljava/lang/String;

    return-void
.end method

.method private calcSafeAreaInsets(Landroidx/core/view/WindowInsetsCompat;)Landroidx/core/graphics/Insets;
    .locals 3

    .line 169
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->systemBars()I

    move-result v0

    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->displayCutout()I

    move-result v1

    or-int/2addr v0, v1

    invoke-virtual {p1, v0}, Landroidx/core/view/WindowInsetsCompat;->getInsets(I)Landroidx/core/graphics/Insets;

    move-result-object v0

    .line 170
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->ime()I

    move-result v1

    invoke-virtual {p1, v1}, Landroidx/core/view/WindowInsetsCompat;->isVisible(I)Z

    move-result p1

    if-eqz p1, :cond_0

    .line 171
    iget p1, v0, Landroidx/core/graphics/Insets;->left:I

    iget v1, v0, Landroidx/core/graphics/Insets;->top:I

    iget v0, v0, Landroidx/core/graphics/Insets;->right:I

    const/4 v2, 0x0

    invoke-static {p1, v1, v0, v2}, Landroidx/core/graphics/Insets;->of(IIII)Landroidx/core/graphics/Insets;

    move-result-object p1

    return-object p1

    .line 173
    :cond_0
    iget p1, v0, Landroidx/core/graphics/Insets;->left:I

    iget v1, v0, Landroidx/core/graphics/Insets;->top:I

    iget v2, v0, Landroidx/core/graphics/Insets;->right:I

    iget v0, v0, Landroidx/core/graphics/Insets;->bottom:I

    invoke-static {p1, v1, v2, v0}, Landroidx/core/graphics/Insets;->of(IIII)Landroidx/core/graphics/Insets;

    move-result-object p1

    return-object p1
.end method

.method private getBottomInset(Landroidx/core/graphics/Insets;Z)I
    .locals 2

    .line 353
    invoke-direct {p0}, Lcom/getcapacitor/plugin/SystemBars;->getWebViewMajorVersion()Ljava/lang/Integer;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/Integer;->intValue()I

    move-result v0

    const/16 v1, 0x90

    if-ge v0, v1, :cond_0

    if-eqz p2, :cond_0

    const/4 p1, 0x0

    return p1

    .line 363
    :cond_0
    iget p1, p1, Landroidx/core/graphics/Insets;->bottom:I

    return p1
.end method

.method private getStyleForTheme()Ljava/lang/String;
    .locals 2

    .line 327
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v0

    invoke-virtual {v0}, Landroidx/appcompat/app/AppCompatActivity;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {v0}, Landroid/content/res/Resources;->getConfiguration()Landroid/content/res/Configuration;

    move-result-object v0

    iget v0, v0, Landroid/content/res/Configuration;->uiMode:I

    and-int/lit8 v0, v0, 0x30

    const/16 v1, 0x20

    if-eq v0, v1, :cond_0

    .line 329
    const-string v0, "LIGHT"

    return-object v0

    .line 331
    :cond_0
    const-string v0, "DARK"

    return-object v0
.end method

.method private getWebViewMajorVersion()Ljava/lang/Integer;
    .locals 3

    .line 343
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getContext()Landroid/content/Context;

    move-result-object v0

    invoke-static {v0}, Landroidx/webkit/WebViewCompat;->getCurrentWebViewPackage(Landroid/content/Context;)Landroid/content/pm/PackageInfo;

    move-result-object v0

    const/4 v1, 0x0

    if-eqz v0, :cond_0

    .line 344
    iget-object v2, v0, Landroid/content/pm/PackageInfo;->versionName:Ljava/lang/String;

    if-eqz v2, :cond_0

    .line 345
    iget-object v0, v0, Landroid/content/pm/PackageInfo;->versionName:Ljava/lang/String;

    const-string v2, "\\."

    invoke-virtual {v0, v2}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v0

    .line 346
    aget-object v0, v0, v1

    invoke-static {v0}, Ljava/lang/Integer;->valueOf(Ljava/lang/String;)Ljava/lang/Integer;

    move-result-object v0

    return-object v0

    .line 349
    :cond_0
    invoke-static {v1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v0

    return-object v0
.end method

.method private initSafeAreaCSSVariables()V
    .locals 4

    .line 177
    const-string v0, "css"

    iget-object v1, p0, Lcom/getcapacitor/plugin/SystemBars;->insetsHandling:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    .line 180
    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v1, 0x23

    if-lt v0, v1, :cond_0

    .line 181
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v0

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getWebView()Landroid/webkit/WebView;

    move-result-object v0

    invoke-virtual {v0}, Landroid/webkit/WebView;->getParent()Landroid/view/ViewParent;

    move-result-object v0

    check-cast v0, Landroid/view/View;

    .line 182
    invoke-static {v0}, Landroidx/core/view/ViewCompat;->getRootWindowInsets(Landroid/view/View;)Landroidx/core/view/WindowInsetsCompat;

    move-result-object v0

    goto :goto_0

    .line 184
    :cond_0
    sget-object v0, Landroidx/core/view/WindowInsetsCompat;->CONSUMED:Landroidx/core/view/WindowInsetsCompat;

    :goto_0
    if-eqz v0, :cond_1

    .line 188
    invoke-direct {p0, v0}, Lcom/getcapacitor/plugin/SystemBars;->calcSafeAreaInsets(Landroidx/core/view/WindowInsetsCompat;)Landroidx/core/graphics/Insets;

    move-result-object v0

    .line 189
    iget v1, v0, Landroidx/core/graphics/Insets;->top:I

    iget v2, v0, Landroidx/core/graphics/Insets;->right:I

    iget v3, v0, Landroidx/core/graphics/Insets;->bottom:I

    iget v0, v0, Landroidx/core/graphics/Insets;->left:I

    invoke-direct {p0, v1, v2, v3, v0}, Lcom/getcapacitor/plugin/SystemBars;->injectSafeAreaCSS(IIII)V

    :cond_1
    return-void
.end method

.method private initSystemBars()V
    .locals 6

    .line 96
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getConfig()Lcom/getcapacitor/PluginConfig;

    move-result-object v0

    const-string v1, "style"

    const-string v2, "DEFAULT"

    invoke-virtual {v0, v1, v2}, Lcom/getcapacitor/PluginConfig;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    sget-object v1, Ljava/util/Locale;->US:Ljava/util/Locale;

    invoke-virtual {v0, v1}, Ljava/lang/String;->toUpperCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v0

    .line 97
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getConfig()Lcom/getcapacitor/PluginConfig;

    move-result-object v1

    const-string v2, "hidden"

    const/4 v3, 0x0

    invoke-virtual {v1, v2, v3}, Lcom/getcapacitor/PluginConfig;->getBoolean(Ljava/lang/String;Z)Z

    move-result v1

    .line 99
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getConfig()Lcom/getcapacitor/PluginConfig;

    move-result-object v2

    const-string v3, "insetsHandling"

    const-string v4, "css"

    invoke-virtual {v2, v3, v4}, Lcom/getcapacitor/PluginConfig;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 100
    invoke-virtual {v4, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_1

    const-string v3, "disable"

    invoke-virtual {v3, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_0

    goto :goto_0

    .line 103
    :cond_0
    new-instance v3, Ljava/lang/StringBuilder;

    const-string v5, "Unknown insetsHandling value \'"

    invoke-direct {v3, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, "\'. Falling back to \'css\'."

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "SystemBars"

    invoke-static {v3, v2}, Lcom/getcapacitor/Logger;->warn(Ljava/lang/String;Ljava/lang/String;)V

    .line 107
    iput-object v4, p0, Lcom/getcapacitor/plugin/SystemBars;->insetsHandling:Ljava/lang/String;

    goto :goto_1

    .line 101
    :cond_1
    :goto_0
    iput-object v2, p0, Lcom/getcapacitor/plugin/SystemBars;->insetsHandling:Ljava/lang/String;

    .line 110
    :goto_1
    invoke-direct {p0}, Lcom/getcapacitor/plugin/SystemBars;->initWindowInsetsListener()V

    .line 111
    invoke-direct {p0}, Lcom/getcapacitor/plugin/SystemBars;->initSafeAreaCSSVariables()V

    .line 113
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v2

    new-instance v3, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda5;

    invoke-direct {v3, p0, v0, v1}, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda5;-><init>(Lcom/getcapacitor/plugin/SystemBars;Ljava/lang/String;Z)V

    invoke-virtual {v2, v3}, Lcom/getcapacitor/Bridge;->executeOnMainThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private initWindowInsetsListener()V
    .locals 2

    .line 195
    const-string v0, "disable"

    iget-object v1, p0, Lcom/getcapacitor/plugin/SystemBars;->insetsHandling:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    return-void

    .line 199
    :cond_0
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v0

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getWebView()Landroid/webkit/WebView;

    move-result-object v0

    invoke-virtual {v0}, Landroid/webkit/WebView;->getParent()Landroid/view/ViewParent;

    move-result-object v0

    check-cast v0, Landroid/view/View;

    new-instance v1, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda1;

    invoke-direct {v1, p0}, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda1;-><init>(Lcom/getcapacitor/plugin/SystemBars;)V

    invoke-static {v0, v1}, Landroidx/core/view/ViewCompat;->setOnApplyWindowInsetsListener(Landroid/view/View;Landroidx/core/view/OnApplyWindowInsetsListener;)V

    return-void
.end method

.method private injectSafeAreaCSS(IIII)V
    .locals 7

    .line 252
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v0

    invoke-virtual {v0}, Landroidx/appcompat/app/AppCompatActivity;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {v0}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v0

    iget v0, v0, Landroid/util/DisplayMetrics;->density:F

    int-to-float p1, p1

    div-float v3, p1, v0

    int-to-float p1, p2

    div-float v4, p1, v0

    int-to-float p1, p3

    div-float v5, p1, v0

    int-to-float p1, p4

    div-float v6, p1, v0

    .line 259
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object p1

    new-instance v1, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda4;

    move-object v2, p0

    invoke-direct/range {v1 .. v6}, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda4;-><init>(Lcom/getcapacitor/plugin/SystemBars;FFFF)V

    invoke-virtual {p1, v1}, Lcom/getcapacitor/Bridge;->executeOnMainThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private synthetic lambda$hide$3(Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V
    .locals 1

    const/4 v0, 0x1

    .line 145
    invoke-direct {p0, v0, p1}, Lcom/getcapacitor/plugin/SystemBars;->setHidden(ZLjava/lang/String;)V

    .line 146
    invoke-virtual {p2}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void
.end method

.method private synthetic lambda$initSystemBars$0(Ljava/lang/String;Z)V
    .locals 1

    .line 114
    const-string v0, ""

    invoke-direct {p0, p1, v0}, Lcom/getcapacitor/plugin/SystemBars;->setStyle(Ljava/lang/String;Ljava/lang/String;)V

    .line 115
    invoke-direct {p0, p2, v0}, Lcom/getcapacitor/plugin/SystemBars;->setHidden(ZLjava/lang/String;)V

    return-void
.end method

.method private synthetic lambda$initWindowInsetsListener$6(Landroid/view/View;Landroidx/core/view/WindowInsetsCompat;)Landroidx/core/view/WindowInsetsCompat;
    .locals 7

    .line 200
    invoke-direct {p0}, Lcom/getcapacitor/plugin/SystemBars;->getWebViewMajorVersion()Ljava/lang/Integer;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/Integer;->intValue()I

    move-result v0

    const/16 v1, 0x8c

    const/4 v2, 0x0

    if-lt v0, v1, :cond_0

    iget-boolean v0, p0, Lcom/getcapacitor/plugin/SystemBars;->hasViewportCover:Z

    if-eqz v0, :cond_0

    const/4 v0, 0x1

    goto :goto_0

    :cond_0
    move v0, v2

    .line 202
    :goto_0
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->systemBars()I

    move-result v1

    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->displayCutout()I

    move-result v3

    or-int/2addr v1, v3

    invoke-virtual {p2, v1}, Landroidx/core/view/WindowInsetsCompat;->getInsets(I)Landroidx/core/graphics/Insets;

    move-result-object v1

    .line 203
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->ime()I

    move-result v3

    invoke-virtual {p2, v3}, Landroidx/core/view/WindowInsetsCompat;->getInsets(I)Landroidx/core/graphics/Insets;

    move-result-object v3

    .line 204
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->ime()I

    move-result v4

    invoke-virtual {p2, v4}, Landroidx/core/view/WindowInsetsCompat;->isVisible(I)Z

    move-result v4

    if-eqz v0, :cond_2

    if-eqz v4, :cond_1

    .line 208
    iget v0, v3, Landroidx/core/graphics/Insets;->bottom:I

    goto :goto_1

    :cond_1
    move v0, v2

    :goto_1
    invoke-virtual {p1, v2, v2, v2, v0}, Landroid/view/View;->setPadding(IIII)V

    .line 210
    invoke-direct {p0, p2}, Lcom/getcapacitor/plugin/SystemBars;->calcSafeAreaInsets(Landroidx/core/view/WindowInsetsCompat;)Landroidx/core/graphics/Insets;

    move-result-object p1

    .line 211
    iget v0, p1, Landroidx/core/graphics/Insets;->top:I

    iget v2, p1, Landroidx/core/graphics/Insets;->right:I

    iget v3, p1, Landroidx/core/graphics/Insets;->bottom:I

    iget p1, p1, Landroidx/core/graphics/Insets;->left:I

    invoke-direct {p0, v0, v2, v3, p1}, Lcom/getcapacitor/plugin/SystemBars;->injectSafeAreaCSS(IIII)V

    .line 213
    new-instance p1, Landroidx/core/view/WindowInsetsCompat$Builder;

    invoke-direct {p1, p2}, Landroidx/core/view/WindowInsetsCompat$Builder;-><init>(Landroidx/core/view/WindowInsetsCompat;)V

    .line 215
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->systemBars()I

    move-result p2

    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->displayCutout()I

    move-result v0

    or-int/2addr p2, v0

    iget v0, v1, Landroidx/core/graphics/Insets;->left:I

    iget v2, v1, Landroidx/core/graphics/Insets;->top:I

    iget v3, v1, Landroidx/core/graphics/Insets;->right:I

    .line 220
    invoke-direct {p0, v1, v4}, Lcom/getcapacitor/plugin/SystemBars;->getBottomInset(Landroidx/core/graphics/Insets;Z)I

    move-result v1

    .line 216
    invoke-static {v0, v2, v3, v1}, Landroidx/core/graphics/Insets;->of(IIII)Landroidx/core/graphics/Insets;

    move-result-object v0

    .line 214
    invoke-virtual {p1, p2, v0}, Landroidx/core/view/WindowInsetsCompat$Builder;->setInsets(ILandroidx/core/graphics/Insets;)Landroidx/core/view/WindowInsetsCompat$Builder;

    move-result-object p1

    .line 223
    invoke-virtual {p1}, Landroidx/core/view/WindowInsetsCompat$Builder;->build()Landroidx/core/view/WindowInsetsCompat;

    move-result-object p1

    return-object p1

    .line 226
    :cond_2
    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v5, 0x23

    if-lt v0, v5, :cond_4

    .line 228
    iget v0, v1, Landroidx/core/graphics/Insets;->left:I

    iget v5, v1, Landroidx/core/graphics/Insets;->top:I

    iget v6, v1, Landroidx/core/graphics/Insets;->right:I

    if-eqz v4, :cond_3

    .line 232
    iget v1, v3, Landroidx/core/graphics/Insets;->bottom:I

    goto :goto_2

    :cond_3
    iget v1, v1, Landroidx/core/graphics/Insets;->bottom:I

    .line 228
    :goto_2
    invoke-virtual {p1, v0, v5, v6, v1}, Landroid/view/View;->setPadding(IIII)V

    .line 239
    :cond_4
    new-instance p1, Landroidx/core/view/WindowInsetsCompat$Builder;

    invoke-direct {p1, p2}, Landroidx/core/view/WindowInsetsCompat$Builder;-><init>(Landroidx/core/view/WindowInsetsCompat;)V

    .line 240
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->systemBars()I

    move-result p2

    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->displayCutout()I

    move-result v0

    or-int/2addr p2, v0

    invoke-static {v2, v2, v2, v2}, Landroidx/core/graphics/Insets;->of(IIII)Landroidx/core/graphics/Insets;

    move-result-object v0

    invoke-virtual {p1, p2, v0}, Landroidx/core/view/WindowInsetsCompat$Builder;->setInsets(ILandroidx/core/graphics/Insets;)Landroidx/core/view/WindowInsetsCompat$Builder;

    move-result-object p1

    .line 241
    invoke-virtual {p1}, Landroidx/core/view/WindowInsetsCompat$Builder;->build()Landroidx/core/view/WindowInsetsCompat;

    move-result-object p1

    .line 243
    invoke-direct {p0, p1}, Lcom/getcapacitor/plugin/SystemBars;->calcSafeAreaInsets(Landroidx/core/view/WindowInsetsCompat;)Landroidx/core/graphics/Insets;

    move-result-object p2

    .line 244
    iget v0, p2, Landroidx/core/graphics/Insets;->top:I

    iget v1, p2, Landroidx/core/graphics/Insets;->right:I

    iget v2, p2, Landroidx/core/graphics/Insets;->bottom:I

    iget p2, p2, Landroidx/core/graphics/Insets;->left:I

    invoke-direct {p0, v0, v1, v2, p2}, Lcom/getcapacitor/plugin/SystemBars;->injectSafeAreaCSS(IIII)V

    return-object p1
.end method

.method private synthetic lambda$injectSafeAreaCSS$7(FFFF)V
    .locals 1

    .line 260
    iget-object v0, p0, Lcom/getcapacitor/plugin/SystemBars;->bridge:Lcom/getcapacitor/Bridge;

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/getcapacitor/plugin/SystemBars;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getWebView()Landroid/webkit/WebView;

    move-result-object v0

    if-eqz v0, :cond_0

    .line 261
    sget-object v0, Ljava/util/Locale;->US:Ljava/util/Locale;

    float-to-int p1, p1

    .line 271
    invoke-static {p1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p1

    float-to-int p2, p2

    .line 272
    invoke-static {p2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p2

    float-to-int p3, p3

    .line 273
    invoke-static {p3}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p3

    float-to-int p4, p4

    .line 274
    invoke-static {p4}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p4

    filled-new-array {p1, p2, p3, p4}, [Ljava/lang/Object;

    move-result-object p1

    .line 261
    const-string p2, "try {\n  document.documentElement.style.setProperty(\"--safe-area-inset-top\", \"%dpx\");\n  document.documentElement.style.setProperty(\"--safe-area-inset-right\", \"%dpx\");\n  document.documentElement.style.setProperty(\"--safe-area-inset-bottom\", \"%dpx\");\n  document.documentElement.style.setProperty(\"--safe-area-inset-left\", \"%dpx\");\n} catch(e) { console.error(\'Error injecting safe area CSS:\', e); }\n"

    invoke-static {v0, p2, p1}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p1

    .line 277
    iget-object p2, p0, Lcom/getcapacitor/plugin/SystemBars;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p2}, Lcom/getcapacitor/Bridge;->getWebView()Landroid/webkit/WebView;

    move-result-object p2

    const/4 p3, 0x0

    invoke-virtual {p2, p1, p3}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    :cond_0
    return-void
.end method

.method private synthetic lambda$onDOMReady$4(Ljava/lang/String;)V
    .locals 1

    .line 160
    const-string v0, "true"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    iput-boolean p1, p0, Lcom/getcapacitor/plugin/SystemBars;->hasViewportCover:Z

    .line 162
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object p1

    invoke-virtual {p1}, Lcom/getcapacitor/Bridge;->getWebView()Landroid/webkit/WebView;

    move-result-object p1

    invoke-virtual {p1}, Landroid/webkit/WebView;->requestApplyInsets()V

    return-void
.end method

.method private synthetic lambda$onDOMReady$5()V
    .locals 3

    .line 159
    iget-object v0, p0, Lcom/getcapacitor/plugin/SystemBars;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getWebView()Landroid/webkit/WebView;

    move-result-object v0

    new-instance v1, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda7;

    invoke-direct {v1, p0}, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda7;-><init>(Lcom/getcapacitor/plugin/SystemBars;)V

    const-string v2, "function capacitorSystemBarsCheckMetaViewport() {\n    const meta = document.querySelectorAll(\"meta[name=viewport]\");\n    if (meta.length == 0) {\n        return false;\n    }\n    // get the last found meta viewport tag\n    const metaContent = meta[meta.length - 1].content;\n    return metaContent.includes(\"viewport-fit=cover\");\n}\ncapacitorSystemBarsCheckMetaViewport();\n"

    invoke-virtual {v0, v2, v1}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    return-void
.end method

.method private synthetic lambda$setStyle$1(Ljava/lang/String;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V
    .locals 0

    .line 125
    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/plugin/SystemBars;->setStyle(Ljava/lang/String;Ljava/lang/String;)V

    .line 126
    invoke-virtual {p3}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void
.end method

.method private synthetic lambda$show$2(Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V
    .locals 1

    const/4 v0, 0x0

    .line 135
    invoke-direct {p0, v0, p1}, Lcom/getcapacitor/plugin/SystemBars;->setHidden(ZLjava/lang/String;)V

    .line 136
    invoke-virtual {p2}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void
.end method

.method private setHidden(ZLjava/lang/String;)V
    .locals 3

    .line 303
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v0

    invoke-virtual {v0}, Landroidx/appcompat/app/AppCompatActivity;->getWindow()Landroid/view/Window;

    move-result-object v0

    .line 304
    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;

    move-result-object v1

    invoke-static {v0, v1}, Landroidx/core/view/WindowCompat;->getInsetsController(Landroid/view/Window;Landroid/view/View;)Landroidx/core/view/WindowInsetsControllerCompat;

    move-result-object v0

    .line 306
    const-string v1, "NavigationBar"

    const-string v2, "StatusBar"

    if-eqz p1, :cond_2

    .line 307
    invoke-virtual {p2}, Ljava/lang/String;->isEmpty()Z

    move-result p1

    if-eqz p1, :cond_0

    .line 308
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->systemBars()I

    move-result p1

    invoke-virtual {v0, p1}, Landroidx/core/view/WindowInsetsControllerCompat;->hide(I)V

    return-void

    .line 309
    :cond_0
    invoke-virtual {p2, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_1

    .line 310
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->statusBars()I

    move-result p1

    invoke-virtual {v0, p1}, Landroidx/core/view/WindowInsetsControllerCompat;->hide(I)V

    return-void

    .line 311
    :cond_1
    invoke-virtual {p2, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_5

    .line 312
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->navigationBars()I

    move-result p1

    invoke-virtual {v0, p1}, Landroidx/core/view/WindowInsetsControllerCompat;->hide(I)V

    return-void

    .line 317
    :cond_2
    invoke-virtual {p2}, Ljava/lang/String;->isEmpty()Z

    move-result p1

    if-eqz p1, :cond_3

    .line 318
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->systemBars()I

    move-result p1

    invoke-virtual {v0, p1}, Landroidx/core/view/WindowInsetsControllerCompat;->show(I)V

    return-void

    .line 319
    :cond_3
    invoke-virtual {p2, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_4

    .line 320
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->statusBars()I

    move-result p1

    invoke-virtual {v0, p1}, Landroidx/core/view/WindowInsetsControllerCompat;->show(I)V

    return-void

    .line 321
    :cond_4
    invoke-virtual {p2, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_5

    .line 322
    invoke-static {}, Landroidx/core/view/WindowInsetsCompat$Type;->navigationBars()I

    move-result p1

    invoke-virtual {v0, p1}, Landroidx/core/view/WindowInsetsControllerCompat;->show(I)V

    :cond_5
    return-void
.end method

.method private setStyle(Ljava/lang/String;Ljava/lang/String;)V
    .locals 3

    .line 283
    const-string v0, "DEFAULT"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 284
    invoke-direct {p0}, Lcom/getcapacitor/plugin/SystemBars;->getStyleForTheme()Ljava/lang/String;

    move-result-object p1

    .line 287
    :cond_0
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v0

    invoke-virtual {v0}, Landroidx/appcompat/app/AppCompatActivity;->getWindow()Landroid/view/Window;

    move-result-object v0

    .line 288
    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;

    move-result-object v1

    invoke-static {v0, v1}, Landroidx/core/view/WindowCompat;->getInsetsController(Landroid/view/Window;Landroid/view/View;)Landroidx/core/view/WindowInsetsControllerCompat;

    move-result-object v0

    .line 289
    invoke-virtual {p2}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    const-string v2, "DARK"

    if-nez v1, :cond_1

    const-string v1, "StatusBar"

    invoke-virtual {p2, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_2

    .line 290
    :cond_1
    iput-object p1, p0, Lcom/getcapacitor/plugin/SystemBars;->currentStatusBarStyle:Ljava/lang/String;

    .line 291
    invoke-virtual {p1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    xor-int/lit8 v1, v1, 0x1

    invoke-virtual {v0, v1}, Landroidx/core/view/WindowInsetsControllerCompat;->setAppearanceLightStatusBars(Z)V

    .line 294
    :cond_2
    invoke-virtual {p2}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "NavigationBar"

    invoke-virtual {p2, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p2

    if-eqz p2, :cond_4

    .line 295
    :cond_3
    iput-object p1, p0, Lcom/getcapacitor/plugin/SystemBars;->currentGestureBarStyle:Ljava/lang/String;

    .line 296
    invoke-virtual {p1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    xor-int/lit8 p1, p1, 0x1

    invoke-virtual {v0, p1}, Landroidx/core/view/WindowInsetsControllerCompat;->setAppearanceLightNavigationBars(Z)V

    .line 299
    :cond_4
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object p1

    invoke-virtual {p1}, Landroidx/appcompat/app/AppCompatActivity;->getWindow()Landroid/view/Window;

    move-result-object p1

    invoke-virtual {p1}, Landroid/view/Window;->getDecorView()Landroid/view/View;

    move-result-object p1

    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getContext()Landroid/content/Context;

    move-result-object p2

    const v0, 0x1010054

    invoke-virtual {p0, p2, v0}, Lcom/getcapacitor/plugin/SystemBars;->getThemeColor(Landroid/content/Context;I)I

    move-result p2

    invoke-virtual {p1, p2}, Landroid/view/View;->setBackgroundColor(I)V

    return-void
.end method


# virtual methods
.method public getThemeColor(Landroid/content/Context;I)I
    .locals 2

    .line 335
    new-instance v0, Landroid/util/TypedValue;

    invoke-direct {v0}, Landroid/util/TypedValue;-><init>()V

    .line 337
    invoke-virtual {p1}, Landroid/content/Context;->getTheme()Landroid/content/res/Resources$Theme;

    move-result-object p1

    const/4 v1, 0x1

    .line 338
    invoke-virtual {p1, p2, v0, v1}, Landroid/content/res/Resources$Theme;->resolveAttribute(ILandroid/util/TypedValue;Z)Z

    .line 339
    iget p1, v0, Landroid/util/TypedValue;->data:I

    return p1
.end method

.method protected handleOnConfigurationChanged(Landroid/content/res/Configuration;)V
    .locals 1

    .line 89
    invoke-super {p0, p1}, Lcom/getcapacitor/Plugin;->handleOnConfigurationChanged(Landroid/content/res/Configuration;)V

    .line 91
    iget-object p1, p0, Lcom/getcapacitor/plugin/SystemBars;->currentGestureBarStyle:Ljava/lang/String;

    const-string v0, "NavigationBar"

    invoke-direct {p0, p1, v0}, Lcom/getcapacitor/plugin/SystemBars;->setStyle(Ljava/lang/String;Ljava/lang/String;)V

    .line 92
    iget-object p1, p0, Lcom/getcapacitor/plugin/SystemBars;->currentStatusBarStyle:Ljava/lang/String;

    const-string v0, "StatusBar"

    invoke-direct {p0, p1, v0}, Lcom/getcapacitor/plugin/SystemBars;->setStyle(Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method protected handleOnStart()V
    .locals 2

    .line 74
    invoke-super {p0}, Lcom/getcapacitor/Plugin;->handleOnStart()V

    .line 76
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v0

    new-instance v1, Lcom/getcapacitor/plugin/SystemBars$1;

    invoke-direct {v1, p0}, Lcom/getcapacitor/plugin/SystemBars$1;-><init>(Lcom/getcapacitor/plugin/SystemBars;)V

    invoke-virtual {v0, v1}, Lcom/getcapacitor/Bridge;->addWebViewListener(Lcom/getcapacitor/WebViewListener;)V

    return-void
.end method

.method public hide(Lcom/getcapacitor/PluginCall;)V
    .locals 3
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 142
    const-string v0, "bar"

    const-string v1, ""

    invoke-virtual {p1, v0, v1}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 144
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v1

    new-instance v2, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda6;

    invoke-direct {v2, p0, v0, p1}, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda6;-><init>(Lcom/getcapacitor/plugin/SystemBars;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V

    invoke-virtual {v1, v2}, Lcom/getcapacitor/Bridge;->executeOnMainThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public load()V
    .locals 2

    .line 66
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v0

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getWebView()Landroid/webkit/WebView;

    move-result-object v0

    const-string v1, "CapacitorSystemBarsAndroidInterface"

    invoke-virtual {v0, p0, v1}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    .line 67
    invoke-super {p0}, Lcom/getcapacitor/Plugin;->load()V

    .line 69
    invoke-direct {p0}, Lcom/getcapacitor/plugin/SystemBars;->initSystemBars()V

    return-void
.end method

.method public onDOMReady()V
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 157
    const-string v0, "css"

    iget-object v1, p0, Lcom/getcapacitor/plugin/SystemBars;->insetsHandling:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 158
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v0

    new-instance v1, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda2;

    invoke-direct {v1, p0}, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda2;-><init>(Lcom/getcapacitor/plugin/SystemBars;)V

    invoke-virtual {v0, v1}, Landroidx/appcompat/app/AppCompatActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    :cond_0
    return-void
.end method

.method public setAnimation(Lcom/getcapacitor/PluginCall;)V
    .locals 0
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 152
    invoke-virtual {p1}, Lcom/getcapacitor/PluginCall;->resolve()V

    return-void
.end method

.method public setStyle(Lcom/getcapacitor/PluginCall;)V
    .locals 4
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 121
    const-string v0, "bar"

    const-string v1, ""

    invoke-virtual {p1, v0, v1}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 122
    const-string v1, "style"

    const-string v2, "DEFAULT"

    invoke-virtual {p1, v1, v2}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 124
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v2

    new-instance v3, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda3;

    invoke-direct {v3, p0, v1, v0, p1}, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda3;-><init>(Lcom/getcapacitor/plugin/SystemBars;Ljava/lang/String;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V

    invoke-virtual {v2, v3}, Lcom/getcapacitor/Bridge;->executeOnMainThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public show(Lcom/getcapacitor/PluginCall;)V
    .locals 3
    .annotation runtime Lcom/getcapacitor/PluginMethod;
    .end annotation

    .line 132
    const-string v0, "bar"

    const-string v1, ""

    invoke-virtual {p1, v0, v1}, Lcom/getcapacitor/PluginCall;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 134
    invoke-virtual {p0}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object v1

    new-instance v2, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda0;

    invoke-direct {v2, p0, v0, p1}, Lcom/getcapacitor/plugin/SystemBars$$ExternalSyntheticLambda0;-><init>(Lcom/getcapacitor/plugin/SystemBars;Ljava/lang/String;Lcom/getcapacitor/PluginCall;)V

    invoke-virtual {v1, v2}, Lcom/getcapacitor/Bridge;->executeOnMainThread(Ljava/lang/Runnable;)V

    return-void
.end method
