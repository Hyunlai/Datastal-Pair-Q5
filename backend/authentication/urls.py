from django.urls import path

from .views import authentication_healthcheck

urlpatterns = [
    path('health/', authentication_healthcheck, name='authentication-health'),
]
