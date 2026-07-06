from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone
from .models import ContactDetail, ContactMessage
from .serializers import (
    ContactDetailSerializer,
    ContactMessageSerializer,
    ContactMessageReadSerializer,
)
from apps.accounts.permissions import IsEditorOrAdmin


class ContactDetailViewSet(viewsets.ModelViewSet):
    queryset = ContactDetail.objects.all()
    serializer_class = ContactDetailSerializer
    permission_classes = [IsEditorOrAdmin]

    def get_object(self):
        obj, _ = ContactDetail.objects.get_or_create(pk=1)
        return obj

    def list(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        instance, _ = ContactDetail.objects.get_or_create(pk=1)
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    permission_classes = [IsEditorOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_read']
    search_fields = ['name', 'subject', 'email', 'message']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'mark_as_read':
            return ContactMessageReadSerializer
        return ContactMessageSerializer

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['patch'])
    def mark_as_read(self, request, pk=None):
        message = self.get_object()
        message.is_read = True
        message.read_at = timezone.now()
        message.save()
        return Response(ContactMessageReadSerializer(message).data)
