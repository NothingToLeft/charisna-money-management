.class public Lcom/getcapacitor/ProcessedRoute;
.super Ljava/lang/Object;
.source "ProcessedRoute.java"


# instance fields
.field private ignoreAssetPath:Z

.field private isAsset:Z

.field private path:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 8
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public getPath()Ljava/lang/String;
    .locals 1

    .line 15
    iget-object v0, p0, Lcom/getcapacitor/ProcessedRoute;->path:Ljava/lang/String;

    return-object v0
.end method

.method public isAsset()Z
    .locals 1

    .line 23
    iget-boolean v0, p0, Lcom/getcapacitor/ProcessedRoute;->isAsset:Z

    return v0
.end method

.method public isIgnoreAssetPath()Z
    .locals 1

    .line 31
    iget-boolean v0, p0, Lcom/getcapacitor/ProcessedRoute;->ignoreAssetPath:Z

    return v0
.end method

.method public setAsset(Z)V
    .locals 0

    .line 27
    iput-boolean p1, p0, Lcom/getcapacitor/ProcessedRoute;->isAsset:Z

    return-void
.end method

.method public setIgnoreAssetPath(Z)V
    .locals 0

    .line 35
    iput-boolean p1, p0, Lcom/getcapacitor/ProcessedRoute;->ignoreAssetPath:Z

    return-void
.end method

.method public setPath(Ljava/lang/String;)V
    .locals 0

    .line 19
    iput-object p1, p0, Lcom/getcapacitor/ProcessedRoute;->path:Ljava/lang/String;

    return-void
.end method
