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
