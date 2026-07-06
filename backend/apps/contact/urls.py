from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactDetailViewSet, ContactMessageViewSet

router = DefaultRouter()
router.register(r'contact', ContactDetailViewSet)
router.register(r'messages', ContactMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
