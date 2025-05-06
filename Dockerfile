FROM python:3.13-slim-bookworm AS dev-base

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# install uv, nc and psql
# netcat is used to wait for postgresl to become available on startup
# postgresql-client is required so that manage.py dbshell works
RUN apt-get update && \
    apt-get dist-upgrade --yes && \
    apt-get install netcat-openbsd postgresql-client --yes && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* && \
    pip install --upgrade pip && \
    pip install uv --break-system-packages

# copy project
COPY pyproject.toml uv.lock env entrypoint.sh manage.py ./

# install python dependencies and prepare entrypoint script
RUN uv sync && \
    chmod +x entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
