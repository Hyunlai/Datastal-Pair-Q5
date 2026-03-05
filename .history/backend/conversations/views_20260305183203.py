from django.http import JsonResponse


def conversations_healthcheck(request):
	return JsonResponse({"message": "Conversations API is up"})

# Create your views here.
