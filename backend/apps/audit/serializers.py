from rest_framework import serializers
from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'user_name', 'user_email', 'action', 'content_type',
                  'object_id', 'object_repr', 'changes', 'ip_address', 'created_at']
        read_only_fields = fields
