from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import models
from .models import Announcement
from .serializers import AnnouncementSerializer
from apps.accounts.permissions import IsEditorOrAdmin, ReadOnlyOrEditorOrAdmin


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [ReadOnlyOrEditorOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_authenticated:
            qs = qs.filter(is_active=True)
        now = timezone.now()
        return qs.filter(
            models.Q(starts_at__isnull=True) | models.Q(starts_at__lte=now),
            models.Q(expires_at__isnull=True) | models.Q(expires_at__gte=now)
        )
