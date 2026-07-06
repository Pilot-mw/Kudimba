from django.db import models


class FAQ(models.Model):
    class Category(models.TextChoices):
        GENERAL = 'general', 'General'
        PRODUCTS = 'products', 'Products'
        SHIPPING = 'shipping', 'Shipping'
        RETURNS = 'returns', 'Returns'
        OTHER = 'other', 'Other'

    question = models.CharField(max_length=300)
    answer = models.TextField()
    category = models.CharField(
        max_length=10, choices=Category.choices, default=Category.GENERAL
    )
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'question']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question
