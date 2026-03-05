from rest_framework import serializers

from .models import Conversation


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['_id', 'title', 'created_at', 'updated_at', 'user']
        read_only_fields = ['_id', 'created_at', 'updated_at', 'user']
