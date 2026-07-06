from django.contrib import admin
from .models import WebsiteSettings


@admin.register(WebsiteSettings)
class WebsiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['seo_title', 'footer_email', 'updated_at']
