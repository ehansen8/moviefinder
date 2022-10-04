import requests
from main.secrets import *


class TMDB:
    URL = f"https://api.themoviedb.org/3"

    @staticmethod
    def search(search_query: str) -> dict:
        response = requests.get(
            f"{TMDB.URL}/search/movie?",
            params={
                "api_key": tmdb_key,
                "query": search_query,
                "include_adult": False,
            },
        )
        return response.json()

    @staticmethod
    def detail(movie_id: int) -> dict:
        response = requests.get(
            f"{TMDB.URL}/movie/{movie_id}",
            params={
                "api_key": tmdb_key,
                "append_to_response": "credits,watch/providers",
            },
        )
        if response.status_code == 404:
            raise requests.exceptions.RequestException
        return response.json()

    @staticmethod
    def popular() -> list[int]:
        response = requests.get(
            f"{TMDB.URL}/movie/popular",
            params={"api_key": tmdb_key, "region": "US"},
        )
        results = response.json()
        return [x["id"] for x in results["results"]]

    @staticmethod
    def trending() -> list[int]:
        response = requests.get(
            f"{TMDB.URL}/trending/movie/week",
            params={"api_key": tmdb_key, "region": "US"},
        )
        results = response.json()
        return [x["id"] for x in results["results"]]

    @staticmethod
    def upcoming() -> list[int]:
        response = requests.get(
            f"{TMDB.URL}/movie/upcoming",
            params={"api_key": tmdb_key, "region": "US"},
        )
        results = response.json()
        return [x["id"] for x in results["results"]]

    @staticmethod
    def now_playing() -> list[int]:
        response = requests.get(
            f"{TMDB.URL}/movie/now_playing",
            params={"api_key": tmdb_key, "region": "US"},
        )
        results = response.json()
        return [x["id"] for x in results["results"]]


class OMDB:
    URL = f"http://www.omdbapi.com/?apikey={omdb_key}"

    """ Gets omdb details:
        Country, IMDB Rating and Rotten Tomatoes Rating
    """

    @staticmethod
    def detail(imdb_id: int) -> dict:
        # OMDB
        response = requests.get(
            OMDB.URL,
            params={
                "i": imdb_id,
            },
        )
        if response.status_code in [404, 401]:
            raise requests.exceptions.RequestException(response)
        return response.json()
