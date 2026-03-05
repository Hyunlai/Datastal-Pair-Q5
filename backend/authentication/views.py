from django.http import JsonResponse


def authentication_healthcheck(request):
	return JsonResponse({"message": "Authentication API is up"})

# Create your views here.
