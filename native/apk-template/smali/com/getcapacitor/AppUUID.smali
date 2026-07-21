.class public final Lcom/getcapacitor/AppUUID;
.super Ljava/lang/Object;
.source "AppUUID.java"


# static fields
.field private static final KEY:Ljava/lang/String; = "CapacitorAppUUID"


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 12
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method private static assertAppUUID(Landroidx/appcompat/app/AppCompatActivity;)V
    .locals 2
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 31
    invoke-static {p0}, Lcom/getcapacitor/AppUUID;->readUUID(Landroidx/appcompat/app/AppCompatActivity;)Ljava/lang/String;

    move-result-object v0

    .line 32
    const-string v1, ""

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 33
    invoke-static {p0}, Lcom/getcapacitor/AppUUID;->regenerateAppUUID(Landroidx/appcompat/app/AppCompatActivity;)V

    :cond_0
    return-void
.end method

.method private static bytesToHex([B)Ljava/lang/String;
    .locals 6

    .line 56
    const-string v0, "0123456789ABCDEF"

    sget-object v1, Ljava/nio/charset/StandardCharsets;->US_ASCII:Ljava/nio/charset/Charset;

    invoke-virtual {v0, v1}, Ljava/lang/String;->getBytes(Ljava/nio/charset/Charset;)[B

    move-result-object v0

    .line 57
    array-length v1, p0

    mul-int/lit8 v1, v1, 0x2

    new-array v1, v1, [B

    const/4 v2, 0x0

    .line 58
    :goto_0
    array-length v3, p0

    if-ge v2, v3, :cond_0

    .line 59
    aget-byte v3, p0, v2

    and-int/lit16 v4, v3, 0xff

    mul-int/lit8 v5, v2, 0x2

    ushr-int/lit8 v4, v4, 0x4

    .line 60
    aget-byte v4, v0, v4

    aput-byte v4, v1, v5

    add-int/lit8 v5, v5, 0x1

    and-int/lit8 v3, v3, 0xf

    .line 61
    aget-byte v3, v0, v3

    aput-byte v3, v1, v5

    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    .line 63
    :cond_0
    new-instance p0, Ljava/lang/String;

    sget-object v0, Ljava/nio/charset/StandardCharsets;->UTF_8:Ljava/nio/charset/Charset;

    invoke-direct {p0, v1, v0}, Ljava/lang/String;-><init>([BLjava/nio/charset/Charset;)V

    return-object p0
.end method

.method private static generateUUID()Ljava/lang/String;
    .locals 3
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/security/NoSuchAlgorithmException;
        }
    .end annotation

    .line 38
    const-string v0, "SHA-256"

    invoke-static {v0}, Ljava/security/MessageDigest;->getInstance(Ljava/lang/String;)Ljava/security/MessageDigest;

    move-result-object v0

    .line 39
    invoke-static {}, Ljava/util/UUID;->randomUUID()Ljava/util/UUID;

    move-result-object v1

    invoke-virtual {v1}, Ljava/util/UUID;->toString()Ljava/lang/String;

    move-result-object v1

    sget-object v2, Ljava/nio/charset/StandardCharsets;->UTF_8:Ljava/nio/charset/Charset;

    invoke-virtual {v1, v2}, Ljava/lang/String;->getBytes(Ljava/nio/charset/Charset;)[B

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/security/MessageDigest;->update([B)V

    .line 40
    invoke-virtual {v0}, Ljava/security/MessageDigest;->digest()[B

    move-result-object v0

    invoke-static {v0}, Lcom/getcapacitor/AppUUID;->bytesToHex([B)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public static getAppUUID(Landroidx/appcompat/app/AppCompatActivity;)Ljava/lang/String;
    .locals 0
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 17
    invoke-static {p0}, Lcom/getcapacitor/AppUUID;->assertAppUUID(Landroidx/appcompat/app/AppCompatActivity;)V

    .line 18
    invoke-static {p0}, Lcom/getcapacitor/AppUUID;->readUUID(Landroidx/appcompat/app/AppCompatActivity;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method private static readUUID(Landroidx/appcompat/app/AppCompatActivity;)Ljava/lang/String;
    .locals 2

    const/4 v0, 0x0

    .line 44
    invoke-virtual {p0, v0}, Landroidx/appcompat/app/AppCompatActivity;->getPreferences(I)Landroid/content/SharedPreferences;

    move-result-object p0

    .line 45
    const-string v0, "CapacitorAppUUID"

    const-string v1, ""

    invoke-interface {p0, v0, v1}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method public static regenerateAppUUID(Landroidx/appcompat/app/AppCompatActivity;)V
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 23
    :try_start_0
    invoke-static {}, Lcom/getcapacitor/AppUUID;->generateUUID()Ljava/lang/String;

    move-result-object v0

    .line 24
    invoke-static {p0, v0}, Lcom/getcapacitor/AppUUID;->writeUUID(Landroidx/appcompat/app/AppCompatActivity;Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/security/NoSuchAlgorithmException; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    .line 26
    :catch_0
    new-instance p0, Ljava/lang/Exception;

    const-string v0, "Capacitor App UUID could not be generated."

    invoke-direct {p0, v0}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw p0
.end method

.method private static writeUUID(Landroidx/appcompat/app/AppCompatActivity;Ljava/lang/String;)V
    .locals 1

    const/4 v0, 0x0

    .line 49
    invoke-virtual {p0, v0}, Landroidx/appcompat/app/AppCompatActivity;->getPreferences(I)Landroid/content/SharedPreferences;

    move-result-object p0

    .line 50
    invoke-interface {p0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object p0

    .line 51
    const-string v0, "CapacitorAppUUID"

    invoke-interface {p0, v0, p1}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    .line 52
    invoke-interface {p0}, Landroid/content/SharedPreferences$Editor;->apply()V

    return-void
.end method
