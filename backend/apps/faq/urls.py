from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FAQViewSet

router = DefaultRouter()
router.register(r'faq', FAQViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
