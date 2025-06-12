from ast import Return
from tabnanny import check
from requests import post
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

# from accounts.models import Post
from postsapi.models import Post
from .models import Like
from .service.post_service import PostService
from .serializers import LikeSerializer

<<<<<<< HEAD


from .utils import LikeCache  # Import LikeCache class

# from rest_framework import viewsets, status
from rest_framework.viewsets import ViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Like, Post
from .serializers import LikeSerializer

# from .cache import LikeCache  # Assuming you have this
from rest_framework.authentication import SessionAuthentication
from drf_spectacular.utils import extend_schema


class LikeViewSet(ViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={200: LikeSerializer},
        tags=["Likes"],
    )
    @action(
        detail=False,
        methods=["post"],
    )
    # def like_post(self, request):
    def post(self, request):
        """
        API to like a post.
        Expects a JSON body with a "post_id" field.
        Returns the created like object and the updated likes count.
        """
        post_id = request.data.get("post_id")
        if not post_id:
            return Response(
                {"error": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )

        like, created = Like.objects.get_or_create(user=request.user, post=post)

        if not created:
            return Response(
                {"error": "You already liked this post"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        LikeCache.update_likes_cache(post.id)
        likes_count = LikeCache.get_cached_likes_count(post.id)

        return Response(
            {"like": LikeSerializer(like).data, "likes_count": likes_count},
            status=status.HTTP_201_CREATED,
        )


class LikeDeleteViewSet(ViewSet):
    """
    ViewSet to handle liking and unliking posts.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={200: LikeSerializer},
        tags=["Likes"],
    )

    def destroy(self, request, pk=None):
        """
        DELETE /api/likes/{id}/ → Unlike a post (delete like)
        """
        try:
            like = get_object_or_404(Like, id=pk)

            # Security check: only the user who created the like can delete it
            if like.user != request.user:
                return Response(
                    {"error": "You cannot delete someone else's like."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            post_id = like.post.id

            like_data = {
                "id": like.id,
                "post_id": like.post_id,
                "user_id": like.user_id,
            }

            like.delete()

            LikeCache.invalidate_cache(post_id)
            likes_count = LikeCache.get_cached_likes_count(post_id)

            return Response(
                {
                    "like": like_data,
                    "likes_count": likes_count,
                    "success": "OK"
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)






=======
"""
>>>>>>> 5cb49775b6c5c96c5908b73ee603794a2ae24908
# class LikeView(APIView):
#     def post(self, request):
#         post_id = request.data.get('post_id')
#         if not post_id:
#             return Response({"error": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             post = Post.objects.get(id=post_id)
#         except Post.DoesNotExist:
#             return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

#         # Check if the user already liked the post
#         like, created = Like.objects.get_or_create(
#             user=request.user, post=post)

#         if not created:
#             return Response({"error": "You already liked this post"}, status=status.HTTP_400_BAD_REQUEST)

<<<<<<< HEAD
#         # Update cache after adding a like
#         LikeCache.update_likes_cache(post.id)

#         # Get the updated likes count from the cache
#         likes_count = LikeCache.get_cached_likes_count(post.id)

#         return Response({
#             "like": LikeSerializer(like).data,
#             "likes_count": likes_count
#         }, status=status.HTTP_201_CREATED)



# class LikeDeleteView(APIView):
#     """
#     API to unlike a post (delete like).
#     """

#     def delete(self, request, id):
#         try:
#             # Retrieve the Like object
#             like = get_object_or_404(Like, id=id)

#             # Save the post_id to invalidate the cache later
#             post_id = like.post.id

#             # Prepare the like data to be returned in the response
#             like_data = {
#                 'id': like.id,
#                 'post_id': like.post_id,
#                 'user_id': like.user_id
#             }

#             # Delete the like object
#             like.delete()

#             # Invalidate the cache for the affected post
#             LikeCache.invalidate_cache(post_id)

#             # Get the updated likes count from the cache
#             likes_count = LikeCache.get_cached_likes_count(post_id)

#             # Return the response with updated like data and count
#             return Response({
#                 'like': like_data,
#                 'likes_count': likes_count,
#                 'success': 'OK'
#             }, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
=======
#         return Response({"like": LikeSerializer(like).data}, status=status.HTTP_201_CREATED)
"""

from .utils import LikeCache  # Import LikeCache class
from rest_framework.viewsets import ViewSet
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication


# class LikesViewSet(ViewSet):
#     authentication_classes = [
#         SessionAuthentication
#     ]  # Disable authentication for this route
#     permission_classes = [IsAuthenticated]  # Disable permissions for this route

#     @extend_schema(
#         # This links the serializer for the request body
#         request=LikeSerializer,
#         responses={
#             201: LikeSerializer
#         },  # Expected response will be the created category
#         tags=["Likes"],
#     )
#     def create(self, request, *args, **kwargs):
#         """Create a like for a post.
#         This endpoint allows a user to like a post. It checks if the user has already liked the post
#         and returns an error if they have. If the like is successfully created, it updates the cache
#         for the post's likes count.
#         """

#         # i want to like a post base on post_id
#         post_id = request.data.get("post_id")
#         if not post_id:
#             return Response(
#                 {"error": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST
#             )
#         try:
#             post = Post.objects.get(id=post_id)
#         except Post.DoesNotExist:
#             return Response(
#                 {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
#             )
#         # Check if the user has already liked the post
#         if Like.objects.filter(user=request.user, post=post).exists():
#             return Response(
#                 {"error": "You have already liked this post."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         # Create the like object
#         request.data["post"] = post_id
#         request.data["user"] = request.user.id
#         # Serialize the data

#         serializer = LikeSerializer(data=request.data)
#         if serializer.is_valid():
#             like = serializer.save()
#             # Update the cache after adding a like
#             LikeCache.update_likes_cache(post.id)

#             # Get the updated likes count from the cache
#             likes_count = LikeCache.get_cached_likes_count(post.id)

#             return Response(
#                 {"like": LikeSerializer(like).data, "likes_count": likes_count},
#                 status=status.HTTP_201_CREATED,
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ViewSet
from drf_spectacular.utils import extend_schema

from .models import Post, Like
from .serializers import LikeSerializer
# from .cache import LikeCache  # if you're using a custom cache utility


class LikesViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    @extend_schema(
        request=LikeSerializer,
        responses={201: LikeSerializer},
        tags=["Likes"],
        summary="Like or Unlike a Post",
        description="Toggles a like: likes if not already liked, unlikes if already liked.",
    )
    def create(self, request, *args, **kwargs):
        post_id = request.data.get("post_id")
        if not post_id:
            return Response(
                {"error": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )

        existing_like = Like.objects.filter(user=request.user, post=post).first()
        if existing_like:
            existing_like.delete()
            LikeCache.update_likes_cache(post.id)
            likes_count = LikeCache.get_cached_likes_count(post.id)
            return Response(
                {"message": "Post unliked", "likes_count": likes_count},
                status=status.HTTP_200_OK,
            )

        serializer = LikeSerializer(data={"post": post_id, "user": request.user.id})
        if serializer.is_valid():
            like = serializer.save()
            LikeCache.update_likes_cache(post.id)
            likes_count = LikeCache.get_cached_likes_count(post.id)
            return Response(
                {"like": LikeSerializer(like).data, "likes_count": likes_count},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class LikeView(APIView):
#     def post(self, request):
#         post_id = request.data.get("post_id")
#         if not post_id:
#             return Response(
#                 {"error": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             post = Post.objects.get(id=post_id)
#         except Post.DoesNotExist:
#             return Response(
#                 {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
#             )

#         # Check if the user already liked the post
#         like, created = Like.objects.get_or_create(user=request.user, post=post)

#         if not created:
#             return Response(
#                 {"error": "You already liked this post"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         # Update cache after adding a like
#         LikeCache.update_likes_cache(post.id)

#         # Get the updated likes count from the cache
#         likes_count = LikeCache.get_cached_likes_count(post.id)

#         return Response(
#             {"like": LikeSerializer(like).data, "likes_count": likes_count},
#             status=status.HTTP_201_CREATED,
#         )
>>>>>>> 5cb49775b6c5c96c5908b73ee603794a2ae24908


# class LikeCreateView(APIView):
#     """
#     API to like a post.
#     """

#     def post(self, request):
#         data = request.data
#         post_id = data.get('post_id')

#         if not post_id:
#             return Response({'error': 'The post_id field is required.'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             like = Like(user=request.user, post_id=post_id)
#             like.save()

<<<<<<< HEAD
#             return Response({
#                 'like': LikeSerializer(like).data,
#                 'success': 'OK'
#             }, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# # class LikesCountView(APIView):
# #     def get(self, request, post_id):
# #         """
# #         Fetch the likes count for a specific post.
# #         """
# #         post = get_object_or_404(Post, id=post_id)
# #         likes_count = PostService.get_likes_count(post)
# #         return Response({'likes_count': likes_count}, status=status.HTTP_200_OK)
=======

class LikeDeleteView(APIView):
    """
    API to unlike a post (delete like).
    """

    def delete(self, request, id):
        try:
            # Retrieve the Like object
            like = get_object_or_404(Like, id=id)

            # Save the post_id to invalidate the cache later
            post_id = like.post.id

            # Prepare the like data to be returned in the response
            like_data = {
                "id": like.id,
                "post_id": like.post_id,
                "user_id": like.user_id,
            }

            # Delete the like object
            like.delete()

            # Invalidate the cache for the affected post
            LikeCache.invalidate_cache(post_id)

            # Get the updated likes count from the cache
            likes_count = LikeCache.get_cached_likes_count(post_id)

            # Return the response with updated like data and count
            return Response(
                {"like": like_data, "likes_count": likes_count, "success": "OK"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LikeCreateView(APIView):
    """
    API to like a post.
    """

    def post(self, request):
        data = request.data
        post_id = data.get("post_id")

        if not post_id:
            return Response(
                {"error": "The post_id field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            like = Like(user=request.user, post_id=post_id)
            like.save()

            return Response(
                {"like": LikeSerializer(like).data, "success": "OK"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# class LikesCountView(APIView):
#     def get(self, request, post_id):
#         """
#         Fetch the likes count for a specific post.
#         """
#         post = get_object_or_404(Post, id=post_id)
#         likes_count = PostService.get_likes_count(post)
#         return Response({'likes_count': likes_count}, status=status.HTTP_200_OK)
>>>>>>> 5cb49775b6c5c96c5908b73ee603794a2ae24908
