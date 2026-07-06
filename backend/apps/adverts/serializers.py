from rest_framework import serializers
from .models import Advert


class AdvertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advert
        fields = ['id', 'title', 'image', 'link', 'display_position',
                  'start_date', 'end_date', 'is_active', 'click_count', 'created_at']
        read_only_fields = ['id', 'click_count', 'created_at']
