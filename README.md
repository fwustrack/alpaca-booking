# Alpaka Booking
Das Projekt ist ein Buchungsplatform die es ermöglicht Veranstaltungen zu buchen.

Es ist ein Backend-Service, der mit Django und PostgreSQL entwickelt wurde.

Das Frontend ist eine Angular Applikation

## Requirements
- Python 3.10
- Docker
- UV Packet Manager (https://github.com/astral-sh/uv)
- Node.js

## Lokales Setup
Um das Projekt zu starten, müssen Secrets in der Datei env/secrets.dev.env angelegt werden.
Eine Vorlage dafür befindet sich in env/secrets.sample.env.
Die Werte für DJANGO_SUPERUSER_PASSWORD und DEFAULT_USER_PASSWORD können beliebig gesetzt werden.

Ein SECRET_KEY kann z.B. unter https://djecrety.ir/ generiert werden.

Die Datei env/secrets.dev.env darf nicht ins Repository eingecheckt werden.

Das Projekt kann auf zwei Arten gestartet werden:

### 1. Komplett in Docker

Verwende die Run-Konfiguration **Alpaka DEV in Docker**.
Damit werden Backend (Django) und Datenbank als Docker-Container gestartet.

### 2. Lokal als Django-App

1. Starte zuerst die Datenbank mit der Run-Konfiguration **Alpaka DEV DB only** (nur der Datenbank-Container wird gestartet).
2. Starte danach die Django-App mit der Run-Konfiguration **Alpaka dev** (Django läuft lokal, greift aber auf die Datenbank im Container zu).

### Frontend

Das Frontend (Angular) kann mit der Run-Konfiguration **Frontend** gestartet werden.


### URLs

- Admin Interface: http://localhost:8000/admin
- API  URL: http://localhost:8000/api

## Code Formatting

This project uses automated code formatting to maintain consistent code style:

- **Frontend (fe/)**: Prettier for TypeScript, HTML, SCSS, and JSON files
- **Backend (Python)**: Ruff for formatting and linting

### Setup Git Hooks

To automatically format code before each commit, run the setup script:

```bash
./scripts/setup-git-hooks.sh
```

This installs a pre-commit hook that will:
- Format frontend files with Prettier
- Format and lint Python files with Ruff
- Prevent commits if there are unfixable linting issues

### Manual Formatting

To format all files manually:

```bash
./scripts/format-code.sh
```

### Individual Commands

Format frontend files only:
```bash
cd fe
npm run format
```

Format Python files only:
```bash
# If using Docker development environment
docker-compose exec app-dev uv run ruff format .
docker-compose exec app-dev uv run ruff check --fix .

# If using local uv installation
uv run ruff format .
uv run ruff check --fix .
```

### Skipping Git Hooks

If you need to commit without running the formatting checks:
```bash
git commit --no-verify
```

**Note**: Make sure to run `cd fe && npm install --legacy-peer-deps` to install Prettier dependencies before using the formatting tools.
