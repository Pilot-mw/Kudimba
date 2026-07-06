from rest_framework import serializers
from .models import ContactDetail, ContactMessage


class ContactDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactDetail
        fields = ['id', 'phone', 'whatsapp', 'email', 'address', 'map_embed_url',
                  'facebook', 'twitter', 'instagram', 'linkedin', 'youtube',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message',
                  'is_read', 'read_at', 'replied_at', 'created_at']
        read_only_fields = ['id', 'is_read', 'read_at', 'replied_at', 'created_at']


class ContactMessageReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'is_read', 'read_at']
        read_only_fields = ['id', 'read_at']
