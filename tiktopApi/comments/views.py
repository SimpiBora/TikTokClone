from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .models import Comment
from rest_framework.response import Response
from rest_framework import status
from .serializers import CommentSerializer


class CommentCreateView(APIView):
    """
    API to create a new comment.
    """

    def post(self, request):
        data = request.data
        post_id = data.get('post_id')
        comment_text = data.get('comment')

        if not post_id or not comment_text:
            return Response({'error': 'Both post_id and comment are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            comment = Comment(
                post_id=post_id, user=request.user, text=comment_text)
            comment.save()

            return Response({
                'comment': CommentSerializer(comment, context={'request': request}).data,
                'success': 'OK'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CommentDeleteView(APIView):
    """
    API to delete a comment.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        print('comment id is comming ', id)
        try:
            # Ensure comment exists
            comment = get_object_or_404(Comment, id=id)

            # Check if the requesting user is the comment owner (optional)
            if request.user != comment.user:
                return Response({'error': 'Permission denied'}, status=HTTP_400_BAD_REQUEST)

            # Prepare comment data for response before deletion
            comment_data = {
                'id': comment.id,
                'post_id': comment.post_id,
                'user_id': comment.user_id,
                'text': comment.text
            }
            comment.delete()

            return Response({'comment': comment_data, 'success': 'OK'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
