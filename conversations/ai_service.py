import json
from urllib import request

from django.conf import settings
from openai import OpenAI

from .models import Conversation


def generate_ai_reply(conversation: Conversation) -> str:
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
    ]

    if settings.AI_PROVIDER == 'gemini':
        if not settings.GEMINI_API_KEY:
            raise RuntimeError('GEMINI_API_KEY is not configured.')

        user_text = "\n".join([f"{m['role']}: {m['content']}" for m in history])
        prompt = f"{system_prompt}\n\nConversation:\n{user_text}"

        gemini_payload = {
            'contents': [
                {
                    'parts': [{'text': prompt}],
                }
            ]
        }

        gemini_url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent"
            f"?key={settings.GEMINI_API_KEY}"
        )

        req = request.Request(
            gemini_url,
            data=json.dumps(gemini_payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST',
        )

        with request.urlopen(req, timeout=60) as response:
            body = json.loads(response.read().decode('utf-8'))

        candidates = body.get('candidates', [])
        if not candidates:
            return 'I could not generate a response right now.'

        parts = candidates[0].get('content', {}).get('parts', [])
        text = "".join([part.get('text', '') for part in parts]).strip()
        return text or 'I could not generate a response right now.'

    if not settings.OPENAI_API_KEY:
        raise RuntimeError('OPENAI_API_KEY is not configured.')

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    completion = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=messages,
        temperature=0.4,
    )

    text = completion.choices[0].message.content
    return (text or '').strip() or 'I could not generate a response right now.'
