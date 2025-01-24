from .models import Comment
from rest_framework import serializers


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'text', 'user','post']

    def get_user(self, obj):
        request = self.context.get('request')
        return {
            'id': obj.user.id,
            'name': obj.user.name,
            'email': obj.user.email,
            # 'image': request.build_absolute_uri(obj.user.image.url) if request else f"{settings.MEDIA_URL}{obj.user.image.url}"
        }


