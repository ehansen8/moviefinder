from django.core.management.base import BaseCommand
from movies.models import *
from datetime import datetime


class Command(BaseCommand):
    def handle(self, **options):
        movies = Movie.objects.all()
        for movie in movies:
            movie.save()
