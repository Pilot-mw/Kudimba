from rest_framework import viewsets, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import HeroSection, Slider
from .serializers import HeroSectionSerializer, SliderSerializer
from apps.accounts.permissions import IsEditorOrAdmin


class HeroSectionViewSet(viewsets.ModelViewSet):
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer
    permission_classes = [IsEditorOrAdmin]

    def get_queryset(self):
        return HeroSection.objects.filter(is_active=True)

    def create(self, request, *args, **kwargs):
        if HeroSection.objects.exists():
            return Response(
                {'detail': 'Only one hero section is allowed. Use PUT/PATCH to update existing.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)


class SliderViewSet(viewsets.ModelViewSet):
    queryset = Slider.objects.all()
    serializer_class = SliderSerializer
    permission_classes = [IsEditorOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    ordering = ['sort_order']
