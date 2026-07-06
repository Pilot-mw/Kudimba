from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import FAQ
from .serializers import FAQSerializer
from apps.accounts.permissions import IsEditorOrAdmin


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsEditorOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_active']
    ordering = ['sort_order', 'question']
