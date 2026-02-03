import logging
import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Set the default password for a user"

    def add_arguments(self, parser):
        parser.add_argument("user")

    def handle(self, *args, **options):
        username = options["user"]
        logger.info("setting default password for " + username)
        user: User = User.objects.get_by_natural_key(username)
        pw = os.environ.get("DEFAULT_USER_PASSWORD")
        if not pw:
            raise Exception("missing password")
        user.set_password(pw)
        user.save()
