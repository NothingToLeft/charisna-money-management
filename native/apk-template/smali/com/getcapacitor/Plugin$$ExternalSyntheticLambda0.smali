.class public final synthetic Lcom/getcapacitor/Plugin$$ExternalSyntheticLambda0;
.super Ljava/lang/Object;
.source "D8$$SyntheticClass"

# interfaces
.implements Landroidx/activity/result/ActivityResultCallback;


# instance fields
.field public final synthetic f$0:Lcom/getcapacitor/Plugin;

.field public final synthetic f$1:Ljava/lang/reflect/Method;


# direct methods
.method public synthetic constructor <init>(Lcom/getcapacitor/Plugin;Ljava/lang/reflect/Method;)V
    .locals 0

    .line 0
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/getcapacitor/Plugin$$ExternalSyntheticLambda0;->f$0:Lcom/getcapacitor/Plugin;

    iput-object p2, p0, Lcom/getcapacitor/Plugin$$ExternalSyntheticLambda0;->f$1:Ljava/lang/reflect/Method;

    return-void
.end method


# virtual methods
.method public final onActivityResult(Ljava/lang/Object;)V
    .locals 2

    .line 0
    iget-object v0, p0, Lcom/getcapacitor/Plugin$$ExternalSyntheticLambda0;->f$0:Lcom/getcapacitor/Plugin;

    iget-object v1, p0, Lcom/getcapacitor/Plugin$$ExternalSyntheticLambda0;->f$1:Ljava/lang/reflect/Method;

    check-cast p1, Landroidx/activity/result/ActivityResult;

    invoke-static {v0, v1, p1}, Lcom/getcapacitor/Plugin;->$r8$lambda$7dmJ1HQ3Jrtmh-tOCDedcONSntE(Lcom/getcapacitor/Plugin;Ljava/lang/reflect/Method;Landroidx/activity/result/ActivityResult;)V

    return-void
.end method
