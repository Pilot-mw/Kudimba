from django.db import models


class AboutContent(models.Model):
    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    story = models.TextField(blank=True)
    ceo_message = models.TextField(blank=True)
    ceo_name = models.CharField(max_length=200, blank=True)
    ceo_title = models.CharField(max_length=200, blank=True)
    ceo_image = models.ImageField(upload_to='about/', null=True, blank=True)
    is_published = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'About Content'
        verbose_name_plural = 'About Content'

    def __str__(self):
        return 'About Us Content'

    def save(self, *args, **kwargs):
        if AboutContent.objects.exists() and not self.pk:
            existing = AboutContent.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)
