# Generated by Django 4.1.1 on 2022-09-19 23:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("movies", "0013_alter_movie_imdb_rating_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="movie",
            name="rating",
            field=models.FloatField(blank=True, null=True),
        ),
    ]
