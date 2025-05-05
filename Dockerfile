FROM python:3.13-slim-bookworm AS dev-base

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# netcat is used to wait for postgresl to become available on startup
# postgresql-client is required so that manage.py dbshell works
RUN apt-get update && apt-get dist-upgrade --yes && apt-get install netcat-openbsd postgresql-client --yes
RUN pip install --upgrade pip
RUN pip install uv --break-system-packages
RUN cd ..
COPY pyproject.toml uv.lock ./
RUN uv sync

## copy project
COPY . .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
