from rest_framework import serializers

from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'role', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class ConversationCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, required=False, allow_blank=True)
    content = serializers.CharField(required=False, allow_blank=True)
    prompt = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        content = attrs.get('content') or attrs.get('prompt')
        if not content:
            raise serializers.ValidationError('Either content or prompt is required.')
        attrs['resolved_content'] = content
        return attrs


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['_id', 'title', 'created_at', 'updated_at', 'user', 'messages']
        read_only_fields = ['_id', 'created_at', 'updated_at', 'user']
