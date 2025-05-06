#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

#uv run python manage.py flush --no-input
uv run python manage.py migrate
uv run python manage.py createsuperuser --noinput

# load initial data
uv run python manage.py loaddata base-data
uv run python manage.py initialize-test-data

# update sequences to avoid conflicting primary keys from the initial data
#uv run python manage.py sqlsequencereset travel | uv run python manage.py dbshell

# run tests and type checks on startup since we do not have CI/CD on this project
uv run python manage.py test || exit 1
#uv run mypy . || exit 1

exec "$@"
