.class public Lcom/getcapacitor/BridgeWebChromeClient;
.super Landroid/webkit/WebChromeClient;
.source "BridgeWebChromeClient.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;,
        Lcom/getcapacitor/BridgeWebChromeClient$ActivityResultListener;
    }
.end annotation


# instance fields
.field private activityLauncher:Landroidx/activity/result/ActivityResultLauncher;

.field private activityListener:Lcom/getcapacitor/BridgeWebChromeClient$ActivityResultListener;

.field private bridge:Lcom/getcapacitor/Bridge;

.field private permissionLauncher:Landroidx/activity/result/ActivityResultLauncher;

.field private permissionListener:Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;


# direct methods
.method public static synthetic $r8$lambda$1rYvFa--8-RTTjKwt3c-0WeZc10(Lcom/getcapacitor/BridgeWebChromeClient;Ljava/util/Map;)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/getcapacitor/BridgeWebChromeClient;->lambda$new$0(Ljava/util/Map;)V

    return-void
.end method

.method public static synthetic $r8$lambda$Q6BWBORnwFhTFdGhfzydsAfabJw(Lcom/getcapacitor/BridgeWebChromeClient;Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;ZLjava/lang/Boolean;)V
    .locals 0

    invoke-direct {p0, p1, p2, p3, p4}, Lcom/getcapacitor/BridgeWebChromeClient;->lambda$onShowFileChooser$12(Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;ZLjava/lang/Boolean;)V

    return-void
.end method

.method public static synthetic $r8$lambda$_JktA1AQpQiYcwzUd4_DsO5PViI(Lcom/getcapacitor/BridgeWebChromeClient;Landroid/webkit/GeolocationPermissions$Callback;Ljava/lang/String;Ljava/lang/Boolean;)V
    .locals 0

    invoke-direct {p0, p1, p2, p3}, Lcom/getcapacitor/BridgeWebChromeClient;->lambda$onGeolocationPermissionsShowPrompt$11(Landroid/webkit/GeolocationPermissions$Callback;Ljava/lang/String;Ljava/lang/Boolean;)V

    return-void
.end method

.method public static synthetic $r8$lambda$smnIFAY7gjbYK3CAZ2kUDI3xHnI(Lcom/getcapacitor/BridgeWebChromeClient;Landroidx/activity/result/ActivityResult;)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/getcapacitor/BridgeWebChromeClient;->lambda$new$1(Landroidx/activity/result/ActivityResult;)V

    return-void
.end method

.method public constructor <init>(Lcom/getcapacitor/Bridge;)V
    .locals 2

    .line 56
    invoke-direct {p0}, Landroid/webkit/WebChromeClient;-><init>()V

    .line 57
    iput-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    .line 59
    new-instance v0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda5;

    invoke-direct {v0, p0}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda5;-><init>(Lcom/getcapacitor/BridgeWebChromeClient;)V

    .line 69
    new-instance v1, Landroidx/activity/result/contract/ActivityResultContracts$RequestMultiplePermissions;

    invoke-direct {v1}, Landroidx/activity/result/contract/ActivityResultContracts$RequestMultiplePermissions;-><init>()V

    invoke-virtual {p1, v1, v0}, Lcom/getcapacitor/Bridge;->registerForActivityResult(Landroidx/activity/result/contract/ActivityResultContract;Landroidx/activity/result/ActivityResultCallback;)Landroidx/activity/result/ActivityResultLauncher;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/BridgeWebChromeClient;->permissionLauncher:Landroidx/activity/result/ActivityResultLauncher;

    .line 70
    new-instance v0, Landroidx/activity/result/contract/ActivityResultContracts$StartActivityForResult;

    invoke-direct {v0}, Landroidx/activity/result/contract/ActivityResultContracts$StartActivityForResult;-><init>()V

    new-instance v1, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda6;

    invoke-direct {v1, p0}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda6;-><init>(Lcom/getcapacitor/BridgeWebChromeClient;)V

    invoke-virtual {p1, v0, v1}, Lcom/getcapacitor/Bridge;->registerForActivityResult(Landroidx/activity/result/contract/ActivityResultContract;Landroidx/activity/result/ActivityResultCallback;)Landroidx/activity/result/ActivityResultLauncher;

    move-result-object p1

    iput-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->activityLauncher:Landroidx/activity/result/ActivityResultLauncher;

    return-void
.end method

.method private createImageFile(Landroid/app/Activity;)Ljava/io/File;
    .locals 3
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 462
    new-instance v0, Ljava/text/SimpleDateFormat;

    const-string v1, "yyyyMMdd_HHmmss"

    invoke-direct {v0, v1}, Ljava/text/SimpleDateFormat;-><init>(Ljava/lang/String;)V

    new-instance v1, Ljava/util/Date;

    invoke-direct {v1}, Ljava/util/Date;-><init>()V

    invoke-virtual {v0, v1}, Ljava/text/SimpleDateFormat;->format(Ljava/util/Date;)Ljava/lang/String;

    move-result-object v0

    .line 463
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "JPEG_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "_"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 464
    sget-object v1, Landroid/os/Environment;->DIRECTORY_PICTURES:Ljava/lang/String;

    invoke-virtual {p1, v1}, Landroid/app/Activity;->getExternalFilesDir(Ljava/lang/String;)Ljava/io/File;

    move-result-object p1

    .line 466
    const-string v1, ".jpg"

    invoke-static {v0, v1, p1}, Ljava/io/File;->createTempFile(Ljava/lang/String;Ljava/lang/String;Ljava/io/File;)Ljava/io/File;

    move-result-object p1

    return-object p1
.end method

