from django.contrib import admin
from .models import AboutContent


@admin.register(AboutContent)
class AboutContentAdmin(admin.ModelAdmin):
    list_display = ['is_published', 'updated_at']
