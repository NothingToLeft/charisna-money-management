.class public final enum Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;
.super Ljava/lang/Enum;
.source "HttpRequestHandler.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/getcapacitor/plugin/util/HttpRequestHandler;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x4019
    name = "ResponseType"
.end annotation

.annotation system Ldalvik/annotation/Signature;
    value = {
        "Ljava/lang/Enum<",
        "Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;",
        ">;"
    }
.end annotation


# static fields
.field private static final synthetic $VALUES:[Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

.field public static final enum ARRAY_BUFFER:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

.field public static final enum BLOB:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

.field static final DEFAULT:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

.field public static final enum DOCUMENT:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

.field public static final enum JSON:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

.field public static final enum TEXT:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;


# instance fields
.field private final name:Ljava/lang/String;


# direct methods
.method private static synthetic $values()[Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;
    .locals 5

    .line 37
    sget-object v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->ARRAY_BUFFER:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    sget-object v1, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->BLOB:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    sget-object v2, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->DOCUMENT:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    sget-object v3, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->JSON:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    sget-object v4, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->TEXT:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    filled-new-array {v0, v1, v2, v3, v4}, [Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    move-result-object v0

    return-object v0
.end method

.method static constructor <clinit>()V
    .locals 4

    .line 38
    new-instance v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    const/4 v1, 0x0

    const-string v2, "arraybuffer"

    const-string v3, "ARRAY_BUFFER"

    invoke-direct {v0, v3, v1, v2}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;-><init>(Ljava/lang/String;ILjava/lang/String;)V

    sput-object v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->ARRAY_BUFFER:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    .line 39
    new-instance v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    const/4 v1, 0x1

    const-string v2, "blob"

    const-string v3, "BLOB"

    invoke-direct {v0, v3, v1, v2}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;-><init>(Ljava/lang/String;ILjava/lang/String;)V

    sput-object v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->BLOB:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    .line 40
    new-instance v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    const/4 v1, 0x2

    const-string v2, "document"

    const-string v3, "DOCUMENT"

    invoke-direct {v0, v3, v1, v2}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;-><init>(Ljava/lang/String;ILjava/lang/String;)V

    sput-object v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->DOCUMENT:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    .line 41
    new-instance v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    const/4 v1, 0x3

    const-string v2, "json"

    const-string v3, "JSON"

    invoke-direct {v0, v3, v1, v2}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;-><init>(Ljava/lang/String;ILjava/lang/String;)V

    sput-object v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->JSON:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    .line 42
    new-instance v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    const/4 v1, 0x4

    const-string v2, "text"

    const-string v3, "TEXT"

    invoke-direct {v0, v3, v1, v2}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;-><init>(Ljava/lang/String;ILjava/lang/String;)V

    sput-object v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->TEXT:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    .line 37
    invoke-static {}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->$values()[Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    move-result-object v1

    sput-object v1, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->$VALUES:[Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    .line 50
    sput-object v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->DEFAULT:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    return-void
.end method

.method private constructor <init>(Ljava/lang/String;ILjava/lang/String;)V
    .locals 0
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x1000,
            0x1000,
            0x0
        }
        names = {
            null,
            null,
            null
        }
    .end annotation

    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            ")V"
        }
    .end annotation

    .line 46
    invoke-direct {p0, p1, p2}, Ljava/lang/Enum;-><init>(Ljava/lang/String;I)V

    .line 47
    iput-object p3, p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->name:Ljava/lang/String;

    return-void
.end method

.method public static parse(Ljava/lang/String;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;
    .locals 5

    .line 53
    invoke-static {}, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->values()[Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    move-result-object v0

    array-length v1, v0

    const/4 v2, 0x0

    :goto_0
    if-ge v2, v1, :cond_1

    aget-object v3, v0, v2

    .line 54
    iget-object v4, v3, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->name:Ljava/lang/String;

    invoke-virtual {v4, p0}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v4

    if-eqz v4, :cond_0

    return-object v3

    :cond_0
    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    .line 58
    :cond_1
    sget-object p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->DEFAULT:Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    return-object p0
.end method

.method public static valueOf(Ljava/lang/String;)Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;
    .locals 1
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x8000
        }
        names = {
            null
        }
    .end annotation

    .line 37
    const-class v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    invoke-static {v0, p0}, Ljava/lang/Enum;->valueOf(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;

    move-result-object p0

    check-cast p0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    return-object p0
.end method

.method public static values()[Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;
    .locals 1

    .line 37
    sget-object v0, Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->$VALUES:[Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    invoke-virtual {v0}, [Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;->clone()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, [Lcom/getcapacitor/plugin/util/HttpRequestHandler$ResponseType;

    return-object v0
.end method
