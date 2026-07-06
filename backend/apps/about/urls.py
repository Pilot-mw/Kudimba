from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AboutContentViewSet

router = DefaultRouter()
router.register(r'about', AboutContentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
