from main.secrets import *
from movies.models import Movie
from .api import TMDB
from .services import save_movies_from_ids
from django.db.models import *
from celery import group
from .tasks import *


def search_movies(search_query: str, num_results=5, as_task=False) -> QuerySet[Movie]:
    if not search_query:
        return None

    query_ids = TMDB.search(search_query)

    result = None

    if as_task:
        g = group(
            save_movie_from_id_task.s(tmdb_id) for tmdb_id in query_ids[:num_results]
        )
        g = g.delay()
        result = Movie.objects.filter(pk__in=g.get())
        g = group(
            save_movie_from_id_task.s(tmdb_id) for tmdb_id in query_ids[num_results:]
        )
        g.delay()
    else:
        result = save_movies_from_ids(query_ids)

    return result
