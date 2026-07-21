.class public final synthetic Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda11;
.super Ljava/lang/Object;
.source "D8$$SyntheticClass"

# interfaces
.implements Lcom/getcapacitor/BridgeWebChromeClient$PermissionListener;


# instance fields
.field public final synthetic f$0:Landroid/webkit/PermissionRequest;


# direct methods
.method public synthetic constructor <init>(Landroid/webkit/PermissionRequest;)V
    .locals 0

    .line 0
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda11;->f$0:Landroid/webkit/PermissionRequest;

    return-void
.end method


# virtual methods
.method public final onPermissionSelect(Ljava/lang/Boolean;)V
    .locals 1

    .line 0
    iget-object v0, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda11;->f$0:Landroid/webkit/PermissionRequest;

    invoke-static {v0, p1}, Lcom/getcapacitor/BridgeWebChromeClient;->lambda$onPermissionRequest$2(Landroid/webkit/PermissionRequest;Ljava/lang/Boolean;)V

    return-void
.end method