.method private createImageFileUri()Landroid/net/Uri;
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 455
    iget-object v0, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v0

    .line 456
    invoke-direct {p0, v0}, Lcom/getcapacitor/BridgeWebChromeClient;->createImageFile(Landroid/app/Activity;)Ljava/io/File;

    move-result-object v1

    .line 457
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v3, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v3}, Lcom/getcapacitor/Bridge;->getContext()Landroid/content/Context;

    move-result-object v3

    invoke-virtual {v3}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, ".fileprovider"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v0, v2, v1}, Landroidx/core/content/FileProvider;->getUriForFile(Landroid/content/Context;Ljava/lang/String;Ljava/io/File;)Landroid/net/Uri;

    move-result-object v0

    return-object v0
.end method

.method private getValidTypes([Ljava/lang/String;)[Ljava/lang/String;
    .locals 6

    .line 409
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    .line 410
    invoke-static {}, Landroid/webkit/MimeTypeMap;->getSingleton()Landroid/webkit/MimeTypeMap;

    move-result-object v1

    .line 411
    array-length v2, p1

    const/4 v3, 0x0

    :goto_0
    if-ge v3, v2, :cond_2

    aget-object v4, p1, v3

    .line 412
    const-string v5, "."

    invoke-virtual {v4, v5}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v5

    if-eqz v5, :cond_0

    const/4 v5, 0x1

    .line 413
    invoke-virtual {v4, v5}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v4

    .line 414
    invoke-virtual {v1, v4}, Landroid/webkit/MimeTypeMap;->getMimeTypeFromExtension(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    if-eqz v4, :cond_1

    .line 415
    invoke-interface {v0, v4}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v5

    if-nez v5, :cond_1

    .line 416
    invoke-interface {v0, v4}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_1

    .line 418
    :cond_0
    invoke-interface {v0, v4}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v5

    if-nez v5, :cond_1

    .line 419
    invoke-interface {v0, v4}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_1
    :goto_1
    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    .line 422
    :cond_2
    invoke-interface {v0}, Ljava/util/List;->toArray()[Ljava/lang/Object;

    move-result-object p1

    .line 423
    array-length v0, p1

    const-class v1, [Ljava/lang/String;

    invoke-static {p1, v0, v1}, Ljava/util/Arrays;->copyOf([Ljava/lang/Object;ILjava/lang/Class;)[Ljava/lang/Object;

    move-result-object p1

    check-cast p1, [Ljava/lang/String;

    return-object p1
.end method

.method private isMediaCaptureSupported()Z
    .locals 5

    const/4 v0, 0x1

    .line 308
    new-array v1, v0, [Ljava/lang/String;

    const/4 v2, 0x0

    const-string v3, "android.permission.CAMERA"

    aput-object v3, v1, v2

    .line 309
    iget-object v4, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    .line 310
    invoke-virtual {v4}, Lcom/getcapacitor/Bridge;->getContext()Landroid/content/Context;

    move-result-object v4

    invoke-static {v4, v1}, Lcom/getcapacitor/util/PermissionHelper;->hasPermissions(Landroid/content/Context;[Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_1

    iget-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    .line 311
    invoke-virtual {v1}, Lcom/getcapacitor/Bridge;->getContext()Landroid/content/Context;

    move-result-object v1

    invoke-static {v1, v3}, Lcom/getcapacitor/util/PermissionHelper;->hasDefinedPermission(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_0

    goto :goto_0

    :cond_0
    return v2

    :cond_1
    :goto_0
    return v0
.end method

.method private synthetic lambda$new$0(Ljava/util/Map;)V
    .locals 2

    .line 60
    iget-object v0, p0, Lcom/getcapacitor/BridgeWebChromeClient;->permissionListener:Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;

    if-eqz v0, :cond_2

    .line 62
    invoke-interface {p1}, Ljava/util/Map;->entrySet()Ljava/util/Set;

    move-result-object p1

    invoke-interface {p1}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object p1

    const/4 v0, 0x1

    :cond_0
    :goto_0
    invoke-interface {p1}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_1

    invoke-interface {p1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/util/Map$Entry;

    .line 63
    invoke-interface {v1}, Ljava/util/Map$Entry;->getValue()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/Boolean;

    invoke-virtual {v1}, Ljava/lang/Boolean;->booleanValue()Z

    move-result v1

    if-nez v1, :cond_0

    const/4 v0, 0x0

    goto :goto_0

    .line 65
    :cond_1
    iget-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->permissionListener:Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;

    invoke-static {v0}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v0

    invoke-interface {p1, v0}, Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;->onPermissionSelect(Ljava/lang/Boolean;)V

    :cond_2
    return-void
.end method

.method private synthetic lambda$new$1(Landroidx/activity/result/ActivityResult;)V
    .locals 1

    .line 71
    iget-object v0, p0, Lcom/getcapacitor/BridgeWebChromeClient;->activityListener:Lcom/getcapacitor/BridgeWebChromeClient$ActivityResultListener;

    if-eqz v0, :cond_0

    .line 72
    invoke-interface {v0, p1}, Lcom/getcapacitor/BridgeWebChromeClient$ActivityResultListener;->onActivityResult(Landroidx/activity/result/ActivityResult;)V

    :cond_0
    return-void
.end method

.method private synthetic lambda$onGeolocationPermissionsShowPrompt$11(Landroid/webkit/GeolocationPermissions$Callback;Ljava/lang/String;Ljava/lang/Boolean;)V
    .locals 4

    .line 253
    invoke-virtual {p3}, Ljava/lang/Boolean;->booleanValue()Z

    move-result p3

    const/4 v0, 0x1

    const/4 v1, 0x0

    if-eqz p3, :cond_0

    .line 254
    invoke-interface {p1, p2, v0, v1}, Landroid/webkit/GeolocationPermissions$Callback;->invoke(Ljava/lang/String;ZZ)V

    return-void

    .line 256
    :cond_0
    new-array p3, v0, [Ljava/lang/String;

    const-string v2, "android.permission.ACCESS_COARSE_LOCATION"

    aput-object v2, p3, v1

    .line 257
    sget v2, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v3, 0x1f

    if-lt v2, v3, :cond_1

    iget-object v2, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    .line 259
    invoke-virtual {v2}, Lcom/getcapacitor/Bridge;->getContext()Landroid/content/Context;

    move-result-object v2

    invoke-static {v2, p3}, Lcom/getcapacitor/util/PermissionHelper;->hasPermissions(Landroid/content/Context;[Ljava/lang/String;)Z

    move-result p3

    if-eqz p3, :cond_1

    .line 261
    invoke-interface {p1, p2, v0, v1}, Landroid/webkit/GeolocationPermissions$Callback;->invoke(Ljava/lang/String;ZZ)V

    return-void

    .line 263
    :cond_1
    invoke-interface {p1, p2, v1, v1}, Landroid/webkit/GeolocationPermissions$Callback;->invoke(Ljava/lang/String;ZZ)V

    return-void
.end method

.method static synthetic lambda$onJsAlert$3(Landroid/webkit/JsResult;Landroid/content/DialogInterface;I)V
    .locals 0

    .line 144
    invoke-interface {p1}, Landroid/content/DialogInterface;->dismiss()V

    .line 145
    invoke-virtual {p0}, Landroid/webkit/JsResult;->confirm()V

    return-void
.end method

.method static synthetic lambda$onJsAlert$4(Landroid/webkit/JsResult;Landroid/content/DialogInterface;)V
    .locals 0

    .line 148
    invoke-interface {p1}, Landroid/content/DialogInterface;->dismiss()V

    .line 149
    invoke-virtual {p0}, Landroid/webkit/JsResult;->cancel()V

    return-void
.end method

.method static synthetic lambda$onJsConfirm$5(Landroid/webkit/JsResult;Landroid/content/DialogInterface;I)V
    .locals 0

    .line 178
    invoke-interface {p1}, Landroid/content/DialogInterface;->dismiss()V

    .line 179
    invoke-virtual {p0}, Landroid/webkit/JsResult;->confirm()V

    return-void
.end method

.method static synthetic lambda$onJsConfirm$6(Landroid/webkit/JsResult;Landroid/content/DialogInterface;I)V
    .locals 0

    .line 182
    invoke-interface {p1}, Landroid/content/DialogInterface;->dismiss()V

    .line 183
    invoke-virtual {p0}, Landroid/webkit/JsResult;->cancel()V

    return-void
.end method

.method static synthetic lambda$onJsConfirm$7(Landroid/webkit/JsResult;Landroid/content/DialogInterface;)V
    .locals 0

    .line 186
    invoke-interface {p1}, Landroid/content/DialogInterface;->dismiss()V

    .line 187
    invoke-virtual {p0}, Landroid/webkit/JsResult;->cancel()V

    return-void
.end method

.method static synthetic lambda$onJsPrompt$10(Landroid/webkit/JsPromptResult;Landroid/content/DialogInterface;)V
    .locals 0

    .line 229
    invoke-interface {p1}, Landroid/content/DialogInterface;->dismiss()V

    .line 230
    invoke-virtual {p0}, Landroid/webkit/JsPromptResult;->cancel()V

    return-void
.end method

.method static synthetic lambda$onJsPrompt$8(Landroid/widget/EditText;Landroid/webkit/JsPromptResult;Landroid/content/DialogInterface;I)V
    .locals 0

    .line 219
    invoke-interface {p2}, Landroid/content/DialogInterface;->dismiss()V

    .line 221
    invoke-virtual {p0}, Landroid/widget/EditText;->getText()Landroid/text/Editable;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/Object;->toString()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p0

    .line 222
    invoke-virtual {p1, p0}, Landroid/webkit/JsPromptResult;->confirm(Ljava/lang/String;)V

    return-void
.end method

.method static synthetic lambda$onJsPrompt$9(Landroid/webkit/JsPromptResult;Landroid/content/DialogInterface;I)V
    .locals 0

    .line 225
    invoke-interface {p1}, Landroid/content/DialogInterface;->dismiss()V

    .line 226
    invoke-virtual {p0}, Landroid/webkit/JsPromptResult;->cancel()V

    return-void
.end method

.method static synthetic lambda$onPermissionRequest$2(Landroid/webkit/PermissionRequest;Ljava/lang/Boolean;)V
    .locals 0

    .line 114
    invoke-virtual {p1}, Ljava/lang/Boolean;->booleanValue()Z

    move-result p1

    if-eqz p1, :cond_0

    .line 115
    invoke-virtual {p0}, Landroid/webkit/PermissionRequest;->getResources()[Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p0, p1}, Landroid/webkit/PermissionRequest;->grant([Ljava/lang/String;)V

    return-void

    .line 117
    :cond_0
    invoke-virtual {p0}, Landroid/webkit/PermissionRequest;->deny()V

    return-void
.end method

.method private synthetic lambda$onShowFileChooser$12(Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;ZLjava/lang/Boolean;)V
    .locals 0

    .line 290
    invoke-virtual {p4}, Ljava/lang/Boolean;->booleanValue()Z

    move-result p4

    if-eqz p4, :cond_0

    .line 291
    invoke-direct {p0, p1, p2, p3}, Lcom/getcapacitor/BridgeWebChromeClient;->showMediaCaptureOrFilePicker(Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;Z)V

    return-void

    :cond_0
    const/4 p2, 0x1

    .line 293
    new-array p2, p2, [Ljava/lang/String;

    const/4 p3, 0x0

    const-string p4, "FileChooser"

    aput-object p4, p2, p3

    invoke-static {p2}, Lcom/getcapacitor/Logger;->tags([Ljava/lang/String;)Ljava/lang/String;

    move-result-object p2

    const-string p3, "Camera permission not granted"

    invoke-static {p2, p3}, Lcom/getcapacitor/Logger;->warn(Ljava/lang/String;Ljava/lang/String;)V

    const/4 p2, 0x0

    .line 294
    invoke-interface {p1, p2}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    return-void
.end method

.method static synthetic lambda$showFilePicker$15(Landroid/webkit/ValueCallback;Landroidx/activity/result/ActivityResult;)V
    .locals 4

    .line 390
    invoke-virtual {p1}, Landroidx/activity/result/ActivityResult;->getData()Landroid/content/Intent;

    move-result-object v0

    .line 391
    invoke-virtual {p1}, Landroidx/activity/result/ActivityResult;->getResultCode()I

    move-result v1

    const/4 v2, -0x1

    if-ne v1, v2, :cond_0

    invoke-virtual {v0}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object v1

    if-eqz v1, :cond_0

    .line 392
    invoke-virtual {v0}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object p1

    invoke-virtual {p1}, Landroid/content/ClipData;->getItemCount()I

    move-result p1

    .line 393
    new-array v1, p1, [Landroid/net/Uri;

    const/4 v2, 0x0

    :goto_0
    if-ge v2, p1, :cond_1

    .line 395
    invoke-virtual {v0}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object v3

    invoke-virtual {v3, v2}, Landroid/content/ClipData;->getItemAt(I)Landroid/content/ClipData$Item;

    move-result-object v3

    invoke-virtual {v3}, Landroid/content/ClipData$Item;->getUri()Landroid/net/Uri;

    move-result-object v3

    aput-object v3, v1, v2

    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    .line 398
    :cond_0
    invoke-virtual {p1}, Landroidx/activity/result/ActivityResult;->getResultCode()I

    move-result p1

    invoke-static {p1, v0}, Landroid/webkit/WebChromeClient$FileChooserParams;->parseResult(ILandroid/content/Intent;)[Landroid/net/Uri;

    move-result-object v1

    .line 400
    :cond_1
    invoke-interface {p0, v1}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    return-void
.end method

.method static synthetic lambda$showImageCapturePicker$13(Landroid/net/Uri;Landroid/webkit/ValueCallback;Landroidx/activity/result/ActivityResult;)V
    .locals 1

    .line 346
    invoke-virtual {p2}, Landroidx/activity/result/ActivityResult;->getResultCode()I

    move-result p2

    const/4 v0, -0x1

    if-ne p2, v0, :cond_0

    const/4 p2, 0x1

    .line 347
    new-array p2, p2, [Landroid/net/Uri;

    const/4 v0, 0x0

    aput-object p0, p2, v0

    goto :goto_0

    :cond_0
    const/4 p2, 0x0

    .line 349
    :goto_0
    invoke-interface {p1, p2}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    return-void
.end method

.method static synthetic lambda$showVideoCapturePicker$14(Landroid/webkit/ValueCallback;Landroidx/activity/result/ActivityResult;)V
    .locals 2

    .line 365
    invoke-virtual {p1}, Landroidx/activity/result/ActivityResult;->getResultCode()I

    move-result v0

    const/4 v1, -0x1

    if-ne v0, v1, :cond_0

    const/4 v0, 0x1

    .line 366
    new-array v0, v0, [Landroid/net/Uri;

    invoke-virtual {p1}, Landroidx/activity/result/ActivityResult;->getData()Landroid/content/Intent;

    move-result-object p1

    invoke-virtual {p1}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object p1

    const/4 v1, 0x0

    aput-object p1, v0, v1

    goto :goto_0

    :cond_0
    const/4 v0, 0x0

    .line 368
    :goto_0
    invoke-interface {p0, v0}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    return-void
.end method

.method private showFilePicker(Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;)V
    .locals 4
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;",
            "Landroid/webkit/WebChromeClient$FileChooserParams;",
            ")V"
        }
    .end annotation

    .line 376
    invoke-virtual {p2}, Landroid/webkit/WebChromeClient$FileChooserParams;->createIntent()Landroid/content/Intent;

    move-result-object v0

    .line 377
    invoke-virtual {p2}, Landroid/webkit/WebChromeClient$FileChooserParams;->getMode()I

    move-result v1

    const/4 v2, 0x1

    if-ne v1, v2, :cond_0

    .line 378
    const-string v1, "android.intent.extra.ALLOW_MULTIPLE"

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 380
    :cond_0
    invoke-virtual {p2}, Landroid/webkit/WebChromeClient$FileChooserParams;->getAcceptTypes()[Ljava/lang/String;

    move-result-object v1

    array-length v1, v1

    const-string v3, "."

    if-gt v1, v2, :cond_1

    invoke-virtual {v0}, Landroid/content/Intent;->getType()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_2

    .line 381
    :cond_1
    invoke-virtual {p2}, Landroid/webkit/WebChromeClient$FileChooserParams;->getAcceptTypes()[Ljava/lang/String;

    move-result-object p2

    invoke-direct {p0, p2}, Lcom/getcapacitor/BridgeWebChromeClient;->getValidTypes([Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p2

    .line 382
    const-string v1, "android.intent.extra.MIME_TYPES"

    invoke-virtual {v0, v1, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;[Ljava/lang/String;)Landroid/content/Intent;

    .line 383
    invoke-virtual {v0}, Landroid/content/Intent;->getType()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_2

    const/4 v1, 0x0

    .line 384
    aget-object p2, p2, v1

    invoke-virtual {v0, p2}, Landroid/content/Intent;->setType(Ljava/lang/String;)Landroid/content/Intent;

    .line 388
    :cond_2
    :try_start_0
    new-instance p2, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda15;

    invoke-direct {p2, p1}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda15;-><init>(Landroid/webkit/ValueCallback;)V

    iput-object p2, p0, Lcom/getcapacitor/BridgeWebChromeClient;->activityListener:Lcom/getcapacitor/BridgeWebChromeClient$ActivityResultListener;

    .line 402
    iget-object p2, p0, Lcom/getcapacitor/BridgeWebChromeClient;->activityLauncher:Landroidx/activity/result/ActivityResultLauncher;

    invoke-virtual {p2, v0}, Landroidx/activity/result/ActivityResultLauncher;->launch(Ljava/lang/Object;)V
    :try_end_0
    .catch Landroid/content/ActivityNotFoundException; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    :catch_0
    const/4 p2, 0x0

    .line 404
    invoke-interface {p1, p2}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    return-void
.end method

.method private showImageCapturePicker(Landroid/webkit/ValueCallback;)Z
    .locals 3
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;)Z"
        }
    .end annotation

    .line 330
    new-instance v0, Landroid/content/Intent;

    const-string v1, "android.media.action.IMAGE_CAPTURE"

    invoke-direct {v0, v1}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    .line 331
    iget-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v1}, Lcom/getcapacitor/Bridge;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v1

    invoke-virtual {v1}, Landroidx/appcompat/app/AppCompatActivity;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/content/Intent;->resolveActivity(Landroid/content/pm/PackageManager;)Landroid/content/ComponentName;

    move-result-object v1

    const/4 v2, 0x0

    if-nez v1, :cond_0

    return v2

    .line 337
    :cond_0
    :try_start_0
    invoke-direct {p0}, Lcom/getcapacitor/BridgeWebChromeClient;->createImageFileUri()Landroid/net/Uri;

    move-result-object v1
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 342
    const-string v2, "output"

    invoke-virtual {v0, v2, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Landroid/os/Parcelable;)Landroid/content/Intent;

    const/4 v2, 0x3

    .line 343
    invoke-virtual {v0, v2}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    .line 344
    new-instance v2, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda7;

    invoke-direct {v2, v1, p1}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda7;-><init>(Landroid/net/Uri;Landroid/webkit/ValueCallback;)V

    iput-object v2, p0, Lcom/getcapacitor/BridgeWebChromeClient;->activityListener:Lcom/getcapacitor/BridgeWebChromeClient$ActivityResultListener;

    .line 351
    iget-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->activityLauncher:Landroidx/activity/result/ActivityResultLauncher;

    invoke-virtual {p1, v0}, Landroidx/activity/result/ActivityResultLauncher;->launch(Ljava/lang/Object;)V

    const/4 p1, 0x1

    return p1

    :catch_0
    move-exception p1

    .line 339
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "Unable to create temporary media capture file: "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p1}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-static {p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;)V

    return v2
.end method

.method private showMediaCaptureOrFilePicker(Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;Z)V
    .locals 2
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;",
            "Landroid/webkit/WebChromeClient$FileChooserParams;",
            "Z)V"
        }
    .end annotation

    if-eqz p3, :cond_0

    .line 318
    invoke-direct {p0, p1}, Lcom/getcapacitor/BridgeWebChromeClient;->showVideoCapturePicker(Landroid/webkit/ValueCallback;)Z

    move-result p3

    goto :goto_0

    .line 320
    :cond_0
    invoke-direct {p0, p1}, Lcom/getcapacitor/BridgeWebChromeClient;->showImageCapturePicker(Landroid/webkit/ValueCallback;)Z

    move-result p3

    :goto_0
    if-nez p3, :cond_1

    const/4 p3, 0x1

    .line 323
    new-array p3, p3, [Ljava/lang/String;

    const/4 v0, 0x0

    const-string v1, "FileChooser"

    aput-object v1, p3, v0

    invoke-static {p3}, Lcom/getcapacitor/Logger;->tags([Ljava/lang/String;)Ljava/lang/String;

    move-result-object p3

    const-string v0, "Media capture intent could not be launched. Falling back to default file picker."

    invoke-static {p3, v0}, Lcom/getcapacitor/Logger;->warn(Ljava/lang/String;Ljava/lang/String;)V

    .line 324
    invoke-direct {p0, p1, p2}, Lcom/getcapacitor/BridgeWebChromeClient;->showFilePicker(Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;)V

    :cond_1
    return-void
.end method

.method private showVideoCapturePicker(Landroid/webkit/ValueCallback;)Z
    .locals 2
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;)Z"
        }
    .end annotation

    .line 358
    new-instance v0, Landroid/content/Intent;

    const-string v1, "android.media.action.VIDEO_CAPTURE"

    invoke-direct {v0, v1}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    .line 359
    iget-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v1}, Lcom/getcapacitor/Bridge;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object v1

    invoke-virtual {v1}, Landroidx/appcompat/app/AppCompatActivity;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/content/Intent;->resolveActivity(Landroid/content/pm/PackageManager;)Landroid/content/ComponentName;

    move-result-object v1

    if-nez v1, :cond_0

    const/4 p1, 0x0

    return p1

    .line 363
    :cond_0
    new-instance v1, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda0;

    invoke-direct {v1, p1}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda0;-><init>(Landroid/webkit/ValueCallback;)V

    iput-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->activityListener:Lcom/getcapacitor/BridgeWebChromeClient$ActivityResultListener;

    .line 370
    iget-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->activityLauncher:Landroidx/activity/result/ActivityResultLauncher;

    invoke-virtual {p1, v0}, Landroidx/activity/result/ActivityResultLauncher;->launch(Ljava/lang/Object;)V

    const/4 p1, 0x1

    return p1
.end method


# virtual methods
.method public isValidMsg(Ljava/lang/String;)Z
    .locals 1

    .line 451
    const-string v0, "%cresult %c"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "%cnative %c"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "console.groupEnd"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result p1

    if-nez p1, :cond_0

    const/4 p1, 0x1

    return p1

    :cond_0
    const/4 p1, 0x0

    return p1
.end method

.method public onConsoleMessage(Landroid/webkit/ConsoleMessage;)Z
    .locals 5

    const/4 v0, 0x1

    .line 428
    new-array v1, v0, [Ljava/lang/String;

    const/4 v2, 0x0

    const-string v3, "Console"

    aput-object v3, v1, v2

    invoke-static {v1}, Lcom/getcapacitor/Logger;->tags([Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 429
    invoke-virtual {p1}, Landroid/webkit/ConsoleMessage;->message()Ljava/lang/String;

    move-result-object v2

    if-eqz v2, :cond_3

    invoke-virtual {p1}, Landroid/webkit/ConsoleMessage;->message()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {p0, v2}, Lcom/getcapacitor/BridgeWebChromeClient;->isValidMsg(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_3

    .line 432
    invoke-virtual {p1}, Landroid/webkit/ConsoleMessage;->sourceId()Ljava/lang/String;

    move-result-object v2

    .line 433
    invoke-virtual {p1}, Landroid/webkit/ConsoleMessage;->lineNumber()I

    move-result v3

    invoke-static {v3}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v3

    .line 434
    invoke-virtual {p1}, Landroid/webkit/ConsoleMessage;->message()Ljava/lang/String;

    move-result-object v4

    filled-new-array {v2, v3, v4}, [Ljava/lang/Object;

    move-result-object v2

    .line 430
    const-string v3, "File: %s - Line %d - Msg: %s"

    invoke-static {v3, v2}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    .line 436
    invoke-virtual {p1}, Landroid/webkit/ConsoleMessage;->messageLevel()Landroid/webkit/ConsoleMessage$MessageLevel;

    move-result-object p1

    invoke-virtual {p1}, Landroid/webkit/ConsoleMessage$MessageLevel;->name()Ljava/lang/String;

    move-result-object p1

    .line 437
    const-string v3, "ERROR"

    invoke-virtual {v3, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_0

    const/4 p1, 0x0

    .line 438
    invoke-static {v1, v2, p1}, Lcom/getcapacitor/Logger;->error(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)V

    goto :goto_0

    .line 439
    :cond_0
    const-string v3, "WARNING"

    invoke-virtual {v3, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_1

    .line 440
    invoke-static {v1, v2}, Lcom/getcapacitor/Logger;->warn(Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_0

    .line 441
    :cond_1
    const-string v3, "TIP"

    invoke-virtual {v3, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_2

    .line 442
    invoke-static {v1, v2}, Lcom/getcapacitor/Logger;->debug(Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_0

    .line 444
    :cond_2
    invoke-static {v1, v2}, Lcom/getcapacitor/Logger;->info(Ljava/lang/String;Ljava/lang/String;)V

    :cond_3
    :goto_0
    return v0
.end method

.method public onGeolocationPermissionsShowPrompt(Ljava/lang/String;Landroid/webkit/GeolocationPermissions$Callback;)V
    .locals 4

    .line 247
    invoke-super {p0, p1, p2}, Landroid/webkit/WebChromeClient;->onGeolocationPermissionsShowPrompt(Ljava/lang/String;Landroid/webkit/GeolocationPermissions$Callback;)V

    .line 248
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "onGeolocationPermissionsShowPrompt: DOING IT HERE FOR ORIGIN: "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Lcom/getcapacitor/Logger;->debug(Ljava/lang/String;)V

    const/4 v0, 0x2

    .line 249
    new-array v0, v0, [Ljava/lang/String;

    const-string v1, "android.permission.ACCESS_COARSE_LOCATION"

    const/4 v2, 0x0

    aput-object v1, v0, v2

    const-string v1, "android.permission.ACCESS_FINE_LOCATION"

    const/4 v3, 0x1

    aput-object v1, v0, v3

    .line 251
    iget-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {v1}, Lcom/getcapacitor/Bridge;->getContext()Landroid/content/Context;

    move-result-object v1

    invoke-static {v1, v0}, Lcom/getcapacitor/util/PermissionHelper;->hasPermissions(Landroid/content/Context;[Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_0

    .line 252
    new-instance v1, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda4;

    invoke-direct {v1, p0, p2, p1}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda4;-><init>(Lcom/getcapacitor/BridgeWebChromeClient;Landroid/webkit/GeolocationPermissions$Callback;Ljava/lang/String;)V

    iput-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->permissionListener:Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;

    .line 267
    iget-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->permissionLauncher:Landroidx/activity/result/ActivityResultLauncher;

    invoke-virtual {p1, v0}, Landroidx/activity/result/ActivityResultLauncher;->launch(Ljava/lang/Object;)V

    return-void

    .line 270
    :cond_0
    invoke-interface {p2, p1, v3, v2}, Landroid/webkit/GeolocationPermissions$Callback;->invoke(Ljava/lang/String;ZZ)V

    .line 271
    const-string p1, "onGeolocationPermissionsShowPrompt: has required permission"

    invoke-static {p1}, Lcom/getcapacitor/Logger;->debug(Ljava/lang/String;)V

    return-void
.end method

.method public onHideCustomView()V
    .locals 0

    .line 98
    invoke-super {p0}, Landroid/webkit/WebChromeClient;->onHideCustomView()V

    return-void
.end method

.method public onJsAlert(Landroid/webkit/WebView;Ljava/lang/String;Ljava/lang/String;Landroid/webkit/JsResult;)Z
    .locals 2

    .line 136
    iget-object p2, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p2}, Lcom/getcapacitor/Bridge;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object p2

    invoke-virtual {p2}, Landroidx/appcompat/app/AppCompatActivity;->isFinishing()Z

    move-result p2

    const/4 v0, 0x1

    if-eqz p2, :cond_0

    return v0

    .line 140
    :cond_0
    new-instance p2, Landroid/app/AlertDialog$Builder;

    invoke-virtual {p1}, Landroid/webkit/WebView;->getContext()Landroid/content/Context;

    move-result-object p1

    invoke-direct {p2, p1}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    .line 142
    invoke-virtual {p2, p3}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    new-instance p3, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda1;

    invoke-direct {p3, p4}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda1;-><init>(Landroid/webkit/JsResult;)V

    .line 143
    const-string v1, "OK"

    invoke-virtual {p1, v1, p3}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    new-instance p3, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda2;

    invoke-direct {p3, p4}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda2;-><init>(Landroid/webkit/JsResult;)V

    .line 147
    invoke-virtual {p1, p3}, Landroid/app/AlertDialog$Builder;->setOnCancelListener(Landroid/content/DialogInterface$OnCancelListener;)Landroid/app/AlertDialog$Builder;

    .line 152
    invoke-virtual {p2}, Landroid/app/AlertDialog$Builder;->create()Landroid/app/AlertDialog;

    move-result-object p1

    .line 154
    invoke-virtual {p1}, Landroid/app/AlertDialog;->show()V

    return v0
.end method

.method public onJsConfirm(Landroid/webkit/WebView;Ljava/lang/String;Ljava/lang/String;Landroid/webkit/JsResult;)Z
    .locals 2

    .line 169
    iget-object p2, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p2}, Lcom/getcapacitor/Bridge;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object p2

    invoke-virtual {p2}, Landroidx/appcompat/app/AppCompatActivity;->isFinishing()Z

    move-result p2

    const/4 v0, 0x1

    if-eqz p2, :cond_0

    return v0

    .line 173
    :cond_0
    new-instance p2, Landroid/app/AlertDialog$Builder;

    invoke-virtual {p1}, Landroid/webkit/WebView;->getContext()Landroid/content/Context;

    move-result-object p1

    invoke-direct {p2, p1}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    .line 176
    invoke-virtual {p2, p3}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    new-instance p3, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda12;

    invoke-direct {p3, p4}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda12;-><init>(Landroid/webkit/JsResult;)V

    .line 177
    const-string v1, "OK"

    invoke-virtual {p1, v1, p3}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    new-instance p3, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda13;

    invoke-direct {p3, p4}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda13;-><init>(Landroid/webkit/JsResult;)V

    .line 181
    const-string v1, "Cancel"

    invoke-virtual {p1, v1, p3}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    new-instance p3, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda14;

    invoke-direct {p3, p4}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda14;-><init>(Landroid/webkit/JsResult;)V

    .line 185
    invoke-virtual {p1, p3}, Landroid/app/AlertDialog$Builder;->setOnCancelListener(Landroid/content/DialogInterface$OnCancelListener;)Landroid/app/AlertDialog$Builder;

    .line 190
    invoke-virtual {p2}, Landroid/app/AlertDialog$Builder;->create()Landroid/app/AlertDialog;

    move-result-object p1

    .line 192
    invoke-virtual {p1}, Landroid/app/AlertDialog;->show()V

    return v0
.end method

.method public onJsPrompt(Landroid/webkit/WebView;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Landroid/webkit/JsPromptResult;)Z
    .locals 1

    .line 208
    iget-object p2, p0, Lcom/getcapacitor/BridgeWebChromeClient;->bridge:Lcom/getcapacitor/Bridge;

    invoke-virtual {p2}, Lcom/getcapacitor/Bridge;->getActivity()Landroidx/appcompat/app/AppCompatActivity;

    move-result-object p2

    invoke-virtual {p2}, Landroidx/appcompat/app/AppCompatActivity;->isFinishing()Z

    move-result p2

    const/4 p4, 0x1

    if-eqz p2, :cond_0

    return p4

    .line 212
    :cond_0
    new-instance p2, Landroid/app/AlertDialog$Builder;

    invoke-virtual {p1}, Landroid/webkit/WebView;->getContext()Landroid/content/Context;

    move-result-object v0

    invoke-direct {p2, v0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    .line 213
    new-instance v0, Landroid/widget/EditText;

    invoke-virtual {p1}, Landroid/webkit/WebView;->getContext()Landroid/content/Context;

    move-result-object p1

    invoke-direct {v0, p1}, Landroid/widget/EditText;-><init>(Landroid/content/Context;)V

    .line 216
    invoke-virtual {p2, p3}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    .line 217
    invoke-virtual {p1, v0}, Landroid/app/AlertDialog$Builder;->setView(Landroid/view/View;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    new-instance p3, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda8;

    invoke-direct {p3, v0, p5}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda8;-><init>(Landroid/widget/EditText;Landroid/webkit/JsPromptResult;)V

    .line 218
    const-string v0, "OK"

    invoke-virtual {p1, v0, p3}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    new-instance p3, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda9;

    invoke-direct {p3, p5}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda9;-><init>(Landroid/webkit/JsPromptResult;)V

    .line 224
    const-string v0, "Cancel"

    invoke-virtual {p1, v0, p3}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    new-instance p3, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda10;

    invoke-direct {p3, p5}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda10;-><init>(Landroid/webkit/JsPromptResult;)V

    .line 228
    invoke-virtual {p1, p3}, Landroid/app/AlertDialog$Builder;->setOnCancelListener(Landroid/content/DialogInterface$OnCancelListener;)Landroid/app/AlertDialog$Builder;

    .line 233
    invoke-virtual {p2}, Landroid/app/AlertDialog$Builder;->create()Landroid/app/AlertDialog;

    move-result-object p1

    .line 235
    invoke-virtual {p1}, Landroid/app/AlertDialog;->show()V

    return p4
.end method

.method public onPermissionRequest(Landroid/webkit/PermissionRequest;)V
    .locals 3

    .line 103
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    .line 104
    invoke-virtual {p1}, Landroid/webkit/PermissionRequest;->getResources()[Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object v1

    const-string v2, "android.webkit.resource.VIDEO_CAPTURE"

    invoke-interface {v1, v2}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    .line 105
    const-string v1, "android.permission.CAMERA"

    invoke-interface {v0, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 107
    :cond_0
    invoke-virtual {p1}, Landroid/webkit/PermissionRequest;->getResources()[Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object v1

    const-string v2, "android.webkit.resource.AUDIO_CAPTURE"

    invoke-interface {v1, v2}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_1

    .line 108
    const-string v1, "android.permission.MODIFY_AUDIO_SETTINGS"

    invoke-interface {v0, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 109
    const-string v1, "android.permission.RECORD_AUDIO"

    invoke-interface {v0, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 111
    :cond_1
    invoke-interface {v0}, Ljava/util/List;->isEmpty()Z

    move-result v1

    if-nez v1, :cond_2

    const/4 v1, 0x0

    .line 112
    new-array v1, v1, [Ljava/lang/String;

    invoke-interface {v0, v1}, Ljava/util/List;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object v0

    check-cast v0, [Ljava/lang/String;

    .line 113
    new-instance v1, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda11;

    invoke-direct {v1, p1}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda11;-><init>(Landroid/webkit/PermissionRequest;)V

    iput-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->permissionListener:Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;

    .line 120
    iget-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient;->permissionLauncher:Landroidx/activity/result/ActivityResultLauncher;

    invoke-virtual {p1, v0}, Landroidx/activity/result/ActivityResultLauncher;->launch(Ljava/lang/Object;)V

    return-void

    .line 122
    :cond_2
    invoke-virtual {p1}, Landroid/webkit/PermissionRequest;->getResources()[Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p1, v0}, Landroid/webkit/PermissionRequest;->grant([Ljava/lang/String;)V

    return-void
.end method

.method public onShowCustomView(Landroid/view/View;Landroid/webkit/WebChromeClient$CustomViewCallback;)V
    .locals 0

    .line 87
    invoke-interface {p2}, Landroid/webkit/WebChromeClient$CustomViewCallback;->onCustomViewHidden()V

    .line 88
    invoke-super {p0, p1, p2}, Landroid/webkit/WebChromeClient;->onShowCustomView(Landroid/view/View;Landroid/webkit/WebChromeClient$CustomViewCallback;)V

    return-void
.end method

.method public onShowFileChooser(Landroid/webkit/WebView;Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;)Z
    .locals 4
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/webkit/WebView;",
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;",
            "Landroid/webkit/WebChromeClient$FileChooserParams;",
            ")Z"
        }
    .end annotation

    .line 281
    invoke-virtual {p3}, Landroid/webkit/WebChromeClient$FileChooserParams;->getAcceptTypes()[Ljava/lang/String;

    move-result-object p1

    invoke-static {p1}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object p1

    .line 282
    invoke-virtual {p3}, Landroid/webkit/WebChromeClient$FileChooserParams;->isCaptureEnabled()Z

    move-result v0

    const/4 v1, 0x0

    const/4 v2, 0x1

    if-eqz v0, :cond_0

    .line 283
    const-string v3, "image/*"

    invoke-interface {p1, v3}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_0

    move v3, v2

    goto :goto_0

    :cond_0
    move v3, v1

    :goto_0
    if-eqz v0, :cond_1

    .line 284
    const-string v0, "video/*"

    invoke-interface {p1, v0}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_1

    move p1, v2

    goto :goto_1

    :cond_1
    move p1, v1

    :goto_1
    if-nez v3, :cond_3

    if-eqz p1, :cond_2

    goto :goto_2

    .line 301
    :cond_2
    invoke-direct {p0, p2, p3}, Lcom/getcapacitor/BridgeWebChromeClient;->showFilePicker(Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;)V

    goto :goto_3

    .line 286
    :cond_3
    :goto_2
    invoke-direct {p0}, Lcom/getcapacitor/BridgeWebChromeClient;->isMediaCaptureSupported()Z

    move-result v0

    if-eqz v0, :cond_4

    .line 287
    invoke-direct {p0, p2, p3, p1}, Lcom/getcapacitor/BridgeWebChromeClient;->showMediaCaptureOrFilePicker(Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;Z)V

    goto :goto_3

    .line 289
    :cond_4
    new-instance v0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;

    invoke-direct {v0, p0, p2, p3, p1}, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;-><init>(Lcom/getcapacitor/BridgeWebChromeClient;Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;Z)V

    iput-object v0, p0, Lcom/getcapacitor/BridgeWebChromeClient;->permissionListener:Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;

    .line 297
    new-array p1, v2, [Ljava/lang/String;

    const-string p2, "android.permission.CAMERA"

    aput-object p2, p1, v1

    .line 298
    iget-object p2, p0, Lcom/getcapacitor/BridgeWebChromeClient;->permissionLauncher:Landroidx/activity/result/ActivityResultLauncher;

    invoke-virtual {p2, p1}, Landroidx/activity/result/ActivityResultLauncher;->launch(Ljava/lang/Object;)V

    :goto_3
    return v2
.end method
