from django.contrib import admin
from django.contrib.auth.models import User
from .models import *

class MovieAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)

# Register your models here.
admin.site.register(Movie, MovieAdmin)
admin.site.register(SavedMovie)
admin.site.register(WatchedMovie)
admin.site.register(Genre)
admin.site.register(Actor)
admin.site.register(Director)
admin.site.register(ProductionCompany)