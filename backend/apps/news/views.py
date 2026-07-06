from django.utils.timezone import now
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import ArticleCategory, Article
from .serializers import (
    ArticleCategorySerializer, ArticleSerializer, ArticleListSerializer
)
from apps.accounts.permissions import IsEditorOrAdmin, ReadOnlyOrEditorOrAdmin


class ArticleCategoryViewSet(viewsets.ModelViewSet):
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer
    permission_classes = [IsEditorOrAdmin]
    search_fields = ['name']
    ordering = ['name']


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    permission_classes = [ReadOnlyOrEditorOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'categories', 'is_featured', 'author', 'slug']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['published_at', 'created_at', 'title']
    ordering = ['-published_at', '-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        return ArticleSerializer

    def get_queryset(self):
        qs = Article.objects.all()
        if self.request.user.is_authenticated:
            return qs
        return qs.filter(status='published')

    def perform_create(self, serializer):
        article = serializer.save(author=self.request.user)
        if article.status == 'published' and not article.published_at:
            article.published_at = now()
            article.save(update_fields=['published_at'])

    def perform_update(self, serializer):
        article = serializer.save()
        if article.status == 'published' and not article.published_at:
            article.published_at = now()
            article.save(update_fields=['published_at'])
