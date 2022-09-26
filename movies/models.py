from datetime import datetime
from pyexpat import model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import QuerySet, F
from django.db.models.functions import Coalesce

from main.models import User


# Create your models here.


class Director(models.Model):
    name = models.CharField(max_length=255)
    tmdb_id = models.IntegerField(blank=True)
    image_url = models.URLField(blank=True)
    user_saves = models.ManyToManyField(
        User, related_name="saved_directors", blank=True
    )

    @property
    def image(self):
        if self.image_url:
            return self.image_url

        return "https://via.placeholder.com/1000x1500"

    def __str__(self):
        return self.name


class Actor(models.Model):
    name = models.CharField(max_length=255)
    tmdb_id = models.IntegerField(blank=True)
    image_url = models.URLField(blank=True)

    @property
    def image(self):
        if self.image_url:
            return self.image_url

        return f"https://via.placeholder.com/240x360?text=No+Image"

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(max_length=255)
    tmdb_id = models.IntegerField(blank=True)

    def __str__(self):
        return self.name


class WatchProvider(models.Model):
    name = models.CharField(max_length=255)
    tmdb_id = models.IntegerField(blank=True)
    logo_url = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Movie(models.Model):
    # Non Related Data
    title = models.CharField(max_length=255)
    tmdb_id = models.IntegerField()
    imdb_id = models.CharField(max_length=255)
    release_date = models.DateField()
    runtime = models.TimeField(auto_now=False, auto_now_add=False)
    plot = models.TextField()
    language = models.CharField(max_length=255, default="English")
    country = models.CharField(max_length=255, default="United States")
    imdb_rating = models.FloatField(blank=True, null=True)
    rotten_tomatoes_rating = models.FloatField(blank=True, null=True)

    # First tomatoes else imdb
    rating = models.FloatField(blank=True, null=True)

    poster_url = models.URLField(blank=True, null=True)
    backdrop_url = models.URLField(blank=True, null=True)

    # Related Data
    director = models.ForeignKey(
        Director, on_delete=models.CASCADE, related_name="movies", blank=True, null=True
    )

    actors = models.ManyToManyField(Actor, related_name="movies", blank=True)
    genres = models.ManyToManyField(Genre, related_name="movies", blank=True)
    watch_providers = models.ManyToManyField(
        WatchProvider, related_name="movies", blank=True
    )

    # User Related Data
    savers = models.ManyToManyField(
        User, through="SavedMovie", related_name="saved_movies", blank=True
    )
    watchers = models.ManyToManyField(
        User, through="WatchedMovie", related_name="watched_movies", blank=True
    )

    def save(self, *args, **kwargs):
        self.rating = (
            self.rotten_tomatoes_rating
            if self.rotten_tomatoes_rating
            else self.imdb_rating * 10
        )
        super(Movie, self).save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def year(self):
        return self.release_date.year

    @property
    def backdrop(self):
        if self.backdrop_url:
            return self.backdrop_url

        return "https://www.urbansplash.co.uk/images/placeholder-16-9.jpg"


class SavedMovie(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="saves")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saves")
    date_saved = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name()}: {self.movie.title}"


class WatchedMovie(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="ratings")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")

    class Rating(models.IntegerChoices):
        Awful = 1
        Meh = 2
        Good = 3
        Amazing = 4

    rating = models.IntegerField(choices=Rating.choices, blank=True
    )

    def __str__(self):
        return f"{self.user.get_full_name()}: {self.movie.title} - {self.rating} stars"
