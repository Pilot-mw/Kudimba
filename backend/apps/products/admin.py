from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_featured', 'is_active', 'stock']
    list_filter = ['is_featured', 'is_active', 'heat_level', 'category']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
