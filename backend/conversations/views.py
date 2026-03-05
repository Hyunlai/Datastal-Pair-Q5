git from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .ai_service import generate_ai_reply
from .models import Conversation, Message
from .serializers import ConversationCreateSerializer, ConversationSerializer, MessageSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_view(request):
	serializer = ConversationCreateSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)

	content = serializer.validated_data['resolved_content']
	conversation_id = serializer.validated_data.get('conversation_id')

	if conversation_id:
		conversation = get_object_or_404(Conversation, _id=conversation_id, user=request.user)
	else:
		raw_title = serializer.validated_data.get('title', '').strip()
		conversation_title = raw_title or content[:50]
		conversation = Conversation.objects.create(
			user=request.user,
			title=conversation_title,
		)

	user_message = Message.objects.create(
		conversation=conversation,
		role=Message.ROLE_USER,
		content=content,
	)

	try:
		ai_reply = generate_ai_reply(conversation=conversation)
	except Exception as exc:
		return Response(
			{'detail': f'AI provider error: {exc}'},
			status=status.HTTP_502_BAD_GATEWAY,
		)

	assistant_message = Message.objects.create(
		conversation=conversation,
		role=Message.ROLE_ASSISTANT,
		content=ai_reply,
	)

	conversation_data = ConversationSerializer(conversation).data
	response_data = {
		'conversation_id': conversation_data['_id'],
		'title': conversation_data['title'],
		'latest_user_message': MessageSerializer(user_message).data,
		'latest_assistant_message': MessageSerializer(assistant_message).data,
		'messages': conversation_data['messages'],
	}
	http_status = status.HTTP_200_OK if conversation_id else status.HTTP_201_CREATED
	return Response(response_data, status=http_status)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_list_view(request):
	conversations = Conversation.objects.filter(user=request.user).order_by('-updated_at')
	serializer = ConversationSerializer(conversations, many=True)
	return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_detail_view(request, id):
	conversation = get_object_or_404(Conversation, _id=id, user=request.user)
	serializer = ConversationSerializer(conversation)
	return Response(serializer.data, status=status.HTTP_200_OK)

