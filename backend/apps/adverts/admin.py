from django.contrib import admin
from .models import Advert


@admin.register(Advert)
class AdvertAdmin(admin.ModelAdmin):
    list_display = ['title', 'display_position', 'is_active', 'click_count', 'created_at']
    list_filter = ['display_position', 'is_active']
