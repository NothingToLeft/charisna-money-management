.class public final synthetic Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda7;
.super Ljava/lang/Object;
.source "D8$$SyntheticClass"

# interfaces
.implements Lcom/getcapacitor/BridgeWebChromeClient$ActivityResultListener;


# instance fields
.field public final synthetic f$0:Landroid/net/Uri;

.field public final synthetic f$1:Landroid/webkit/ValueCallback;


# direct methods
.method public synthetic constructor <init>(Landroid/net/Uri;Landroid/webkit/ValueCallback;)V
    .locals 0

    .line 0
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda7;->f$0:Landroid/net/Uri;

    iput-object p2, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda7;->f$1:Landroid/webkit/ValueCallback;

    return-void
.end method


# virtual methods
.method public final onActivityResult(Landroidx/activity/result/ActivityResult;)V
    .locals 2

    .line 0
    iget-object v0, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda7;->f$0:Landroid/net/Uri;

    iget-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda7;->f$1:Landroid/webkit/ValueCallback;

    invoke-static {v0, v1, p1}, Lcom/getcapacitor/BridgeWebChromeClient;->lambda$showImageCapturePicker$13(Landroid/net/Uri;Landroid/webkit/ValueCallback;Landroidx/activity/result/ActivityResult;)V

    return-void
.end method
