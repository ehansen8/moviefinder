from django import forms
from movies.models import *
from datetime import datetime

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Div, Submit, HTML, Button, Row, Field
from crispy_forms.bootstrap import AppendedText, PrependedText, FormActions, Modal
from crispy_forms.layout import Fieldset


class CustomCheckbox(Field):
    template = "movies/custom-checkbox.html"


class SearchForm(forms.Form):
    search = forms.CharField(label="Search", max_length=100)


class WatchTogetherFilterForm(forms.Form):
    def __init__(self, *args, queryset=Genre.objects.all(), **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["genres"].queryset = queryset
    

    genres = forms.ModelMultipleChoiceField(
        label="Genres", queryset=None, required=False
    )

    rating_cutoff = forms.FloatField(label="Minimum Rating", required=False)

    streaming = forms.BooleanField(label="Currently Streaming", required=False)

    min_year = forms.IntegerField(label="Minimum Year", required=False)

    max_year = forms.IntegerField(
        label="Max Year", required=False
    )

    max_runtime = forms.IntegerField(label="Max Runtime", required=False)

    unwatched_only = forms.BooleanField(
        label="Unwatched Movies Only",
        help_text="- If selected, only movies nobody has seen will be displayed.",
        required=False,
    )

    helper = FormHelper()
    helper.layout = Layout(
        "genres",
        Div(
            Div("rating_cutoff", css_class="col-md-6"),
            Div("max_runtime", css_class="col-md-6"),
            css_class="row",
        ),
        Div(
            Div("min_year", css_class="col-md-6"),
            Div("max_year", css_class="col-md-6"),
            css_class="row",
        ),
        "streaming",
        CustomCheckbox("unwatched_only"),
    )
