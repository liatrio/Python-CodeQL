"""MyDjangoCalendar URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from django.contrib import admin
from rest_framework import routers
from core import views as core_views
from accounts import views as accounts_views
from calendar_django import views as calendar_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', core_views.home),
    path('join/', accounts_views.join),
    path('login/', accounts_views.usrlogin),
    path('logout/', accounts_views.usrlogout),
    path('settings/', accounts_views.settings)
]

router = routers.DefaultRouter()
router.register('api/events', calendar_views.EventViewSet, basename = 'event')
urlpatterns += router.urls
