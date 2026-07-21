.class public final synthetic Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda4;
.super Ljava/lang/Object;
.source "D8$$SyntheticClass"

# interfaces
.implements Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;


# instance fields
.field public final synthetic f$0:Lcom/getcapacitor/BridgeWebChromeClient;

.field public final synthetic f$1:Landroid/webkit/GeolocationPermissions$Callback;

.field public final synthetic f$2:Ljava/lang/String;


# direct methods
.method public synthetic constructor <init>(Lcom/getcapacitor/BridgeWebChromeClient;Landroid/webkit/GeolocationPermissions$Callback;Ljava/lang/String;)V
    .locals 0

    .line 0
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda4;->f$0:Lcom/getcapacitor/BridgeWebChromeClient;

    iput-object p2, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda4;->f$1:Landroid/webkit/GeolocationPermissions$Callback;

    iput-object p3, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda4;->f$2:Ljava/lang/String;

    return-void
.end method


# virtual methods
.method public final onPermissionSelect(Ljava/lang/Boolean;)V
    .locals 3

    .line 0
    iget-object v0, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda4;->f$0:Lcom/getcapacitor/BridgeWebChromeClient;

    iget-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda4;->f$1:Landroid/webkit/GeolocationPermissions$Callback;

    iget-object v2, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda4;->f$2:Ljava/lang/String;

    invoke-static {v0, v1, v2, p1}, Lcom/getcapacitor/BridgeWebChromeClient;->$r8$lambda$_JktA1AQpQiYcwzUd4_DsO5PViI(Lcom/getcapacitor/BridgeWebChromeClient;Landroid/webkit/GeolocationPermissions$Callback;Ljava/lang/String;Ljava/lang/Boolean;)V

    return-void
.end method
