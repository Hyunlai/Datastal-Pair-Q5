from django.urls import include, path
from conversations.views import chat_view

urlpatterns = [
    path('conversation/', chat_view),
    path('conversations/', include('conversations.urls')),
    path('auth/', include('authentication.urls')),
]
