from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework import status

User = get_user_model()


class SearchUserAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"users": []}, status=status.HTTP_200_OK)

        users = User.objects.filter(name__icontains=query)[:10]
        data = [{"id": user.id, "name": user.name,
                 "image": user.image.url if user.image else None} for user in users]
        return Response({"users": data}, status=status.HTTP_200_OK)
