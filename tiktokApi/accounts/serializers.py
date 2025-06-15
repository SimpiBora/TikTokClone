from urllib import request
from django.conf import settings
from comments.serializers import CommentSerializer
from like.serializers import LikeSerializer
from like.models import Like

# from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.utils.html import format_html
# from .models import Post

# from .models import Post, Comment, Like
# from .models import Post, Comment, Like, User
from rest_framework import serializers

# from django.contrib.auth import get_user_model

# User = get_user_model()
from .models import User


"""
{
    "name": "mike",
    "email": "mike@example.com",
    "password": "geekyshows",
    "password_confirmation": "geekyshows",
    "first_name":"mike",
    "last_name":"vi"
}
"""


class UserRegistrationSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "name",
            "username",
            "email",
            "password",
            "password_confirmation",
        ]  # Include required fields
        extra_kwargs = {
            "password": {"write_only": True},  # Ensure password is write-only
        }

    def validate(self, data):
        """
        Ensure passwords match.
        """
        if data["password"] != data["password_confirmation"]:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def validate_email(self, value):
        """
        Ensure email is unique.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        """
        Create a new user after removing password_confirmation.
        """
        # Remove password_confirmation from validated_data
        validated_data.pop("password_confirmation", None)
        # Use create_user to ensure password is hashed
        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data.get("name", ""),
            username=validated_data.get("username"),
            password=validated_data["password"],
        )
        return user


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'name',
#                   'bio', 'image']  # Include only safe fields
# gpt code


class UserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "bio", "image"]

    # def get_image(self, obj):
    #     print('inside obj in userSerialzer ', obj)
    #     print('obj image ', obj.image)
    #     print('obj image url ', obj.image.url )
    #     if obj.image:
    #         request = self.context.get("request")
    #         return (
    #             request.build_absolute_uri(obj.image.url)
    #             if request
    #             else f"{settings.MEDIA_URL}{obj.image.url}"
    #         )
    #     return None

    # context={"request": request}



class UpdateUserImageSerializer(serializers.Serializer):
    height = serializers.FloatField()
    width = serializers.FloatField()
    top = serializers.FloatField()
    left = serializers.FloatField()
    image = serializers.ImageField()

    def validate(self, data):
        if data["height"] <= 0 or data["width"] <= 0:
            raise serializers.ValidationError("Height and width must be positive.")
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UsersCollectionSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        # This method is used to represent the collection of users
        return [UserSerializer(user).data for user in data]
