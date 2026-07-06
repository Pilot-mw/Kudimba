from django.contrib import admin
from .models import ArticleCategory, Article


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'author', 'is_featured', 'published_at']
    list_filter = ['status', 'is_featured', 'categories']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
