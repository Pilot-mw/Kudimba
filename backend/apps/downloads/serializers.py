from rest_framework import serializers
from .models import Download


class DownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Download
        fields = ['id', 'title', 'description', 'file', 'file_type', 'file_size',
                  'category', 'is_active', 'download_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'download_count', 'created_at', 'updated_at']
