from django import template
from movies.models import Movie

register = template.Library()


@register.simple_tag
def user_has_saved(user_id: int, movie: Movie) -> bool:
    return movie.savers.filter(pk=user_id).exists()


@register.simple_tag
def user_has_watched(user_id: int, movie: Movie) -> bool:
    return movie.watchers.filter(pk=user_id).exists()

@register.filter
def divide(value, arg):
    try:
        return int(value) / int(arg)
    except (ValueError, ZeroDivisionError):
        return None