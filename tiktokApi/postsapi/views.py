from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import extend_schema
from .models import Post
from .serializers import PostSerializer
from django.shortcuts import get_object_or_404
from core.services import FileService  # if you have this service
from rest_framework.decorators import action


class HomeViewSet(ViewSet):
    @extend_schema(
        request=PostSerializer,  # This links the serializer for the request body
        responses={
            200: PostSerializer,  # This links the serializer for the response
        },  # Expected response will be the created category
        tags=["Posts"],
        summary="list all posts",
        description="This endpoint allows you to list all posts.",
    )
    def list(self, request):
        try:
            queryset = Post.objects.all()
            serializer = PostSerializer(
                queryset, many=True, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error is here ": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )


class PostDetailViewSets(ViewSet):
    @extend_schema(
        request=PostSerializer,
        responses={200: PostSerializer},
        tags=["Posts"],
        summary="Single post retrieve",
        description="This endpoint allows you to retrieve a single post.",
    )
    def retrieve(self, request, pk=None):
        try:
            post = get_object_or_404(Post, id=pk)

            # related_posts = Post.objects.filter(user=post.user).values()
            related_posts_ids = Post.objects.filter(user=post.user).values_list(
                "id", flat=True
            )

            post_serializer = PostSerializer(
                [post], many=True, context={"request": request}
            )

            return Response(
                {"post": post_serializer.data, "ids": list(related_posts_ids)},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PostCreateViewSet(ViewSet):
    """
    ViewSet to handle post creation with a video.
    """
    @extend_schema(
        request=PostSerializer,
        responses={200: PostSerializer},
        tags=["Posts"],
        summary="create post",
        description="This endpoint allows you to create a new post.",
    )

    # @action(detail=False, methods=['post'])
    def create(self, request):
        data = request.data
        video = request.FILES.get("video")

        if not video or not video.name.endswith(".mp4"):
            print('video is not there ', video)
            return Response(
                {"error": "The video field is required and must be a valid MP4 file."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if "text" not in data:
            print('Text is not there ', text)
            return Response(
                {"error": "The text field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            post = Post(user=request.user, text=data["text"])
            print('post is text and user there ', post)
            post = FileService.add_video(post, video)
            print('post fileser.add video ', video)
            post.save()

            return Response({"success": "OK"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PostDeleteViewSet(ViewSet):
    pass 