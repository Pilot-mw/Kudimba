from rest_framework import serializers
from .models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'background_image', 'link_text',
                  'link_url', 'is_active', 'starts_at', 'expires_at',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
