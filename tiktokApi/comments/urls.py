

from django.urls import path
from .views import CommentCreateView, CommentDeleteView
# from .views import LikesCountView, LikeCreateView, LikeDeleteView, LikeView

urlpatterns = [
    path('comments/create/', CommentCreateView.as_view(), name='comment_create'),
    path('comments/<int:id>/delete/',
         CommentDeleteView.as_view(), name='comment_delete'),
]
