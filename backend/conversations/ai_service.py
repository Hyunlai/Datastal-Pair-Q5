import re

from django.conf import settings
from openai import OpenAI

from .models import Conversation


DEFAULT_OFF_TOPIC_REPLY = (
    "I can only help with mythology topics. Please ask about myths, gods, heroes, epics, "
    "folklore, or mythological traditions."
)

MYTHOLOGY_KEYWORDS = {
    'myth',
    'mythology',
    'mythological',
    'legend',
    'folklore',
    'epic',
    'pantheon',
    'deity',
    'god',
    'goddess',
    'hero',
    'titan',
    'olympus',
    'olympian',
    'greek',
    'roman',
    'norse',
    'egyptian',
    'hindu',
    'mesopotamian',
    'aztec',
    'maya',
    'japanese',
    'celtic',
    'arthurian',
    'odin',
    'thor',
    'loki',
    'zeus',
    'hera',
    'athena',
    'ares',
    'apollo',
    'artemis',
    'poseidon',
    'hades',
    'persephone',
    'anubis',
    'isis',
    'osiris',
    'ra',
    'ramayana',
    'mahabharata',
    'iliad',
    'odyssey',
}


def _is_mythology_related(text: str) -> bool:
    tokens = set(re.findall(r"[a-zA-Z']+", text.lower()))
    return bool(tokens & MYTHOLOGY_KEYWORDS)


def _latest_user_prompt(conversation: Conversation) -> str:
    message = conversation.messages.filter(role='user').order_by('-created_at').first()
    return message.content if message else ''


def generate_ai_reply(conversation: Conversation) -> str:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError('OPENAI_API_KEY is not configured.')

    user_prompt = _latest_user_prompt(conversation)
    if not _is_mythology_related(user_prompt):
        return DEFAULT_OFF_TOPIC_REPLY

    system_prompt = (
        "You are Mythology Scholar, a domain expert in world mythology. "
        "Answer only mythology-related questions with concise, accurate explanations and relevant context. "
        "Allowed scope includes myths, gods, heroes, monsters, epics, symbols, rituals, and comparative mythology. "
        "If a request is outside mythology, do not answer it. Reply exactly with: "
        f"\"{DEFAULT_OFF_TOPIC_REPLY}\""
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
        temperature=0.2,
    )

    text = completion.choices[0].message.content
    return (text or '').strip() or 'I could not generate a response right now.'
