from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DownloadViewSet

router = DefaultRouter()
router.register(r'downloads', DownloadViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
