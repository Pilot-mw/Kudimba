from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'content_type', 'object_repr', 'user', 'ip_address', 'created_at']
    list_filter = ['action', 'content_type', 'created_at']
    search_fields = ['object_repr', 'content_type']
    readonly_fields = ['user', 'action', 'content_type', 'object_id',
                       'object_repr', 'changes', 'ip_address', 'created_at']
