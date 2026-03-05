from django.conf import settings
from openai import OpenAI

from .models import Conversation


def generate_ai_reply(conversation: Conversation) -> str:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError('OPENAI_API_KEY is not configured.')

    system_prompt = (
        "You are a Mythology Scholar. "
        "Only answer questions about mythology (e.g., gods, legends, myths, epics, folklore, and related traditions). "
        "If a request is outside mythology, politely refuse and ask the user to keep the conversation about mythology."
    )

    history = [
        {'role': msg.role, 'content': msg.content}
        for msg in conversation.messages.order_by('created_at')
    ]

    messages = [
        {'role': 'system', 'content': system_prompt},
        *history,
    ]

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    completion = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=messages,
        temperature=0.4,
    )

    text = completion.choices[0].message.content
    return (text or '').strip() or 'I could not generate a response right now.'
