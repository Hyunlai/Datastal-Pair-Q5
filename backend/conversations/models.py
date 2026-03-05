from django.db import models
from django.contrib.auth.models import User
import uuid


class Conversation(models.Model):
    _id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations')

    def __str__(self):
        return self.title
