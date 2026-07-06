from django.db import models


class Advert(models.Model):
    class DisplayPosition(models.TextChoices):
        HOMEPAGE = 'homepage', 'Homepage'
        SIDEBAR = 'sidebar', 'Sidebar'
        FOOTER = 'footer', 'Footer'

    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='adverts/', null=True, blank=True)
    link = models.URLField(max_length=500, blank=True)
    display_position = models.CharField(
        max_length=10, choices=DisplayPosition.choices, default=DisplayPosition.HOMEPAGE
    )
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    click_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
