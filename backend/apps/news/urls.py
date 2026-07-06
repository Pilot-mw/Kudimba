from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleCategoryViewSet, ArticleViewSet

router = DefaultRouter()
router.register(r'news-categories', ArticleCategoryViewSet)
router.register(r'news', ArticleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
