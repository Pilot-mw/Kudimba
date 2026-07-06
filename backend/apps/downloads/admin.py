from django.contrib import admin
from .models import Download


@admin.register(Download)
class DownloadAdmin(admin.ModelAdmin):
    list_display = ['title', 'file_type', 'category', 'is_active', 'download_count']
    list_filter = ['is_active', 'category']
