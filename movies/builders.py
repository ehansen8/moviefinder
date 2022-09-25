from datetime import datetime
from webbrowser import get
from movies.models import *
from main.secrets import *
import requests


class MovieBuilder:

    BASE_URL = "https://www.themoviedb.org/t/p/original"
    TMDB_URL = f"https://api.themoviedb.org/3"
    OMDB_URL = f"http://www.omdbapi.com/?apikey={omdb_key}"
    tmdb_field_mappings = {
        "title": "title",
        "poster_path": "poster_url",
        "backdrop_path": "backdrop_url",
        "release_date": "release_date",
        "overview": "plot",
        "original_language": "language",
        "imdb_id": "imdb_id",
        "runtime": "runtime",
    }

    omdb_field_mappings = {
        "Country": "country",
        "imdbRating": "imdb_rating",
        "Ratings": "rotten_tomatoes_rating",
    }

    """Result length is the # of reuslts to return that are not already in the local DB
    """

    def __init__(self, search_query, max_results=5, new_results=2) -> None:

        results = self.tmdbSearchQuery(search_query)["results"]
        self.new_results = new_results
        self.max_results = max_results

        self.newly_added = 0
        if len(results) == 0:
            self.result_list = None
        else:
            self.result_list = results

    def saveMovies(self) -> list[Movie]:
        if not self.result_list:
            return None

        movie_list = []

        # Only Return Max Results OR new_results
        # whichever is hit first
        # TODO - Spawn off a Task to handle saving all the results
        for i, r in enumerate(self.result_list):

            if i >= self.max_results:
                break

            movie_list.append(self.saveMovie(r))
            if self.newly_added >= self.new_results:
                break

        return movie_list

    def saveMovie(self, movie_obj) -> Movie:

        tmdb_id = movie_obj["id"]
        try:
            movie = Movie.objects.get(tmdb_id=tmdb_id)
        except Movie.DoesNotExist:

            self.newly_added += 1
            movie = self.getMovieDetails(tmdb_id)

        return movie

    def getMovieDetails(self, tmdb_id: int) -> Movie:
        details = self.tmdbDetailQuery(tmdb_id)
        genres = details["genres"]
        credits = details["credits"]

        providers = []
        res = details["watch/providers"]["results"]
        if res and "US" in res:
            providers = details["watch/providers"]["results"]["US"]

        movie = Movie(tmdb_id=tmdb_id)

        # TMDB details
        for obj_key, model_key in self.tmdb_field_mappings.items():
            value = details[obj_key]

            if model_key == "runtime":
                hours = int(value) // 60
                minutes = int(value) % 60
                value = f"{hours}:{minutes}"

            if model_key == "release_date":
                value = datetime.strptime(value, "%Y-%m-%d")

            if model_key in {"poster_url", "backdrop_url"} and value:
                value = self.BASE_URL + value

            setattr(movie, model_key, value)

        # OMDB details
        details = self.omdbDetailQuery(movie.imdb_id)
        for obj_key, model_key in self.omdb_field_mappings.items():
            value = details[obj_key]

            if model_key == "imdb_rating":
                value = float(value)

            found = False
            if model_key == "rotten_tomatoes_rating":
                for e in details[obj_key]:
                    if e["Source"] == "Rotten Tomatoes":
                        value = int(e["Value"].strip("%"))
                        found = True
                        break
                    continue

                # if not found
                if not found:
                    value = None

            setattr(movie, model_key, value)

        # Parse out director
        for member in credits["crew"]:
            if member["job"] != "Director":
                continue
            try:
                d = Director.objects.get(tmdb_id=member["id"])
            except Director.DoesNotExist:
                d = Director(
                    name=member["name"],
                    tmdb_id=member["id"],
                    image_url=self.BASE_URL + member["profile_path"],
                )
                d.save()
                movie.director = d
            else:
                movie.director = d
            finally:
                break

        # All necessary movie details are stored and movie can be saved
        movie.save()

        # Now parse genres, cast, and providers
        for genre in genres:
            try:
                g = Genre.objects.get(tmdb_id=genre["id"])
            except Genre.DoesNotExist:
                movie.genres.create(name=genre["name"], tmdb_id=genre["id"])
            else:
                movie.genres.add(g)

        for actor in credits["cast"][:10]:
            try:
                a = Actor.objects.get(tmdb_id=actor["id"])
            except Actor.DoesNotExist:
                a = Actor(
                    name=actor["name"],
                    tmdb_id=actor["id"],
                )
                if path := actor["profile_path"]:
                    a.image_url = self.BASE_URL + path
                a.save()
                movie.actors.add(a)
            else:
                movie.actors.add(a)

        if "flatrate" in providers:
            for provider in providers["flatrate"]:
                try:
                    p = WatchProvider.objects.get(tmdb_id=provider["provider_id"])
                except WatchProvider.DoesNotExist:
                    movie.watch_providers.create(
                        name=provider["provider_name"],
                        tmdb_id=provider["provider_id"],
                        logo_url=self.BASE_URL + provider["logo_path"],
                    )
                else:
                    movie.watch_providers.add(p)
        return movie

    """ Gets omdb details:
        Country, IMDB Rating and Rotten Tomatoes Rating
    """

    def omdbDetailQuery(self, imdb_id: int) -> dict:
        # OMDB
        omdb_response = requests.get(
            self.OMDB_URL,
            params={
                "i": imdb_id,
            },
        )
        return omdb_response.json()

    def tmdbSearchQuery(self, search_query: str) -> dict:
        tmdb_response = requests.get(
            f"{self.TMDB_URL}/search/movie?",
            params={
                "api_key": tmdb_key,
                "query": search_query,
                "include_adult": False,
            },
        )
        return tmdb_response.json()

    def tmdbDetailQuery(self, movie_id: int) -> dict:
        tmdb_response = requests.get(
            f"{self.TMDB_URL}/movie/{movie_id}",
            params={
                "api_key": tmdb_key,
                "append_to_response": "credits,watch/providers",
            },
        )
        return tmdb_response.json()
