from django.db import models


class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    background_image = models.ImageField(upload_to='announcements/', null=True, blank=True)
    link_text = models.CharField(max_length=100, blank=True)
    link_url = models.URLField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
