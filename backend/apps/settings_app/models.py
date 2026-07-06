from django.db import models


class WebsiteSettings(models.Model):
    logo = models.ImageField(upload_to='settings/', null=True, blank=True)
    favicon = models.ImageField(upload_to='settings/', null=True, blank=True)
    primary_color = models.CharField(max_length=7, default='#4CAF50', blank=True)
    secondary_color = models.CharField(max_length=7, default='#8BC34A', blank=True)
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.TextField(max_length=500, blank=True)
    seo_keywords = models.TextField(blank=True)
    footer_content = models.TextField(blank=True)
    footer_email = models.EmailField(blank=True)
    footer_phone = models.CharField(max_length=20, blank=True)
    footer_address = models.TextField(blank=True)
    google_analytics_id = models.CharField(max_length=50, blank=True)
    custom_css = models.TextField(blank=True)
    custom_js = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Website Settings'
        verbose_name_plural = 'Website Settings'

    def __str__(self):
        return 'Website Settings'

    def save(self, *args, **kwargs):
        if WebsiteSettings.objects.exists() and not self.pk:
            existing = WebsiteSettings.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)
