from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import AboutContent
from .serializers import AboutContentSerializer
from apps.accounts.permissions import IsEditorOrAdmin


class AboutContentViewSet(viewsets.ModelViewSet):
    queryset = AboutContent.objects.all()
    serializer_class = AboutContentSerializer
    permission_classes = [IsEditorOrAdmin]

    def get_object(self):
        obj, _ = AboutContent.objects.get_or_create(pk=1)
        return obj

    def list(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(pk=1)
