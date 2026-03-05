from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True, min_length=8)

	class Meta:
		model = User
		fields = ['username', 'email', 'password']

	def create(self, validated_data):
		return User.objects.create_user(
			username=validated_data['username'],
			email=validated_data.get('email', ''),
			password=validated_data['password'],
		)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	@classmethod
	def get_token(cls, user):
		token = super().get_token(user)
		token['username'] = user.username
		token['email'] = user.email
		return token

	def validate(self, attrs):
		data = super().validate(attrs)
		data['user'] = {
			'id': self.user.id,
			'username': self.user.username,
			'email': self.user.email,
		}
		return data
