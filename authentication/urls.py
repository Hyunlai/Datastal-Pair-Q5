from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import MyTokenObtainPairView, register_view

urlpatterns = [
    path('signup/', register_view, name='signup'),
    path('signin/', MyTokenObtainPairView.as_view(), name='signin'),
    path('signin/refresh/', TokenRefreshView.as_view(), name='signin_refresh'),
]
