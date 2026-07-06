import os
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import MediaAsset
from .serializers import MediaAssetSerializer
from apps.accounts.permissions import IsEditorOrAdmin


class MediaAssetViewSet(viewsets.ModelViewSet):
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    permission_classes = [IsEditorOrAdmin]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['file_type']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        file_obj = self.request.data.get('file')
        if file_obj:
            ext = os.path.splitext(file_obj.name)[1].lower().lstrip('.')
            file_size = file_obj.size
            size_str = self._format_size(file_size)
            serializer.save(
                uploaded_by=self.request.user,
                file_type=ext or 'unknown',
                file_size=size_str
            )
        else:
            serializer.save(uploaded_by=self.request.user)

    def _format_size(self, size):
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f'{size:.1f} {unit}'
            size /= 1024
        return f'{size:.1f} TB'
