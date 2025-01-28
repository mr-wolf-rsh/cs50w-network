from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import JsonResponse
from django.http.response import HttpResponse
from django.middleware.csrf import get_token
from django.shortcuts import render
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
import json

from .models import User, Post

def index(request):
    return render(request, "index.html")


@csrf_exempt
def csrf(request):
    if request.method == "GET":
        return JsonResponse({"csrftoken": get_token(request)}, status=200)
    else:
        return JsonResponse({"error": {"message": "GET request required."}}, status=405)


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        data = json.loads(request.body)
        email = data.get('email')

        try:
            username = User.objects.get(email=email).username
            password = data.get('password')
            user = authenticate(request, username=username, password=password)
            # Check if authentication successful
            if user is not None:
                login(request, user)
                return JsonResponse({"user": user.serialize()}, status=200)
            else:
                raise User.DoesNotExist
        except User.DoesNotExist:
            return JsonResponse({"error": {"message": "Invalid email and/or password."}}, status=400)
    else:
        return JsonResponse({"error": {"message": "POST request required."}}, status=405)


def logout_view(request):
    if request.method == "GET":
        logout(request)
        return HttpResponse(status=204)
    else:
        return JsonResponse({"error": {"message": "GET request required."}}, status=405)


def register(request):
    if request.method == "POST":
        data = json.loads(request.body)

        first_name = data.get('firstName')
        last_name = data.get('lastName')

        username = first_name.capitalize() + last_name.capitalize()
        email = data.get('email')

        # Ensure password matches confirmation
        password = data.get('password')
        confirmation = data.get('confirmation')

        if password != confirmation:
            return JsonResponse({"error": {"message": "Passwords must match."}}, status=400)

        # Attempt to create new user
        try:
            user = User.objects.create_user(
                username, email, password, first_name=first_name, last_name=last_name)
            user.save()
        except IntegrityError:
            return JsonResponse({"error": {"message": "Username already taken."}}, status=400)
        login(request, user)
        return JsonResponse({"user": user.serialize()}, status=201)
    else:
        return JsonResponse({"error": {"message": "POST request required."}}, status=405)


def post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("content") is None:
            return JsonResponse({"error": {"message": "Content is required."}}, status=400)
        new_post = Post(user=request.user, content=data["content"])
        new_post.save()
        return JsonResponse({"post": new_post.serialize()}, status=201)
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("type") is None or data.get("value") is None:
            return JsonResponse({"error": {"message": "Type and Value are required."}}, status=400)
        if data.get("username") is not None:
            try:
                user = User.objects.get(username=data["username"])
            except User.DoesNotExist:
                return JsonResponse({"error": {"message": "User not found."}}, status=404)
        else:
            return JsonResponse({"error": {"message": "Username is required."}}, status=400)
        if data.get("timecode") is not None:
            try:
                post = Post.objects.get(user=user, timecode=data["timecode"])
            except Post.DoesNotExist:
                return JsonResponse({"error": {"message": "Post not found."}}, status=404)
            if data["type"] == 'like' and isinstance(data["value"], bool):
                if data["value"]:
                    post.liked_by.add(request.user)
                else:
                    post.liked_by.remove(request.user)
            elif data["type"] == 'content':
                post.content = data["value"]
            else:
                return JsonResponse({"error": {"message": "Invalid type or value."}}, status=400)
            post.save()
            return JsonResponse({"post": post.serialize(request.user)}, status=200)
        else:
            return JsonResponse({"error": {"message": "Timecode from Post is required."}}, status=400)
    else:
        return JsonResponse({"error": {"message": "POST or PUT request required."}}, status=405)


def posts(request, type):
    if request.method == "GET":
        if type is not None:
            if type == "all":
                posts = Post.objects.all()
            elif type == 'following':
                posts = Post.objects.filter(
                    user__in=request.user.following.all())
            elif type == 'profile':
                if request.GET.get('username', None) is not None:
                    try:
                        user = User.objects.get(
                            username=request.GET["username"])
                    except User.DoesNotExist:
                        return JsonResponse({"error": {"message": "User not found."}}, status=404)
                else:
                    return JsonResponse({"error": {"message": "Username is required."}}, status=400)
                posts = user.posts.all()
            else:
                return JsonResponse({"error": {"message": "Invalid type."}}, status=400)
            if not posts.count() > 0:
                return JsonResponse({"posts": [], "totalPages": 0}, status=200)
            post_paginator = _get_paginator(request, posts)
            return JsonResponse({
                "posts": [post.serialize(request.user) for post in post_paginator["object_list"]],
                "totalPages": post_paginator["total_pages"]
            }, status=200)
        else:
            return JsonResponse({"error": {"message": "Type is required."}}, status=400)
    else:
        return JsonResponse({"error": {"message": "GET request required."}}, status=405)


def profile(request, username):
    if username is not None:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({"error": {"message": "User not found."}}, status=404)
    else:
        return JsonResponse({"error": {"message": "Username is required."}}, status=400)
    if request.method == "GET":
        return JsonResponse({"profile": _get_profile(user, request.user)}, status=200)
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("type") is not None:
            if data["type"] == 'follow':
                user.followers.add(request.user)
            elif data["type"] == 'unfollow':
                user.followers.remove(request.user)
            else:
                return JsonResponse({"error": {"message": "Invalid type."}}, status=400)
            user.save()
            return JsonResponse({"profile": _get_profile(user, request.user)}, status=200)
        else:
            return JsonResponse({"error": {"message": "Type is required."}}, status=400)
    else:
        return JsonResponse({"error": {"message": "GET or PUT request required."}}, status=405)


def followers_or_following(request, username, type):
    if request.method == "GET":
        if username is not None:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return JsonResponse({"error": {"message": "User not found."}}, status=404)
        else:
            return JsonResponse({"error": {"message": "Username is required."}}, status=400)
        if type is not None:
            if type == "followers":
                users = user.followers.all()
            elif type == "following":
                users = user.following.all()
            else:
                return JsonResponse({"error": "Invalid type."}, status=400)
            if not users.count() > 0:
                return JsonResponse({"profiles": [], "totalPages": 0}, status=200)
            user_paginator = _get_paginator(request, users)
            return JsonResponse({
                "profiles": [_get_profile(u, request.user) for u in user_paginator["object_list"]],
                "totalPages": user_paginator["total_pages"]
            }, status=200)
        else:
            return JsonResponse({"error": {"message": "Type is required."}}, status=400)
    else:
        return JsonResponse({"error": {"message": "GET request required."}}, status=405)


def _get_profile(user, logged_user):
    is_following = False if logged_user is None else \
        (False if user == logged_user else
         user.followers.filter(pk=logged_user.pk).exists())
    return {
        "user": user.serialize(),
        "isFollowing": is_following,
        "totalFollowing": user.following.all().count(),
        "totalFollowers": user.followers.all().count(),
        "totalPosts": user.posts.all().count()
    }


def _get_paginator(request, list_to_paginator):
    paginator = Paginator(list_to_paginator, 10)
    page = _get_page(request)
    return {
        "object_list": paginator.page(page).object_list,
        "total_pages": paginator.num_pages
    }


def _get_page(request):
    page = request.GET.get('page', '1')
    if page.isdigit():
        return int(page)
    return 1
