.class public Lcom/getcapacitor/ServerPath;
.super Ljava/lang/Object;
.source "ServerPath.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/getcapacitor/ServerPath$PathType;
    }
.end annotation


# instance fields
.field private final path:Ljava/lang/String;

.field private final type:Lcom/getcapacitor/ServerPath$PathType;


# direct methods
.method public constructor <init>(Lcom/getcapacitor/ServerPath$PathType;Ljava/lang/String;)V
    .locals 0

    .line 13
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 14
    iput-object p1, p0, Lcom/getcapacitor/ServerPath;->type:Lcom/getcapacitor/ServerPath$PathType;

    .line 15
    iput-object p2, p0, Lcom/getcapacitor/ServerPath;->path:Ljava/lang/String;

    return-void
.end method


# virtual methods
.method public getPath()Ljava/lang/String;
    .locals 1

    .line 23
    iget-object v0, p0, Lcom/getcapacitor/ServerPath;->path:Ljava/lang/String;

    return-object v0
.end method

.method public getType()Lcom/getcapacitor/ServerPath$PathType;
    .locals 1

    .line 19
    iget-object v0, p0, Lcom/getcapacitor/ServerPath;->type:Lcom/getcapacitor/ServerPath$PathType;

    return-object v0
.end method
