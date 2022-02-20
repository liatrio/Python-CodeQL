#!/bin/sh

python3 manage.py collectstatic --no-input
python3 manage.py makemigrations
python3 manage.py migrate
gunicorn MyDjangoCalendar.wsgi --bind 0.0.0.0:8000
