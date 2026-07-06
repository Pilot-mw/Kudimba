from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import WebsiteSettings
from .serializers import WebsiteSettingsSerializer
from apps.accounts.permissions import IsEditorOrAdmin


class WebsiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = WebsiteSettings.objects.all()
    serializer_class = WebsiteSettingsSerializer
    permission_classes = [IsEditorOrAdmin]

    def get_object(self):
        obj, _ = WebsiteSettings.objects.get_or_create(pk=1)
        return obj

    def list(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        instance, _ = WebsiteSettings.objects.get_or_create(pk=1)
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
