from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import extend_schema
from .models import Post
from .serializers import PostSerializer


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


# class PostDetailView(APIView):
#     """
#     API to retrieve a specific post and related posts by the same user.
#     """

#     def get(self, request, id):
#         try:
#             post = get_object_or_404(Post, id=id)
#             related_posts = Post.objects.filter(user=post.user).values_list(
#                 "id", flat=True
#             )

#             # post_serializer = AllPostsSerializer([post], many=True)
#             post_serializer = PostSerializer(
#                 [post], many=True, context={"request": request}
#             )
#             # return Response({
#             #     'post': post_serializer.data,
#             #     'ids': list(related_posts)
#             # }, status=status.HTTP_200_OK)

#             return Response(
#                 {
#                     # post_serializer.data,
#                     "post": post_serializer.data,
#                     "ids": list(related_posts),
#                 },
#                 status=status.HTTP_200_OK,
#             )
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
