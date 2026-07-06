from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Download
from .serializers import DownloadSerializer
from apps.accounts.permissions import IsEditorOrAdmin


class DownloadViewSet(viewsets.ModelViewSet):
    queryset = Download.objects.all()
    serializer_class = DownloadSerializer
    permission_classes = [IsEditorOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active', 'category', 'file_type']
    ordering = ['-created_at']

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.download_count += 1
        instance.save(update_fields=['download_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
