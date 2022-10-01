from main.secrets import *
from .api import TMDB
from .services import save_movies_from_ids


def get_upcoming_movies():
    # Get trending Query
    ids = TMDB.upcoming()

    # Check / Write to DB & return
    movies = save_movies_from_ids(ids)
    movies.update(is_upcoming=True)
    return movies

def get_now_playing_movies():
    # Get trending Query
    ids = TMDB.now_playing()

    # Check / Write to DB & return
    movies = save_movies_from_ids(ids)
    movies.update(is_now_playing=True)
    return movies

def get_trending_movies():
    # Get trending Query
    ids = TMDB.trending()

    # Check / Write to DB & return
    movies = save_movies_from_ids(ids)
    movies.update(is_trending=True)
    return movies 



