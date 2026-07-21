.class public final enum Lcom/getcapacitor/PermissionState;
.super Ljava/lang/Enum;
.source "PermissionState.java"


# annotations
.annotation system Ldalvik/annotation/Signature;
    value = {
        "Ljava/lang/Enum<",
        "Lcom/getcapacitor/PermissionState;",
        ">;"
    }
.end annotation


# static fields
.field private static final synthetic $VALUES:[Lcom/getcapacitor/PermissionState;

.field public static final enum DENIED:Lcom/getcapacitor/PermissionState;

.field public static final enum GRANTED:Lcom/getcapacitor/PermissionState;

.field public static final enum PROMPT:Lcom/getcapacitor/PermissionState;

.field public static final enum PROMPT_WITH_RATIONALE:Lcom/getcapacitor/PermissionState;


# instance fields
.field private state:Ljava/lang/String;


# direct methods
.method private static synthetic $values()[Lcom/getcapacitor/PermissionState;
    .locals 4

    .line 10
    sget-object v0, Lcom/getcapacitor/PermissionState;->GRANTED:Lcom/getcapacitor/PermissionState;

    sget-object v1, Lcom/getcapacitor/PermissionState;->DENIED:Lcom/getcapacitor/PermissionState;

    sget-object v2, Lcom/getcapacitor/PermissionState;->PROMPT:Lcom/getcapacitor/PermissionState;

    sget-object v3, Lcom/getcapacitor/PermissionState;->PROMPT_WITH_RATIONALE:Lcom/getcapacitor/PermissionState;

    filled-new-array {v0, v1, v2, v3}, [Lcom/getcapacitor/PermissionState;

    move-result-object v0

    return-object v0
.end method

.method static constructor <clinit>()V
    .locals 4

    .line 11
    new-instance v0, Lcom/getcapacitor/PermissionState;

    const/4 v1, 0x0

    const-string v2, "granted"

    const-string v3, "GRANTED"

    invoke-direct {v0, v3, v1, v2}, Lcom/getcapacitor/PermissionState;-><init>(Ljava/lang/String;ILjava/lang/String;)V

    sput-object v0, Lcom/getcapacitor/PermissionState;->GRANTED:Lcom/getcapacitor/PermissionState;

    .line 12
    new-instance v0, Lcom/getcapacitor/PermissionState;

    const/4 v1, 0x1

    const-string v2, "denied"

    const-string v3, "DENIED"

    invoke-direct {v0, v3, v1, v2}, Lcom/getcapacitor/PermissionState;-><init>(Ljava/lang/String;ILjava/lang/String;)V

    sput-object v0, Lcom/getcapacitor/PermissionState;->DENIED:Lcom/getcapacitor/PermissionState;

    .line 13
    new-instance v0, Lcom/getcapacitor/PermissionState;

    const/4 v1, 0x2

    const-string v2, "prompt"

    const-string v3, "PROMPT"

    invoke-direct {v0, v3, v1, v2}, Lcom/getcapacitor/PermissionState;-><init>(Ljava/lang/String;ILjava/lang/String;)V

    sput-object v0, Lcom/getcapacitor/PermissionState;->PROMPT:Lcom/getcapacitor/PermissionState;

    .line 14
    new-instance v0, Lcom/getcapacitor/PermissionState;

    const/4 v1, 0x3

    const-string v2, "prompt-with-rationale"

    const-string v3, "PROMPT_WITH_RATIONALE"

    invoke-direct {v0, v3, v1, v2}, Lcom/getcapacitor/PermissionState;-><init>(Ljava/lang/String;ILjava/lang/String;)V

    sput-object v0, Lcom/getcapacitor/PermissionState;->PROMPT_WITH_RATIONALE:Lcom/getcapacitor/PermissionState;

    .line 10
    invoke-static {}, Lcom/getcapacitor/PermissionState;->$values()[Lcom/getcapacitor/PermissionState;

    move-result-object v0

    sput-object v0, Lcom/getcapacitor/PermissionState;->$VALUES:[Lcom/getcapacitor/PermissionState;

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

    .line 18
    invoke-direct {p0, p1, p2}, Ljava/lang/Enum;-><init>(Ljava/lang/String;I)V

    .line 19
    iput-object p3, p0, Lcom/getcapacitor/PermissionState;->state:Ljava/lang/String;

    return-void
.end method

.method public static byState(Ljava/lang/String;)Lcom/getcapacitor/PermissionState;
    .locals 2

    .line 28
    sget-object v0, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {p0, v0}, Ljava/lang/String;->toUpperCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object p0

    const/16 v0, 0x2d

    const/16 v1, 0x5f

    invoke-virtual {p0, v0, v1}, Ljava/lang/String;->replace(CC)Ljava/lang/String;

    move-result-object p0

    .line 29
    invoke-static {p0}, Lcom/getcapacitor/PermissionState;->valueOf(Ljava/lang/String;)Lcom/getcapacitor/PermissionState;

    move-result-object p0

    return-object p0
.end method

.method public static valueOf(Ljava/lang/String;)Lcom/getcapacitor/PermissionState;
    .locals 1
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x8000
        }
        names = {
            null
        }
    .end annotation

    .line 10
    const-class v0, Lcom/getcapacitor/PermissionState;

    invoke-static {v0, p0}, Ljava/lang/Enum;->valueOf(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;

    move-result-object p0

    check-cast p0, Lcom/getcapacitor/PermissionState;

    return-object p0
.end method

.method public static values()[Lcom/getcapacitor/PermissionState;
    .locals 1

    .line 10
    sget-object v0, Lcom/getcapacitor/PermissionState;->$VALUES:[Lcom/getcapacitor/PermissionState;

    invoke-virtual {v0}, [Lcom/getcapacitor/PermissionState;->clone()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, [Lcom/getcapacitor/PermissionState;

    return-object v0
.end method


# virtual methods
.method public toString()Ljava/lang/String;
    .locals 1

    .line 24
    iget-object v0, p0, Lcom/getcapacitor/PermissionState;->state:Ljava/lang/String;

    return-object v0
.end method
