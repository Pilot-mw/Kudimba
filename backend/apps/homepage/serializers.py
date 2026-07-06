from rest_framework import serializers
from .models import HeroSection, Slider


class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = ['id', 'title', 'subtitle', 'cta_text', 'cta_link',
                  'background_image', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slider
        fields = ['id', 'title', 'subtitle', 'cta_text', 'cta_link',
                  'image', 'sort_order', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
