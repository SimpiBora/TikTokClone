from channels.generic.websocket import AsyncWebsocketConsumer
import json


class LikeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("🟢 WebSocket connected")
        await self.send(
            text_data=json.dumps(
                {
                    "type": "connection",
                    "message": "🔗 WebSocket connection established!",
                }
            )
        )

    async def receive(self, text_data):
        print(f"📨 Received from frontend: {text_data}")
        data = json.loads(text_data)

        # Sample logic based on frontend message
        message = data.get("message", "")
        if message.lower() == "like":
            response = "👍 Like received"
        elif message.lower() == "hello":
            response = "👋 Hello to you too!"
        else:
            response = f"Echo: {message}"

        await self.send(text_data=json.dumps({"type": "response", "message": response}))
