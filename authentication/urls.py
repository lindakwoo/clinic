from django.urls import path
from . import views
from .views import LogoutView


urlpatterns = [
    path('home/', views.HomeView.as_view(), name='home'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    # path('logout/', views.logout, name='logout'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('org_name/', views.get_user_org_name, name='get_user_org_name'),
]
