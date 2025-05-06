import datetime
from datetime import date, datetime, time, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from alpacabooking.models import Event, EventType


class Command(BaseCommand):
    help = "Creates test data for manual testing"

    def handle(self, *args, **options):
        print("creating test data")
        ww = EventType.objects.get_by_natural_key("Weinwanderung")
        asw = EventType.objects.get_by_natural_key("Alpakerol Spritz Wanderung")
        mf = EventType.objects.get_by_natural_key("Meet & Feed")

        self.create_event(ww, in_days=3, hour=10)
        self.create_event(ww, in_days=3, hour=14)
        self.create_event(asw, in_days=5, hour=11)
        self.create_event(asw, in_days=10, hour=11)
        self.create_event(mf, in_days=5, hour=11)

    def create_event(self, event_type: EventType, in_days: int, hour: int) -> None:
        naive_start_time = datetime.combine(date.today() + timedelta(days=in_days), time(hour))
        start_time = timezone.make_aware(naive_start_time)
        if len(Event.objects.filter(event_type=event_type, start_time=start_time)) > 0:
            print("Event already exists")
        else:
            ev = Event()
            ev.event_type = event_type
            ev.start_time = start_time
            ev.save()
