from django.db import models


class HeroSection(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    cta_text = models.CharField(max_length=100, blank=True)
    cta_link = models.CharField(max_length=300, blank=True)
    background_image = models.ImageField(upload_to='hero/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Hero Section'
        verbose_name_plural = 'Hero Sections'
        ordering = ['-updated_at']

    def __str__(self):
        return self.title


class Slider(models.Model):
    title = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=300, blank=True)
    cta_text = models.CharField(max_length=100, blank=True)
    cta_link = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to='slider/')
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return self.title or f'Slider {self.id}'
