.class abstract Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;
.super Ljava/io/InputStream;
.source "WebViewLocalServer.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/getcapacitor/WebViewLocalServer;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x40a
    name = "LazyInputStream"
.end annotation


# instance fields
.field protected final handler:Lcom/getcapacitor/WebViewLocalServer$PathHandler;

.field private is:Ljava/io/InputStream;


# direct methods
.method public constructor <init>(Lcom/getcapacitor/WebViewLocalServer$PathHandler;)V
    .locals 1

    .line 709
    invoke-direct {p0}, Ljava/io/InputStream;-><init>()V

    const/4 v0, 0x0

    .line 707
    iput-object v0, p0, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->is:Ljava/io/InputStream;

    .line 710
    iput-object p1, p0, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->handler:Lcom/getcapacitor/WebViewLocalServer$PathHandler;

    return-void
.end method

.method private getInputStream()Ljava/io/InputStream;
    .locals 1

    .line 714
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->is:Ljava/io/InputStream;

    if-nez v0, :cond_0

    .line 715
    invoke-virtual {p0}, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->handle()Ljava/io/InputStream;

    move-result-object v0

    iput-object v0, p0, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->is:Ljava/io/InputStream;

    .line 717
    :cond_0
    iget-object v0, p0, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->is:Ljava/io/InputStream;

    return-object v0
.end method


# virtual methods
.method public available()I
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 724
    invoke-direct {p0}, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->getInputStream()Ljava/io/InputStream;

    move-result-object v0

    if-eqz v0, :cond_0

    .line 725
    invoke-virtual {v0}, Ljava/io/InputStream;->available()I

    move-result v0

    return v0

    :cond_0
    const/4 v0, -0x1

    return v0
.end method

.method protected abstract handle()Ljava/io/InputStream;
.end method

.method public read()I
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 730
    invoke-direct {p0}, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->getInputStream()Ljava/io/InputStream;

    move-result-object v0

    if-eqz v0, :cond_0

    .line 731
    invoke-virtual {v0}, Ljava/io/InputStream;->read()I

    move-result v0

    return v0

    :cond_0
    const/4 v0, -0x1

    return v0
.end method

.method public read([B)I
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 736
    invoke-direct {p0}, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->getInputStream()Ljava/io/InputStream;

    move-result-object v0

    if-eqz v0, :cond_0

    .line 737
    invoke-virtual {v0, p1}, Ljava/io/InputStream;->read([B)I

    move-result p1

    return p1

    :cond_0
    const/4 p1, -0x1

    return p1
.end method

.method public read([BII)I
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 742
    invoke-direct {p0}, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->getInputStream()Ljava/io/InputStream;

    move-result-object v0

    if-eqz v0, :cond_0

    .line 743
    invoke-virtual {v0, p1, p2, p3}, Ljava/io/InputStream;->read([BII)I

    move-result p1

    return p1

    :cond_0
    const/4 p1, -0x1

    return p1
.end method

.method public skip(J)J
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation

    .line 748
    invoke-direct {p0}, Lcom/getcapacitor/WebViewLocalServer$LazyInputStream;->getInputStream()Ljava/io/InputStream;

    move-result-object v0

    if-eqz v0, :cond_0

    .line 749
    invoke-virtual {v0, p1, p2}, Ljava/io/InputStream;->skip(J)J

    move-result-wide p1

    return-wide p1

    :cond_0
    const-wide/16 p1, 0x0

    return-wide p1
.end method
