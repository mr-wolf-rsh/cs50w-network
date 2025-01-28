from django.contrib import admin
from .models import Post, User

# Register your models here.


class PostAdmin(admin.ModelAdmin):
    list_display = [
        field.name for field in Post._meta.concrete_fields if field.name != 'content']
    filter_horizontal = ('liked_by',)


admin.site.register(Post, PostAdmin)


class UserAdmin(admin.ModelAdmin):
    list_display = [
        field.name for field in User._meta.concrete_fields if field.name != 'password']
    filter_horizontal = ('followers',)


admin.site.register(User, UserAdmin)
