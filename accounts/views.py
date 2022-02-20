from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from .forms import RegisterForm, LoginForm, UserChangeForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

def join(request):
    if(request.method == "POST"):
        join_form = RegisterForm(request.POST)
        if(join_form.is_valid()):
            user = join_form.save()
            user.set_password(user.password)
            user.save()
            return redirect("/")
        else:
            page_data = { "join_form": join_form }
            return render(request, 'accounts/join.html', page_data)
    else:
        join_form = RegisterForm()
        page_data = { "join_form": join_form }
    return render(request, 'accounts/join.html', page_data)

def usrlogin(request):
    if(request.method == 'POST'):
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            email = login_form.cleaned_data["email"]
            password = login_form.cleaned_data["password"]
            user = authenticate(request, email=email, password=password)
            if user:
                if user.is_active:
                    login(request, user)
                    return redirect("/")
                else:
                    return HttpResponse("Your account is not active.")
            else:
                return render(request, 'accounts/login.html', {"login_form": LoginForm})
    else:
        return render(request, 'accounts/login.html', {"login_form": LoginForm})

@login_required(login_url='/login/')
def settings(request):
    if(request.method == "GET"):
        account = get_user_model().objects.get(id=request.user.id)
        form = UserChangeForm(instance=account)
        context = { "change_form": form }
        return render(request, 'accounts/settings.html', context)
    elif(request.method == "POST"):
        account = get_user_model().objects.get(id=request.user.id)
        form = UserChangeForm(request.POST, instance=account)
        if(form.is_valid()):
            form.save()
            return redirect('/settings/')
        else:
            return redirect('/settings/')


@login_required(login_url='/login/')
def usrlogout(request):
    logout(request)
    return redirect('/')
