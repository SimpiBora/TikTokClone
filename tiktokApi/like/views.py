from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
# from accounts.models import Post
from postsapi.models import Post
from .models import Like
from .service.post_service import PostService
from .serializers import LikeSerializer

'''
# class LikeView(APIView):
#  def post(self, request):
#       post_id = request.data.get('post_id')
#        if not post_id:
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

#         return Response({"like": LikeSerializer(like).data}, status=status.HTTP_201_CREATED)
'''

from .utils import LikeCache  # Import LikeCache class


class LikeView(APIView):
    def post(self, request):
        post_id = request.data.get('post_id')
        if not post_id:
            return Response({"error": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user already liked the post
        like, created = Like.objects.get_or_create(
            user=request.user, post=post)

        if not created:
            return Response({"error": "You already liked this post"}, status=status.HTTP_400_BAD_REQUEST)

        # Update cache after adding a like
        LikeCache.update_likes_cache(post.id)

        # Get the updated likes count from the cache
        likes_count = LikeCache.get_cached_likes_count(post.id)

        return Response({
            "like": LikeSerializer(like).data,
            "likes_count": likes_count
        }, status=status.HTTP_201_CREATED)


'''
class LikeDeleteView(APIView):
    """
    API to unlike a post.
    """

    def delete(self, request, id):
        try:
            like = get_object_or_404(Like, id=id)

            like_data = {
                'id': like.id,
                'post_id': like.post_id,
                'user_id': like.user_id
            }
            like.delete()

            return Response({
                'like': like_data,
                'success': 'OK'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
'''

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
                'id': like.id,
                'post_id': like.post_id,
                'user_id': like.user_id
            }

            # Delete the like object
            like.delete()

            # Invalidate the cache for the affected post
            LikeCache.invalidate_cache(post_id)

            # Get the updated likes count from the cache
            likes_count = LikeCache.get_cached_likes_count(post_id)

            # Return the response with updated like data and count
            return Response({
                'like': like_data,
                'likes_count': likes_count,
                'success': 'OK'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LikeCreateView(APIView):
    """
    API to like a post.
    """

    def post(self, request):
        data = request.data
        post_id = data.get('post_id')

        if not post_id:
            return Response({'error': 'The post_id field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            like = Like(user=request.user, post_id=post_id)
            like.save()

            return Response({
                'like': LikeSerializer(like).data,
                'success': 'OK'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# class LikesCountView(APIView):
#     def get(self, request, post_id):
#         """
#         Fetch the likes count for a specific post.
#         """
#         post = get_object_or_404(Post, id=post_id)
#         likes_count = PostService.get_likes_count(post)
#         return Response({'likes_count': likes_count}, status=status.HTTP_200_OK)
