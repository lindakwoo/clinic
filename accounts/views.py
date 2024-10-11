from django.shortcuts import render, redirect
from accounts.forms import LoginForm, SignUpForm
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from players_lists.models import PlayersList


def user_login(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                players_lists = PlayersList.objects.filter(owner=request.user)
                if players_lists:
                    return redirect("players_lists")
                return redirect("home_page")
            else:
                form.add_error(None, "Invalid username or password")
    else:
        form = LoginForm()
    context = {"form": form}
    return render(request, "accounts/login.html", context)


def user_logout(request):
    logout(request)
    return redirect("home_page")


def signup(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            password_conformation = form.cleaned_data["password_confirmation"]

            if password == password_conformation:
                user = User.objects.create_user(
                    username=username, password=password
                )
                login(request, user)
                return redirect("home_page")
            else:
                form.add_error("password", "the passwords do not match")

    else:
        form = SignUpForm()
    context = {"form": form}
    return render(request, "accounts/signup.html", context)
