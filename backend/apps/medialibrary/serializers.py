from rest_framework import serializers
from .models import MediaAsset


class MediaAssetSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(
        source='uploaded_by.username', read_only=True
    )

    class Meta:
        model = MediaAsset
        fields = ['id', 'title', 'description', 'file', 'file_type', 'file_size',
                  'alt_text', 'uploaded_by', 'uploaded_by_name', 'created_at']
        read_only_fields = ['id', 'file_type', 'file_size', 'uploaded_by',
                            'uploaded_by_name', 'created_at']
