.class public final synthetic Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;
.super Ljava/lang/Object;
.source "D8$$SyntheticClass"

# interfaces
.implements Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;


# instance fields
.field public final synthetic f$0:Lcom/getcapacitor/BridgeWebChromeClient;

.field public final synthetic f$1:Landroid/webkit/ValueCallback;

.field public final synthetic f$2:Landroid/webkit/WebChromeClient$FileChooserParams;

.field public final synthetic f$3:Z


# direct methods
.method public synthetic constructor <init>(Lcom/getcapacitor/BridgeWebChromeClient;Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;Z)V
    .locals 0

    .line 0
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;->f$0:Lcom/getcapacitor/BridgeWebChromeClient;

    iput-object p2, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;->f$1:Landroid/webkit/ValueCallback;

    iput-object p3, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;->f$2:Landroid/webkit/WebChromeClient$FileChooserParams;

    iput-boolean p4, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;->f$3:Z

    return-void
.end method


# virtual methods
.method public final onPermissionSelect(Ljava/lang/Boolean;)V
    .locals 4

    .line 0
    iget-object v0, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;->f$0:Lcom/getcapacitor/BridgeWebChromeClient;

    iget-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;->f$1:Landroid/webkit/ValueCallback;

    iget-object v2, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;->f$2:Landroid/webkit/WebChromeClient$FileChooserParams;

    iget-boolean v3, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda3;->f$3:Z

    invoke-static {v0, v1, v2, v3, p1}, Lcom/getcapacitor/BridgeWebChromeClient;->$r8$lambda$Q6BWBORnwFhTFdGhfzydsAfabJw(Lcom/getcapacitor/BridgeWebChromeClient;Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;ZLjava/lang/Boolean;)V

    return-void
.end method
