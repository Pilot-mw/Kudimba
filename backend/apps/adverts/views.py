from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Advert
from .serializers import AdvertSerializer
from apps.accounts.permissions import IsEditorOrAdmin


class AdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.all()
    serializer_class = AdvertSerializer
    permission_classes = [IsEditorOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['display_position', 'is_active']
    ordering = ['-created_at']
