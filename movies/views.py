import json
from multiprocessing import context
from main.secrets import omdb_key, tmdb_key
from django.shortcuts import render
from django.db.models import Count
from django.urls import reverse
from django.http.request import HttpRequest
from django.http.response import HttpResponse, HttpResponseRedirect
from main.models import User
from .models import Movie, Genre
from movies.builders import MovieBuilder
from movies.forms import WatchTogetherFilterForm
from .helpers import filter_watch_together
from django.db.models import Q, F
from .selectors import *

# Create your views here.
def dashboard(request: HttpRequest) -> HttpResponse:
    user = request.user
    # Get list of friends excluding the current user
    friends = User.objects.exclude(pk=user.pk)


    upcoming_movies = Movie.objects.filter(is_upcoming=True)
    now_playing_movies = Movie.objects.filter(is_now_playing=True)
    trending_movies = Movie.objects.filter(is_trending=True)

    # Get user saved movies
    saved_movies = user.saved_movies.all().order_by("-saves__date_saved")[:5]
    watched_ratings = user.ratings.all().order_by("-date_saved")[:5]
    context = {
        "friends": friends,
        "trending_movies": trending_movies,
        "upcoming_movies": upcoming_movies,
        "now_playing_movies": now_playing_movies,
        "saved_movies": saved_movies,
        "watched_ratings": watched_ratings,
        "nbar": "dashboard",
    }
    return render(
        request,
        "movies/dashboard-2.html",
        context=context,
    )


""" User View:
    Displays the user view of passed in user ID
    This can be the session user or a different user (friend)
    Consists of saved movies (watchlist) and seen / rated movies 
"""


def user(request: HttpRequest, user_id: int) -> HttpResponse:

    user: User = User.objects.get(pk=user_id)
    saved_movies = user.saved_movies.all()
    ratings = user.ratings.all()
    context = {"saved_movies": saved_movies, "ratings": ratings}
    return render(request, "movies/user.html", context=context)


def search(request: HttpRequest) -> HttpResponse:

    if request.method == "POST":
        data = json.load(request)
        search_query = data["search"]

        movies = MovieBuilder(search_query, max_results=5).saveMovies()

        # movie-card only requires the model: movie for context
        context = {"movies": movies}
        return render(request, "movies/movie-card-list.html", context=context)

    else:
        return HttpResponseRedirect(reverse("movies:dashboard"))


""" Adds or removes a bookmark from a movie
    Also removes a rating if one exists    
"""


def bookmark(request: HttpRequest) -> HttpResponse:
    user = request.user
    if request.method == "POST":
        data = json.load(request)
        movie_id = data["movie_id"]

        movie = Movie.objects.get(pk=movie_id)

        if movie.savers.filter(pk=user.pk).exists():
            movie.savers.remove(user)
        else:
            movie.savers.add(user)

        movie.watchers.remove(user)

    saved_movies = user.saved_movies.all().order_by("-saves__date_saved")

    # movie-card only requires the model: movie for context
    context = {"movies": saved_movies}
    return render(request, "movies/movie-card-list.html", context=context)


def watch_together(request: HttpRequest) -> HttpResponse:
    user = request.user

    # Only for ajax requests
    if request.method == "POST":
        data = json.load(request)
        form = WatchTogetherFilterForm(data["form"])

        form.is_valid()
        q_filter = filter_watch_together(form)

        # The user id will never be in the request data list
        ids = [int(x) for x in data["ids"]] + [user.pk]

        movies = Movie.objects.filter(q_filter)
        movies = movies.filter(savers__pk__in=ids)
        movies = movies.annotate(count=Count("savers", distinct=True))
        movies = movies.order_by("-count", "-rating")

        active_users = User.objects.filter(pk__in=ids)
        post_context = {"recommended": movies, "active_users": active_users}

        return render(
            request, "movies/recommended-movie-list.html", context=post_context
        )

    # Get list of friends excluding the current user
    friends = User.objects.exclude(pk=user.pk)
    movies = user.saved_movies.all().order_by("-rating")

    form = WatchTogetherFilterForm(queryset=Genre.objects.all())

    get_context = {
        "recommended": movies,
        "friends": friends,
        "active_users": [user],
        "nbar": "watch_together",
        "filter_form": form,
    }
    return render(request, "movies/watch-together.html", context=get_context)


def rate(request: HttpRequest) -> HttpResponse:
    user = request.user
    if request.method == "POST":
        data = json.load(request)
        movie_id = data["movie_id"]
        rating = data["rating"]

        user.saved_movies.remove(movie_id)
        movie = Movie.objects.get(pk=movie_id)
        user.ratings.create(movie=movie, rating=rating)

    return HttpResponse("")
