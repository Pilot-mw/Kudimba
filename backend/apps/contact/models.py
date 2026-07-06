from django.db import models


class ContactDetail(models.Model):
    phone = models.CharField(max_length=20, blank=True)
    whatsapp = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    map_embed_url = models.URLField(max_length=1000, blank=True)
    facebook = models.URLField(max_length=500, blank=True)
    twitter = models.URLField(max_length=500, blank=True)
    instagram = models.URLField(max_length=500, blank=True)
    linkedin = models.URLField(max_length=500, blank=True)
    youtube = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Contact Detail'
        verbose_name_plural = 'Contact Details'

    def __str__(self):
        return 'Contact Details'

    def save(self, *args, **kwargs):
        if ContactDetail.objects.exists() and not self.pk:
            existing = ContactDetail.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=300)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    replied_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.subject} - {self.name}'
