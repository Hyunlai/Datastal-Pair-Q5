from django.urls import path

from .views import conversation_detail_view, conversation_list_view

urlpatterns = [
    path('', conversation_list_view, name='conversation-list'),
    path('<uuid:id>/', conversation_detail_view, name='conversation-detail'),
]
