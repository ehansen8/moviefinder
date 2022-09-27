# Generated by Django 4.1.1 on 2022-09-26 22:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("movies", "0016_alter_watchedmovie_rating"),
    ]

    operations = [
        migrations.AlterField(
            model_name="movie",
            name="country",
            field=models.CharField(
                blank=True, default="United States", max_length=255, null=True
            ),
        ),
        migrations.AlterField(
            model_name="movie",
            name="imdb_id",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="movie",
            name="language",
            field=models.CharField(
                blank=True, default="English", max_length=255, null=True
            ),
        ),
        migrations.AlterField(
            model_name="movie",
            name="plot",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="movie",
            name="release_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]
