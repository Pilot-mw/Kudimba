from django.db import models
from django.conf import settings


def media_upload_path(instance, filename):
    return f'medialibrary/{instance.file_type}/{filename}'


class MediaAsset(models.Model):
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to=media_upload_path)
    file_type = models.CharField(max_length=50, blank=True)
    file_size = models.CharField(max_length=20, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='media_uploads'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Media Asset'
        verbose_name_plural = 'Media Assets'
        ordering = ['-created_at']

    def __str__(self):
        return self.title or f'Media {self.id}'
