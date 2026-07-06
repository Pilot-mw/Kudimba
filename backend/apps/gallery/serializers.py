from rest_framework import serializers
from .models import GalleryItem


class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = ['id', 'image', 'caption', 'alt_text', 'category',
                  'sort_order', 'is_active', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']
