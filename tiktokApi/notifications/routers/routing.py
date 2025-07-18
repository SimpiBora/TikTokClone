# # from django.urls import re_path
# # from notifications.consumers.like_consumer import LikeConsumer

# # websocket_urlpatterns = [
# #     re_path(r"ws/posts/(?P<post_id>\w+)/likes/$", LikeConsumer.as_asgi()),
# # ]

# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# import routing  # <- your top-level routing.py

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tiktopApi.settings.base")

# application = ProtocolTypeRouter(
#     {
#         "http": get_asgi_application(),
#         "websocket": AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns)),
#     }
# )


from django.urls import re_path
from notifications.consumers.like_consumer import LikeConsumer

websocket_urlpatterns = [
    re_path(r"ws/likes/$", LikeConsumer.as_asgi()),
]
