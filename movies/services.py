import re
from django.db.models import QuerySet, Case, When
from movies.models import Movie, Director
from celery import group
from datetime import datetime
from .api import TMDB, OMDB
from movies.tasks import (
    save_movie_from_id_task,
    save_watch_providers_to_movie,
    save_actors_to_movie,
    save_genres_to_movie,
    save_prod_companies_to_movie,
)


def save_movies_from_ids(tmdb_ids: list[int]) -> QuerySet[Movie]:
    if not tmdb_ids:
        return Movie.objects.none()

    g = group(save_movie_from_id_task.s(tmdb_id) for tmdb_id in tmdb_ids)
    g.delay()


    trending_movies = Movie.objects.filter(tmdb_id__in=tmdb_ids)
    return trending_movies


def save_movie_from_id(tmdb_id: int) -> int:
    try:
        movie = Movie.objects.get(tmdb_id=tmdb_id)
    except Movie.DoesNotExist:
        movie = save_movie_details(tmdb_id)

    return movie.pk


def save_movie_details(tmdb_id: int) -> None:
    movie = Movie(tmdb_id=tmdb_id)

    details = TMDB.detail(movie.tmdb_id)
    genres = details["genres"]
    crew = details["credits"]["crew"]
    actors = details["credits"]["cast"]
    prod_companies = details["production_companies"]

    providers = []
    res = details["watch/providers"]["results"]
    if res and "US" in res:
        providers = details["watch/providers"]["results"]["US"]

    movie = add_tmdb_details(movie, details)

    # OMDB details
    if movie.imdb_id:
        omdb_details = OMDB.detail(movie.imdb_id)
        movie = add_omdb_details(movie, omdb_details)

    # Parse out director
    for member in crew:
        if member["job"] != "Director":
            continue
        d = None
        try:
            d = Director.objects.get(tmdb_id=member["id"])
        except Director.DoesNotExist:
            d = Director(
                name=member["name"],
                tmdb_id=member["id"],
            )

            d.set_url(member["profile_path"])
            d.save()
        finally:
            movie.director = d
            break

    # All necessary movie details are stored and movie can be saved
    movie.save()

    # Now parse genres, cast, production companies and watch providers\
    save_actors_to_movie.delay(movie.pk, actors)
    save_genres_to_movie(movie.pk, genres)
    save_prod_companies_to_movie(movie.pk, prod_companies)
    save_watch_providers_to_movie(movie.pk, providers)

    return movie


def add_tmdb_details(movie: Movie, details) -> Movie:
    movie.imdb_id = details.get("imdb_id", None)
    movie.title = details.get("title", None)
    movie.plot = details.get("overview", None)
    movie.language = details.get("original_language", None)
    movie.set_poster_url(details.get("poster_path", None))
    movie.set_backdrop_url(details.get("backdrop_path", None))

    if date := details.get("release_date", None):
        movie.release_date = datetime.strptime(date, "%Y-%m-%d")

    if runtime := details.get("runtime", None):
        hours = int(runtime) // 60
        minutes = int(runtime) % 60
        movie.runtime = f"{hours}:{minutes}"

    return movie


def add_omdb_details(movie: Movie, details) -> Movie:
    movie.country = details.get("Country", None)

    if rating := details.get("imdbRating", None):
        try:
            movie.imdb_rating = float(rating)
        except ValueError:
            pass

    if ratings := details.get("Ratings", None):
        for rating in ratings:
            if rating["Source"] == "Rotten Tomatoes":
                movie.rotten_tomatoes_rating = int(rating["Value"].strip("%"))
                break

    return movie
