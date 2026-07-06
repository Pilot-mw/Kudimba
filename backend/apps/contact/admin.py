from django.contrib import admin
from .models import ContactDetail, ContactMessage


@admin.register(ContactDetail)
class ContactDetailAdmin(admin.ModelAdmin):
    list_display = ['email', 'phone', 'updated_at']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'subject', 'email', 'is_read', 'created_at']
    list_filter = ['is_read']
    search_fields = ['name', 'subject', 'email', 'message']
