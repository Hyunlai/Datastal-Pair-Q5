from django.urls import path

from .views import conversations_healthcheck

urlpatterns = [
    path('health/', conversations_healthcheck, name='conversations-health'),
]
