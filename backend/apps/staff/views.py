from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import StaffMember
from .serializers import StaffMemberSerializer
from apps.accounts.permissions import IsEditorOrAdmin


class StaffMemberViewSet(viewsets.ModelViewSet):
    queryset = StaffMember.objects.all()
    serializer_class = StaffMemberSerializer
    permission_classes = [IsEditorOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    ordering = ['sort_order', 'name']
