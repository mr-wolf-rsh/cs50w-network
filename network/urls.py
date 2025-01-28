
from django.urls import path, re_path
from django.views.generic.base import RedirectView

from . import views

app_name = 'network'

urlpatterns = [
    re_path(r'^$', views.index, name="index"),
    # re_path(r'^$', views.FrontendAppView.as_view(), name="index"),

    # API Routes
    path('csrf', views.csrf, name="csrf"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("posts", views.post, name="post"),
    path("posts/<str:type>", views.posts, name="posts"),
    path("profiles/<str:username>", views.profile, name="profile"),
    path("profiles/<str:username>/<str:type>", views.followers_or_following, name="followers_or_following"),

    re_path(r'^.+/?$', RedirectView.as_view(pattern_name='network:index', permanent=True))
]
