# Generated by Django 4.1.1 on 2022-09-15 19:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("movies", "0011_actor_tmdb_id_director_image_url_director_tmdb_id_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="movie",
            name="imdb_rating",
            field=models.FloatField(blank=True),
        ),
        migrations.AlterField(
            model_name="movie",
            name="rotten_tomatoes_rating",
            field=models.FloatField(blank=True),
        ),
    ]
