from accounts.serializers import UserSerializer
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

User = get_user_model()


class UserSearchViewSet(ViewSet):
    """
    A viewset for searching users.
    """

    @extend_schema(
        responses={200: UserSerializer},
        tags=["Search"],
        description="Search for users by username or name.",
    )
    def list(self, request):
        query = request.GET.get("q", "").strip().lower()

        if not query:
            return Response({"detail": "No record found."}, status=status.HTTP_200_OK)

        cache_key = f"user_search:{query}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        users = User.objects.filter(
            Q(username__icontains=query) | Q(name__icontains=query)
        ).order_by("-created_at")[:10]

        serializer = UserSerializer(users, many=True, context={"request": request})
        cache.set(cache_key, serializer.data, timeout=60 * 15)  # Cache for 15 minutes

        return Response(serializer.data, status=status.HTTP_200_OK)
