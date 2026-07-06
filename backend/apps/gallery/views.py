from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import GalleryItem
from .serializers import GalleryItemSerializer
from apps.accounts.permissions import IsEditorOrAdmin


class GalleryViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer
    permission_classes = [IsEditorOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_active']
    ordering = ['sort_order', '-uploaded_at']
