from django.contrib import admin
from .models import MediaAsset


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ['title', 'file_type', 'file_size', 'uploaded_by', 'created_at']
    list_filter = ['file_type']
