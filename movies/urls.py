from django.urls import path
from . import views

app_name = "movies"
urlpatterns = [
    path("dashboard", views.dashboard, name="dashboard"),
    path("user/<int:user_id>", views.user, name="user"),
    path("search", views.search, name="search"),
    path("bookmark", views.bookmark, name="bookmark"),
    path("watch-together", views.watch_together, name="watch_together"),
    path("rate", views.rate, name="rate"),
    path("detail/<int:movie_id>", views.detail, name="detail")

]
