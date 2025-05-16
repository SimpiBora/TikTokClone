import random
from faker import Faker
from django.core.management.base import BaseCommand
from django.utils.timezone import now
from accounts.models import User, Post


class Command(BaseCommand):
    help = "Generate random posts using Faker"

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Ensure there are users in the database
        if not User.objects.exists():
            self.stdout.write(self.style.ERROR(
                "No users found. Create users first."))
            return

        # Number of posts to generate
        num_posts = random.randint(1, 20)
        self.stdout.write(f"Generating {num_posts} posts...")

        # Generate posts
        posts = [
            Post(
                user=User.objects.order_by("?").first(),
                text=fake.text(max_nb_chars=200),
                created_at=now(),
                updated_at=now(),
            )
            for _ in range(num_posts)
        ]
        Post.objects.bulk_create(posts)

        self.stdout.write(self.style.SUCCESS(
            f"{num_posts} posts successfully created."))
