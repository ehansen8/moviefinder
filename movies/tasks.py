from celery import shared_task
from .models import *
from django_celery_results.models import *


@shared_task
def update_popular_task():
    from .services import update_popular

    update_popular()


@shared_task
def update_trending_task():
    from .services import update_trending

    update_trending()


@shared_task
def update_now_playing_task():
    from .services import update_now_playing

    update_now_playing()


@shared_task
def update_upcoming_task():
    from .services import update_upcoming

    update_upcoming()


# if num_records in None: they will all be calculated
@shared_task
def update_ratings_task(starting_id=None, num_records=900):
    # Pick up the previous starting id if its null
    if not starting_id:
        last_run_task = (
            TaskResult.objects.filter(
                task_name="movies.tasks.update_ratings_task", status="SUCCESS"
            )
            .order_by("-date_done")
            .first()
        )

        starting_id = json.loads(last_run_task.result)["last_id"]
    from .services import update_ratings

    return update_ratings(starting_id=starting_id, num_records=num_records)


# Tries to add movies from TMDB that we don't currently have on file
@shared_task(name="add-new-movies")
def add_new_movies_task(starting_id, num_records=25):
    # Pick up the previous starting id if its null
    if not starting_id:
        last_run_task = (
            TaskResult.objects.filter(task_name="add-new-movies", status="SUCCESS")
            .order_by("-date_done")
            .first()
        )

        starting_id = json.loads(last_run_task.result)["last_id"] + 1

    from .services import save_movies_from_ids

    id_list = range(starting_id, starting_id + num_records)
    starting_cnt = len(Movie.objects.filter(tmdb_id__in=id_list))
    ending_cnt = len(save_movies_from_ids(id_list))
    suceeded = ending_cnt - starting_cnt

    return {"starting_id": starting_id, "last_id": id_list[-1], "suceeded": suceeded}


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
    id_list = [x["id"] for x in genres]
    movie = Movie.objects.get(pk=movie_pk)
    movie.genres.set(Genre.objects.filter(tmdb_id__in=id_list))


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
def save_movie_from_id_task(tmdb_id: int):
    from .services import save_movie_from_id

    return save_movie_from_id(tmdb_id)
