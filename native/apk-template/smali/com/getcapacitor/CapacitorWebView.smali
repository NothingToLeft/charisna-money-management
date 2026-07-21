.class public Lcom/getcapacitor/CapacitorWebView;
.super Landroid/webkit/WebView;
.source "CapacitorWebView.java"


# instance fields
.field private bridge:Lcom/getcapacitor/Bridge;

.field private capInputConnection:Landroid/view/inputmethod/BaseInputConnection;


# direct methods
.method public constructor <init>(Landroid/content/Context;Landroid/util/AttributeSet;)V
    .locals 0

    .line 22
    invoke-direct {p0, p1, p2}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;Landroid/util/AttributeSet;)V

    return-void
.end method


# virtual methods
.method public dispatchKeyEvent(Landroid/view/KeyEvent;)Z
    .locals 2

    .line 51
    invoke-virtual {p1}, Landroid/view/KeyEvent;->getAction()I

    move-result v0

    const/4 v1, 0x2

    if-ne v0, v1, :cond_0

    .line 52
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "document.activeElement.value = document.activeElement.value + \'"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p1}, Landroid/view/KeyEvent;->getCharacters()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    const-string v0, "\';"

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const/4 v0, 0x0

    invoke-virtual {p0, p1, v0}, Lcom/getcapacitor/CapacitorWebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    const/4 p1, 0x0

    return p1

    .line 55
    :cond_0
    invoke-super {p0, p1}, Landroid/webkit/WebView;->dispatchKeyEvent(Landroid/view/KeyEvent;)Z

    move-result p1

    return p1
.end method

.method public onCreateInputConnection(Landroid/view/inputmethod/EditorInfo;)Landroid/view/inputmethod/InputConnection;
    .locals 1

    .line 32
    iget-object v0, p0, Lcom/getcapacitor/CapacitorWebView;->bridge:Lcom/getcapacitor/Bridge;

    if-eqz v0, :cond_0

    .line 33
    invoke-virtual {v0}, Lcom/getcapacitor/Bridge;->getConfig()Lcom/getcapacitor/CapConfig;

    move-result-object v0

    goto :goto_0

    .line 35
    :cond_0
    invoke-virtual {p0}, Lcom/getcapacitor/CapacitorWebView;->getContext()Landroid/content/Context;

    move-result-object v0

    invoke-static {v0}, Lcom/getcapacitor/CapConfig;->loadDefault(Landroid/content/Context;)Lcom/getcapacitor/CapConfig;

    move-result-object v0

    .line 38
    :goto_0
    invoke-virtual {v0}, Lcom/getcapacitor/CapConfig;->isInputCaptured()Z

    move-result v0

    if-eqz v0, :cond_2

    .line 40
    iget-object p1, p0, Lcom/getcapacitor/CapacitorWebView;->capInputConnection:Landroid/view/inputmethod/BaseInputConnection;

    if-nez p1, :cond_1

    .line 41
    new-instance p1, Landroid/view/inputmethod/BaseInputConnection;

    const/4 v0, 0x0

    invoke-direct {p1, p0, v0}, Landroid/view/inputmethod/BaseInputConnection;-><init>(Landroid/view/View;Z)V

    iput-object p1, p0, Lcom/getcapacitor/CapacitorWebView;->capInputConnection:Landroid/view/inputmethod/BaseInputConnection;

    .line 43
    :cond_1
    iget-object p1, p0, Lcom/getcapacitor/CapacitorWebView;->capInputConnection:Landroid/view/inputmethod/BaseInputConnection;

    return-object p1

    .line 45
    :cond_2
    invoke-super {p0, p1}, Landroid/webkit/WebView;->onCreateInputConnection(Landroid/view/inputmethod/EditorInfo;)Landroid/view/inputmethod/InputConnection;

    move-result-object p1

    return-object p1
.end method

.method public setBridge(Lcom/getcapacitor/Bridge;)V
    .locals 0

    .line 26
    iput-object p1, p0, Lcom/getcapacitor/CapacitorWebView;->bridge:Lcom/getcapacitor/Bridge;

    return-void
.end method
