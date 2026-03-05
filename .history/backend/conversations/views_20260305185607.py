from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Conversation, Message
from .serializers import ConversationCreateSerializer, ConversationSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_view(request):
	serializer = ConversationCreateSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)

	content = serializer.validated_data['resolved_content']
	raw_title = serializer.validated_data.get('title', '').strip()
	conversation_title = raw_title or content[:50]

	conversation = Conversation.objects.create(
		user=request.user,
		title=conversation_title,
	)
	Message.objects.create(
		conversation=conversation,
		role=Message.ROLE_USER,
		content=content,
	)

	output = ConversationSerializer(conversation)
	return Response(output.data, status=status.HTTP_201_CREATED)


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

