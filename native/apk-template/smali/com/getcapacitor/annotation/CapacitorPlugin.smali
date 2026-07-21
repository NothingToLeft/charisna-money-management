.class public interface abstract annotation Lcom/getcapacitor/annotation/CapacitorPlugin;
.super Ljava/lang/Object;
.source "CapacitorPlugin.java"

# interfaces
.implements Ljava/lang/annotation/Annotation;


# annotations
.annotation system Ldalvik/annotation/AnnotationDefault;
    value = .subannotation Lcom/getcapacitor/annotation/CapacitorPlugin;
        name = ""
        permissions = {}
        requestCodes = {}
    .end subannotation
.end annotation

.annotation runtime Ljava/lang/annotation/Retention;
    value = .enum Ljava/lang/annotation/RetentionPolicy;->RUNTIME:Ljava/lang/annotation/RetentionPolicy;
.end annotation


# virtual methods
.method public abstract name()Ljava/lang/String;
.end method

.method public abstract permissions()[Lcom/getcapacitor/annotation/Permission;
.end method

.method public abstract requestCodes()[I
.end method
