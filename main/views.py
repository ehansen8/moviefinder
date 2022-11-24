
from django.shortcuts import redirect
from django.http.request import HttpRequest
from django.http.response import HttpResponse
from django.contrib.auth import login, authenticate
from .forms import SignUpForm
from django.shortcuts import render, redirect

def home(request: HttpRequest) -> HttpResponse:
    user = request.user
    if user.is_authenticated:
        return redirect("movies:dashboard")

    return redirect("login")

def signup(request: HttpRequest) -> HttpResponse:
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('home')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})