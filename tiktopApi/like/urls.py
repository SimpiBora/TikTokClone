# from rest_framework.routers import DefaultRouter
# from django.urls import path, include

# router = DefaultRouter()
# # router.register(r'posts', PostViewSet, basename='post')

# # Combine the manual URLs and router-generated URLs
# # urlpatterns += router.urls


# # Define your URL patterns
# urlpatterns = [
#     path('', include('route.urls'))
# ]


from django.urls import path
from .views import LikeCreateView, LikeDeleteView, LikeView
# from .views import LikesCountView, LikeCreateView, LikeDeleteView, LikeView

urlpatterns = [
    # path('posts/<int:post_id>/likes-count/',
    #      LikesCountView.as_view(), name='likes-count'),
    path('likes', LikeView.as_view(), name='like-list'),
    path('likes/create/', LikeCreateView.as_view(), name='like_create'),
    path('likes/<int:id>/delete/', LikeDeleteView.as_view(), name='like_delete'),
]
