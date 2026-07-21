.class public Lcom/charisna/moneymanagement/MainActivity;
.super Lcom/getcapacitor/BridgeActivity;
.source "MainActivity.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    invoke-direct {p0}, Lcom/getcapacitor/BridgeActivity;-><init>()V

    return-void
.end method


# virtual methods
.method protected onCreate(Landroid/os/Bundle;)V
    .locals 4

    const-class v0, Lcom/charisna/moneymanagement/NativeFilePlugin;

    invoke-virtual {p0, v0}, Lcom/charisna/moneymanagement/MainActivity;->registerPlugin(Ljava/lang/Class;)V

    const-class v0, Lcom/charisna/moneymanagement/NativeReminderPlugin;

    invoke-virtual {p0, v0}, Lcom/charisna/moneymanagement/MainActivity;->registerPlugin(Ljava/lang/Class;)V

    invoke-super {p0, p1}, Lcom/getcapacitor/BridgeActivity;->onCreate(Landroid/os/Bundle;)V

    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v1, 0x21

    if-lt v0, v1, :cond_done

    const-string v0, "android.permission.POST_NOTIFICATIONS"

    invoke-virtual {p0, v0}, Lcom/charisna/moneymanagement/MainActivity;->checkSelfPermission(Ljava/lang/String;)I

    move-result v1

    if-eqz v1, :cond_done

    const/4 v1, 0x1

    new-array v1, v1, [Ljava/lang/String;

    const/4 v2, 0x0

    aput-object v0, v1, v2

    const/16 v3, 0x1394

    invoke-virtual {p0, v1, v3}, Lcom/charisna/moneymanagement/MainActivity;->requestPermissions([Ljava/lang/String;I)V

    :cond_done

    return-void
.end method
