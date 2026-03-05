from django.urls import path

from .views import MyTokenObtainPairView, register_view

urlpatterns = [
    path('signup/', register_view, name='signup'),
    path('signin/', MyTokenObtainPairView.as_view(), name='signin'),
]
