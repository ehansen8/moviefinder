from django.db.models import QuerySet
from movies.models import Movie, Director
from celery import group
from datetime import datetime
from .api import TMDB, OMDB
import requests
from movies.tasks import (
    save_movie_from_id_task,
    save_watch_providers_to_movie,
    save_actors_to_movie,
    save_genres_to_movie,
    save_prod_companies_to_movie,
)

# Update Services that are mainly run via scheduled tasks
# Could potentially be called via a refresh option in the future
def update_popular():
    ids = TMDB.popular()

    movies = save_movies_from_ids(ids)
    Movie.objects.all().update(is_popular=False)
    movies.update(is_popular=True)
    return movies


def update_trending():
    ids = TMDB.trending()

    movies = save_movies_from_ids(ids)
    Movie.objects.all().update(is_trending=False)
    movies.update(is_trending=True)
    return movies


def update_upcoming():
    ids = TMDB.upcoming()
    movies = save_movies_from_ids(ids)
    Movie.objects.all().update(is_upcoming=False)
    movies.update(is_upcoming=True)
    return movies


def update_now_playing():
    ids = TMDB.now_playing()

    movies = save_movies_from_ids(ids)
    Movie.objects.all().update(is_now_playing=False)
    movies.update(is_now_playing=True)
    return movies


# Because this could potentially update more movies than OMDB allows
# Provide the starting id (to pick up from last run) and the # of querys to execute
def update_ratings(starting_id, num_records) -> dict[str, int]:

    # First we only care about updating null rt movies -> imdb rating is a bonus
    movies = Movie.objects.filter(rotten_tomatoes_rating__isnull=True).order_by('pk')

    # Next we only want movies starting after the specified id -> then limit to number of queries desired
    movies = movies.filter(pk__gte=starting_id)[:num_records]

    succeeded: int = 0
    for movie in movies:
        if movie.imdb_id:
            try:
                omdb_details = OMDB.detail(movie.imdb_id)
                add_omdb_details(movie, omdb_details)
                if movie.rotten_tomatoes_rating:
                    succeeded += 1
            # Exception means that OMDB rate limit was hit ->
            # End Search & save last id to resume later
            except requests.exceptions.RequestException:
                break

    Movie.objects.bulk_update(movies, ["imdb_rating", "rotten_tomatoes_rating"])
    
    # This should be the last saved value of movie
    last_id = movie.pk

    ret = {"last_id": last_id, "succeeded": succeeded}

    return ret


def save_movies_from_ids(tmdb_ids: list[int]) -> QuerySet[Movie]:
    if not tmdb_ids:
        return Movie.objects.none()

    results = []
    for tmdb_id in tmdb_ids:
        m = save_movie_from_id(tmdb_id)
        if m:
            results.append(m) 

    return Movie.objects.filter(pk__in=results)


def save_movie_from_id(tmdb_id: int) -> int:
    try:
        movie = Movie.objects.get(tmdb_id=tmdb_id)
    except Movie.DoesNotExist:
        try:
            movie = save_movie_details(tmdb_id)
        except requests.exceptions.RequestException:
            return None

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
        try:
            omdb_details = OMDB.detail(movie.imdb_id)
            movie = add_omdb_details(movie, omdb_details)
        except requests.exceptions.RequestException:
            pass

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
