from rest_framework import serializers
from .models import WebsiteSettings


class WebsiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteSettings
        fields = ['id', 'logo', 'favicon', 'primary_color', 'secondary_color',
                  'seo_title', 'seo_description', 'seo_keywords',
                  'footer_content', 'footer_email', 'footer_phone', 'footer_address',
                  'google_analytics_id', 'custom_css', 'custom_js', 'updated_at']
        read_only_fields = ['id', 'updated_at']
