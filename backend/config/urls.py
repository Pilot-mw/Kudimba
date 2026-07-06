from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.products.urls')),
    path('api/v1/', include('apps.gallery.urls')),
    path('api/v1/', include('apps.news.urls')),
    path('api/v1/', include('apps.homepage.urls')),
    path('api/v1/', include('apps.adverts.urls')),
    path('api/v1/', include('apps.announcements.urls')),
    path('api/v1/', include('apps.about.urls')),
    path('api/v1/', include('apps.contact.urls')),
    path('api/v1/', include('apps.testimonials.urls')),
    path('api/v1/', include('apps.staff.urls')),
    path('api/v1/', include('apps.faq.urls')),
    path('api/v1/', include('apps.downloads.urls')),
    path('api/v1/', include('apps.medialibrary.urls')),
    path('api/v1/', include('apps.settings_app.urls')),
    path('api/v1/', include('apps.audit.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
