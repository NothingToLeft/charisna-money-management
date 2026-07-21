.class Lcom/getcapacitor/plugin/SystemBars$1;
.super Lcom/getcapacitor/WebViewListener;
.source "SystemBars.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/getcapacitor/plugin/SystemBars;->handleOnStart()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/getcapacitor/plugin/SystemBars;


# direct methods
.method constructor <init>(Lcom/getcapacitor/plugin/SystemBars;)V
    .locals 0
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x8010
        }
        names = {
            null
        }
    .end annotation

    .line 77
    iput-object p1, p0, Lcom/getcapacitor/plugin/SystemBars$1;->this$0:Lcom/getcapacitor/plugin/SystemBars;

    invoke-direct {p0}, Lcom/getcapacitor/WebViewListener;-><init>()V

    return-void
.end method


# virtual methods
.method public onPageCommitVisible(Landroid/webkit/WebView;Ljava/lang/String;)V
    .locals 0

    .line 80
    invoke-super {p0, p1, p2}, Lcom/getcapacitor/WebViewListener;->onPageCommitVisible(Landroid/webkit/WebView;Ljava/lang/String;)V

    .line 81
    iget-object p1, p0, Lcom/getcapacitor/plugin/SystemBars$1;->this$0:Lcom/getcapacitor/plugin/SystemBars;

    invoke-virtual {p1}, Lcom/getcapacitor/plugin/SystemBars;->getBridge()Lcom/getcapacitor/Bridge;

    move-result-object p1

    invoke-virtual {p1}, Lcom/getcapacitor/Bridge;->getWebView()Landroid/webkit/WebView;

    move-result-object p1

    invoke-virtual {p1}, Landroid/webkit/WebView;->requestApplyInsets()V

    return-void
.end method
