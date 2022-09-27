from datetime import datetime, time
import json
from multiprocessing import context
from main.secrets import omdb_key, tmdb_key
from django.shortcuts import render
from django.db.models import Count, Q
from django.urls import reverse
from django.http.request import HttpRequest
from django.http.response import HttpResponse, HttpResponseRedirect
from main.models import User
from .models import Movie, Genre
from movies.builders import MovieBuilder
from movies.forms import WatchTogetherFilterForm


def filter_watch_together(
    form: WatchTogetherFilterForm,
) -> Q:
    q = Q()
    if genres := form.cleaned_data["genres"]:
        q &= Q(genres__pk__in=genres)

    if min_rating := form.cleaned_data["rating_cutoff"]:
        q &= Q(rating__gte=min_rating)

    # TODO Implement streaming later

    if min_year := form.cleaned_data["min_year"]:
        q &= Q(release_date__year__gte=min_year)

    if max_year := form.cleaned_data["max_year"]:
        q &= Q(release_date__year__lte=max_year)

    if max_runtime := form.cleaned_data["max_runtime"]:
        q &= Q(runtime__lte=convert_minutes(max_runtime))

    # TODO implement watch exclusive

    return q


def convert_minutes(minutes: int) -> datetime:
    time = datetime(1, 1, 1, minutes // 60, minutes % 60)

    return time
