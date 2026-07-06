from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import AuditLog
from .serializers import AuditLogSerializer
from apps.accounts.permissions import IsAdminUser


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['action', 'content_type', 'user']
    search_fields = ['object_repr', 'content_type']
    ordering_fields = ['created_at', 'action']
    ordering = ['-created_at']
