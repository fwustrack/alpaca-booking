#!/bin/bash

 uv run --env-file=env/dev.env --env-file=env/dev-local-db.env --env-file=env/secrets.dev.env python manage.py "$@"
