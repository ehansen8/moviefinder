# Generated by Django 4.1.1 on 2022-09-14 02:55

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("movies", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="WatchedMovie",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "rating",
                    models.IntegerField(
                        blank=True,
                        validators=[
                            django.core.validators.MaxValueValidator(4),
                            django.core.validators.MinValueValidator(1),
                        ],
                    ),
                ),
            ],
        ),
        migrations.RemoveField(
            model_name="movie",
            name="raters",
        ),
        migrations.DeleteModel(
            name="MovieRating",
        ),
        migrations.AddField(
            model_name="watchedmovie",
            name="movie",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="ratings",
                to="movies.movie",
            ),
        ),
        migrations.AddField(
            model_name="watchedmovie",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="ratings",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="movie",
            name="watchers",
            field=models.ManyToManyField(
                blank=True,
                related_name="watched_movies",
                through="movies.WatchedMovie",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
