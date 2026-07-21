.class Lcom/getcapacitor/PluginCall$PluginCallDataTypeException;
.super Ljava/lang/Exception;
.source "PluginCall.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/getcapacitor/PluginCall;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = "PluginCallDataTypeException"
.end annotation


# instance fields
.field final synthetic this$0:Lcom/getcapacitor/PluginCall;


# direct methods
.method constructor <init>(Lcom/getcapacitor/PluginCall;Ljava/lang/String;)V
    .locals 0
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x8010,
            0x0
        }
        names = {
            null,
            null
        }
    .end annotation

    .line 390
    iput-object p1, p0, Lcom/getcapacitor/PluginCall$PluginCallDataTypeException;->this$0:Lcom/getcapacitor/PluginCall;

    .line 391
    invoke-direct {p0, p2}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    return-void
.end method
