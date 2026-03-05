from .models import Conversation


class ConversationSerializer:
    """Placeholder serializer file for upcoming DRF integration."""

    model = Conversation
    fields = ['_id', 'title', 'created_at', 'updated_at', 'user']
