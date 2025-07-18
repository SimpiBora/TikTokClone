from realtime.base_consumer import BaseConsumer


class LikeConsumer(BaseConsumer):
    async def connect(self):
        self.post_id = self.scope["url_route"]["kwargs"]["post_id"]
        self.group_name = f"post_{self.post_id}"

        await super().connect()

        if self.user.is_authenticated:
            await self.channel_layer.group_add(self.group_name, self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_like(self, event):
        await self.send_json(event["data"])
