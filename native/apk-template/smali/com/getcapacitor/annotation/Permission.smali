.class public interface abstract annotation Lcom/getcapacitor/annotation/Permission;
.super Ljava/lang/Object;
.source "Permission.java"

# interfaces
.implements Ljava/lang/annotation/Annotation;


# annotations
.annotation system Ldalvik/annotation/AnnotationDefault;
    value = .subannotation Lcom/getcapacitor/annotation/Permission;
        alias = ""
        strings = {}
    .end subannotation
.end annotation

.annotation runtime Ljava/lang/annotation/Retention;
    value = .enum Ljava/lang/annotation/RetentionPolicy;->RUNTIME:Ljava/lang/annotation/RetentionPolicy;
.end annotation


# virtual methods
.method public abstract alias()Ljava/lang/String;
.end method

.method public abstract strings()[Ljava/lang/String;
.end method
