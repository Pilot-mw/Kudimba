from django.db import models


class GalleryItem(models.Model):
    class Category(models.TextChoices):
        FARM = 'farm', 'Farm'
        PRODUCTS = 'products', 'Products'
        TEAM = 'team', 'Team'
        EVENTS = 'events', 'Events'
        OTHER = 'other', 'Other'

    image = models.ImageField(upload_to='gallery/')
    caption = models.CharField(max_length=200, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    category = models.CharField(
        max_length=10, choices=Category.choices, default=Category.OTHER
    )
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Gallery Item'
        verbose_name_plural = 'Gallery Items'
        ordering = ['sort_order', '-uploaded_at']

    def __str__(self):
        return self.caption or f'Gallery Item {self.id}'
