from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MeView, login_view, register_view

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('me/', MeView.as_view(), name='auth-me'),
    path('login/', login_view, name='auth-login'),
    path('register/', register_view, name='auth-register'),
    path('', include(router.urls)),
]
