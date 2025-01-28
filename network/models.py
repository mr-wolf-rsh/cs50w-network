from datetime import datetime, timedelta, timezone

from django.contrib.auth.models import AbstractUser
from django.contrib.humanize.templatetags.humanize import naturaltime
from django.db import models


class Post(models.Model):
    user = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    liked_by = models.ManyToManyField(
        'User', blank=True, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    timecode = models.CharField(max_length=14, editable=False, null=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        super(Post, self).save(*args, **kwargs)
        if self.timecode is None:
            self.timecode = self.created_at.strftime("%Y%m%d%H%M%S")
            self.save(update_fields=['timecode'])

    def _get_time_format(_, timestamp):
        now = datetime.now(timezone.utc)
        if (now - timedelta(hours=24)) <= timestamp <= now:
            return naturaltime(timestamp)
        elif (now - timedelta(days=365.25)) <= timestamp <= now:
            return timestamp.strftime("%b %d")
        return timestamp.strftime("%b %d, %Y")

    def serialize(self, user=None):
        return {
            "timecode": self.timecode,
            "user": self.user.serialize(),
            "liked": False if user is None else self.liked_by.filter(pk=user.pk).exists(),
            "totalLikes": self.liked_by.all().count(),
            "content": self.content,
            "createdAt": self._get_time_format(self.created_at)
        }


class User(AbstractUser):
    followers = models.ManyToManyField(
        'self', blank=True, symmetrical=False, related_name='following')

    class Meta:
        ordering = ['username']

    def serialize(self):
        return {
            "username": self.username,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
            "dateJoined": self.date_joined.strftime("%b %d, %Y")
        }
