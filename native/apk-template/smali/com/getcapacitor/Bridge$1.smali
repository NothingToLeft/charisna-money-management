.class Lcom/getcapacitor/Bridge$1;
.super Landroid/webkit/ServiceWorkerClient;
.source "Bridge.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/getcapacitor/Bridge;->loadWebView()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/getcapacitor/Bridge;


# direct methods
.method constructor <init>(Lcom/getcapacitor/Bridge;)V
    .locals 0
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x8010
        }
        names = {
            null
        }
    .end annotation

    .line 286
    iput-object p1, p0, Lcom/getcapacitor/Bridge$1;->this$0:Lcom/getcapacitor/Bridge;

    invoke-direct {p0}, Landroid/webkit/ServiceWorkerClient;-><init>()V

    return-void
.end method


# virtual methods
.method public shouldInterceptRequest(Landroid/webkit/WebResourceRequest;)Landroid/webkit/WebResourceResponse;
    .locals 1

    .line 289
    iget-object v0, p0, Lcom/getcapacitor/Bridge$1;->this$0:Lcom/getcapacitor/Bridge;

    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getLocalServer()Lcom/getcapacitor/WebViewLocalServer;

    move-result-object v0

    invoke-virtual {v0, p1}, Lcom/getcapacitor/WebViewLocalServer;->shouldInterceptRequest(Landroid/webkit/WebResourceRequest;)Landroid/webkit/WebResourceResponse;

    move-result-object p1

    return-object p1
.end method
