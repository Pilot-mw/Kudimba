from rest_framework import serializers
from .models import AboutContent


class AboutContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutContent
        fields = ['id', 'mission', 'vision', 'story', 'ceo_message',
                  'ceo_name', 'ceo_title', 'ceo_image', 'is_published', 'updated_at']
        read_only_fields = ['id', 'updated_at']
