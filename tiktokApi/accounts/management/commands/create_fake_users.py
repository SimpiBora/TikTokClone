# accounts/management/commands/create_fake_users.py

from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string
from accounts.models import User
from faker import Faker
from django.contrib.auth import get_user_model

User = get_user_model()  # Use the custom user model defined in settings
fake = Faker()


class Command(BaseCommand):
    help = "Create 20 fake users for testing"

    def handle(self, *args, **kwargs):
        count = 20  # 🔴 change this number if needed
        created = 0

        for _ in range(count):
            email = fake.unique.email()
            username = fake.user_name()
            name = fake.name()
            password = "password123"

            if not User.objects.filter(email=email).exists():
                User.objects.create_user(
                    email=email,
                    username=username,
                    name=name,
                    password=password,
                )
                created += 1
                self.stdout.write(self.style.SUCCESS(f"✅ Created user: {email}"))

        self.stdout.write(self.style.SUCCESS(f"\n🎉 Done. {created} users created."))
