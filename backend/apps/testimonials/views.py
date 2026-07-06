from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Testimonial
from .serializers import TestimonialSerializer
from apps.accounts.permissions import IsEditorOrAdmin


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsEditorOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active', 'rating']
    ordering = ['sort_order', '-created_at']
