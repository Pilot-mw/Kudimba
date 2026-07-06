from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WebsiteSettingsViewSet

router = DefaultRouter()
router.register(r'settings', WebsiteSettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
