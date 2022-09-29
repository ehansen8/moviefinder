from multiprocessing import shared_memory
from os import stat
from celery import shared_task, group
from .models import *
import time


# Idea is to re-query the external APIs to get updated info
# This adds new data that orignally wasn't being recorded
# Or can apply to newer movies that might be getting Updated
@shared_task
def update_movies_in_db():
    pass


# Query TMDB to periodically update trending movies
@shared_task
def get_trending_movies():
    pass


# Email Users when one of their saved movies is now streaming
@shared_task
def email_users_now_streaming():
    pass


# Text Users when one of their saved movies is now streaming
@shared_task
def text_users_now_streaming():
    pass


# Saves / creates Actors/ Genres / etc that already have a saved movie to be added too
@shared_task
def save_actors_to_movie(movie_pk, actors):
    to_create = []
    to_set = []
    movie = Movie.objects.get(pk=movie_pk)
    for actor in actors:
        try:
            a = Actor.objects.get(tmdb_id=actor["id"])
            to_set.append(a)
        except Actor.DoesNotExist:
            a = Actor(
                name=actor["name"],
                tmdb_id=actor["id"],
            )
            a.set_url(actor["profile_path"])
            to_create.append(a)

    to_set.extend(Actor.objects.bulk_create(to_create))
    movie.actors.set(to_set)


@shared_task
def save_genres_to_movie(movie_pk, genres):
    to_create = []
    to_set = []
    movie = Movie.objects.get(pk=movie_pk)
    for e in genres:
        try:
            g = Genre.objects.get(tmdb_id=e["id"])
            to_set.append(g)
        except Genre.DoesNotExist:
            g = Genre(
                name=e["name"],
                tmdb_id=e["id"],
            )
            g.set_url(e["profile_path"])
            to_create.append(g)

    to_set.extend(Genre.objects.bulk_create(to_create))
    movie.genres.set(to_set)


@shared_task
def save_prod_companies_to_movie(movie_pk, pcs):
    to_create = []
    to_set = []
    movie = Movie.objects.get(pk=movie_pk)
    for comp in pcs:
        try:
            c = ProductionCompany.objects.get(tmdb_id=comp["id"])
            to_set.append(c)
        except ProductionCompany.DoesNotExist:
            c = ProductionCompany(
                name=comp["name"],
                tmdb_id=comp["id"],
            )
            c.set_url(comp["logo_path"])
            to_create.append(c)

    to_set.extend(ProductionCompany.objects.bulk_create(to_create))
    movie.production_companies.set(to_set)


@shared_task
def save_watch_providers_to_movie(movie_pk, providers):
    if "flatrate" in providers:
        to_create = []
        to_set = []
        movie = Movie.objects.get(pk=movie_pk)
        for provider in providers["flatrate"]:
            try:
                p = WatchProvider.objects.get(tmdb_id=provider["provider_id"])
                to_set.append(p)
            except WatchProvider.DoesNotExist:
                p = WatchProvider(
                    name=provider["provider_name"],
                    tmdb_id=provider["provider_id"],
                )
                p.set_url(provider["logo_path"])
                to_create.append(p)
        to_set.extend(WatchProvider.objects.bulk_create(to_create))
        movie.watch_providers.set(to_set)


@shared_task
def saveMovie_task(movie_obj):
    from .builders import MovieBuilder

    return MovieBuilder.saveMovie(movie_obj)
