# Generated by Django 4.0.7 on 2022-10-04 00:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0021_watchedmovie_date_saved'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movie',
            name='rating',
        ),
    ]
