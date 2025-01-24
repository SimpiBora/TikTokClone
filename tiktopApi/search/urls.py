from django.urls import path
from .views import SearchUserAPIView

urlpatterns = [
    path('search-users', SearchUserAPIView.as_view(), name='search-users'),
]
# from rest_framework.routers import DefaultRouter
# from django.urls import path, include

# Create and register router for the PostViewSet
# router = DefaultRouter()
# router.register(r'search', SearchUserAPIView, basename='search-users')

# # # Combine the manual URLs and router-generated URLs
# # urlpatterns += router.urls


# # Define your URL patterns
# urlpatterns = [
#     #     path('user/logged-in/', LoggedInUser.as_view(), name='logged_in_user'),
#     # pass
#     path('search/', include(router.urls)),
# ]
# # urlpatterns += router.urls
