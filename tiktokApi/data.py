from django.db.models import Count
from accounts.models import Post
import django
import os

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tiktokApi.settings")
django.setup()


def get_likes_count(post_id=None):
    """
    Fetch likes count for a specific post or all posts.

    Args:
        post_id (int, optional): ID of the post to fetch likes count for. Defaults to None.

    Returns:
        int or dict: Likes count for a specific post or a dictionary of post IDs with their likes count.
    """
    if post_id:
        # Fetch likes count for a specific post
        post = Post.objects.filter(id=post_id).annotate(
            likes_count=Count('likes')).first()
        return post.likes_count if post else None
    else:
        # Fetch likes count for all posts
        posts = Post.objects.annotate(likes_count=Count('likes'))
        return {post.id: post.likes_count for post in posts}


if __name__ == "__main__":
    # Example 1: Get likes count for a specific post (replace 1 with the post ID)
    post_id = 1
    likes_count = get_likes_count(post_id)
    if likes_count is not None:
        print(f"Post ID {post_id} has {likes_count} likes.")
    else:
        print(f"Post ID {post_id} not found.")

    # Example 2: Get likes count for all posts
    all_likes = get_likes_count()
    for post_id, count in all_likes.items():
        print(f"Post ID {post_id} has {count} likes.")
