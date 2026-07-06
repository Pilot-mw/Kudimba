from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'client_name', 'client_title', 'company', 'content',
                  'avatar', 'rating', 'is_active', 'sort_order', 'created_at']
        read_only_fields = ['id', 'created_at']
