from django.contrib import admin
from .models import GalleryItem


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ['caption', 'category', 'sort_order', 'is_active', 'uploaded_at']
    list_filter = ['category', 'is_active']
