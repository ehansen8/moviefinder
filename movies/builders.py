from datetime import datetime
from celery import group
from movies.models import *
from main.secrets import *
import requests
from movies.tasks import *



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

    def __init__(self, search_query, max_results=5) -> None:

        results = self.tmdbSearchQuery(search_query)["results"]

        self.max_results = max_results
        if len(results) == 0:
            self.result_list = None
        else:
            self.result_list = results

    def saveMovies(self) -> list[Movie]:
        if not self.result_list:
            return None

        return_group = self.result_list[:self.max_results]
        return_group = group(saveMovie_task.s(r) for r in return_group)

        bg_group = self.result_list[self.max_results:]
        bg_group = group(saveMovie_task.s(r) for r in bg_group)

        result = return_group.delay()
        bg_group.delay()
        
        #Wait for results
        return Movie.objects.filter(pk__in=result.get())

    @staticmethod
    def saveMovie(movie_obj) -> Movie:

        tmdb_id = movie_obj["id"]
        try:
            movie = Movie.objects.get(tmdb_id=tmdb_id)
        except Movie.DoesNotExist:

            movie = MovieBuilder.getMovieDetails(tmdb_id)

        return movie.pk

    @staticmethod
    def getMovieDetails(tmdb_id: int) -> Movie:
        details = MovieBuilder.tmdbDetailQuery(tmdb_id)
        genres = details["genres"]
        crew = details["credits"]["crew"]
        actors = details["credits"]["cast"]
        prod_companies = details["production_companies"]

        providers = []
        res = details["watch/providers"]["results"]
        if res and "US" in res:
            providers = details["watch/providers"]["results"]["US"]

        movie = Movie(tmdb_id=tmdb_id)

        # TMDB details
        for obj_key, model_key in MovieBuilder.tmdb_field_mappings.items():
            value = details[obj_key]

            if model_key == "runtime":
                hours = int(value) // 60
                minutes = int(value) % 60
                value = f"{hours}:{minutes}"

            if model_key == "release_date":
                if value:
                    value = datetime.strptime(value, "%Y-%m-%d")
                else:
                    value = None

            if model_key in {"poster_url", "backdrop_url"} and value:
                value = MovieBuilder.BASE_URL + value

            setattr(movie, model_key, value)

        # OMDB details
        if movie.imdb_id:
            details = MovieBuilder.omdbDetailQuery(movie.imdb_id)
            for obj_key, model_key in MovieBuilder.omdb_field_mappings.items():
                try:
                    value = details[obj_key]
                except KeyError:
                    value = None

                if model_key == "imdb_rating":
                    try:
                        value = float(value)
                    except (ValueError, TypeError):
                        value = None

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
                    image_url=MovieBuilder.BASE_URL + member["profile_path"],
                )
                d.save()
            finally:
                movie.director = d
                break

        # All necessary movie details are stored and movie can be saved
        movie.save()

        # Now parse genres, cast, production companies and watch providers
        save_genres_to_movie.delay(movie.pk, genres)
        save_actors_to_movie.delay(movie.pk, actors)
        save_prod_companies_to_movie.delay(movie.pk, prod_companies)
        save_watch_providers_to_movie.delay(movie.pk, providers)

        return movie

    """ Gets omdb details:
        Country, IMDB Rating and Rotten Tomatoes Rating
    """

    @staticmethod
    def omdbDetailQuery(imdb_id: int) -> dict:
        # OMDB
        omdb_response = requests.get(
            MovieBuilder.OMDB_URL,
            params={
                "i": imdb_id,
            },
        )
        return omdb_response.json()

    @staticmethod
    def tmdbSearchQuery(search_query: str) -> dict:
        tmdb_response = requests.get(
            f"{MovieBuilder.TMDB_URL}/search/movie?",
            params={
                "api_key": tmdb_key,
                "query": search_query,
                "include_adult": False,
            },
        )
        return tmdb_response.json()

    @staticmethod
    def tmdbDetailQuery(movie_id: int) -> dict:
        tmdb_response = requests.get(
            f"{MovieBuilder.TMDB_URL}/movie/{movie_id}",
            params={
                "api_key": tmdb_key,
                "append_to_response": "credits,watch/providers",
            },
        )
        return tmdb_response.json()
