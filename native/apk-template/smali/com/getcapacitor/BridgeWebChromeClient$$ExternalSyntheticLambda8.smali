.class public final synthetic Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda8;
.super Ljava/lang/Object;
.source "D8$$SyntheticClass"

# interfaces
.implements Landroid/content/DialogInterface$OnClickListener;


# instance fields
.field public final synthetic f$0:Landroid/widget/EditText;

.field public final synthetic f$1:Landroid/webkit/JsPromptResult;


# direct methods
.method public synthetic constructor <init>(Landroid/widget/EditText;Landroid/webkit/JsPromptResult;)V
    .locals 0

    .line 0
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda8;->f$0:Landroid/widget/EditText;

    iput-object p2, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda8;->f$1:Landroid/webkit/JsPromptResult;

    return-void
.end method


# virtual methods
.method public final onClick(Landroid/content/DialogInterface;I)V
    .locals 2

    .line 0
    iget-object v0, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda8;->f$0:Landroid/widget/EditText;

    iget-object v1, p0, Lcom/getcapacitor/BridgeWebChromeClient$$ExternalSyntheticLambda8;->f$1:Landroid/webkit/JsPromptResult;

    invoke-static {v0, v1, p1, p2}, Lcom/getcapacitor/BridgeWebChromeClient;->lambda$onJsPrompt$8(Landroid/widget/EditText;Landroid/webkit/JsPromptResult;Landroid/content/DialogInterface;I)V

    return-void
.end method
