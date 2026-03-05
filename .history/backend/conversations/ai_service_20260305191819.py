from django.conf import settings
from openai import OpenAI

from .models import Conversation


def generate_ai_reply(conversation: Conversation, user_prompt: str) -> str:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError('OPENAI_API_KEY is not configured.')

    system_prompt = (
        f"You are a helpful AI assistant that only answers about: {settings.AI_ALLOWED_TOPIC}. "
        "If the request is outside this topic, politely refuse and ask the user to stay on topic."
    )

    history = [
        {'role': msg.role, 'content': msg.content}
        for msg in conversation.messages.order_by('created_at')
    ]

    messages = [
        {'role': 'system', 'content': system_prompt},
        *history,
        {'role': 'user', 'content': user_prompt},
    ]

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    completion = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=messages,
        temperature=0.4,
    )

    text = completion.choices[0].message.content
    return (text or '').strip() or 'I could not generate a response right now.'
