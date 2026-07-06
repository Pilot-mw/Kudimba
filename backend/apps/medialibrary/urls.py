from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaAssetViewSet

router = DefaultRouter()
router.register(r'media', MediaAssetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
