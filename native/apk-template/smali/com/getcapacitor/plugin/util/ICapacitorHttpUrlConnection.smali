.class public interface abstract Lcom/getcapacitor/plugin/util/ICapacitorHttpUrlConnection;
.super Ljava/lang/Object;
.source "ICapacitorHttpUrlConnection.java"


# virtual methods
.method public abstract getErrorStream()Ljava/io/InputStream;
.end method

.method public abstract getHeaderField(Ljava/lang/String;)Ljava/lang/String;
.end method

.method public abstract getInputStream()Ljava/io/InputStream;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/io/IOException;
        }
    .end annotation
.end method
