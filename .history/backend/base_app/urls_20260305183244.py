from django.urls import include, path

urlpatterns = [
    path('conversations/', include('conversations.urls')),
    path('auth/', include('authentication.urls')),
]
