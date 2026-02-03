from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


class ResourceTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


class ResourceType(models.Model):
    objects = ResourceTypeManager()
    name = models.CharField(max_length=32)

    def natural_key(self):
        return (self.name,)

    def __str__(self):
        return self.name


class EventTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


class EventType(models.Model):
    objects = EventTypeManager()
    name = models.CharField(max_length=32, unique=True)
    description = models.TextField(blank=True)

    def natural_key(self):
        return (self.name,)

    def __str__(self):
        return self.name


class TicketTypeManager(models.Manager):
    def get_by_natural_key(self, name, event_type):
        return self.get(name=name, event_type=event_type)


class TicketType(models.Model):
    objects = TicketTypeManager()
    name = models.CharField(max_length=32)
    description = models.TextField()
    price = models.FloatField()
    event_type = models.ForeignKey(
        "EventType", on_delete=models.PROTECT, related_name="ticket_types"
    )

    def natural_key(self):
        return (self.name, self.event_type)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "event_type"], name="unique_name_event_type"
            )
        ]


class ResourceCapacityManager(models.Manager):
    def get_by_natural_key(self, event_type, resource_type):
        return self.get(event_type=event_type, resource_type=resource_type)


class ResourceCapacity(models.Model):
    objects = ResourceCapacityManager()
    event_type = models.ForeignKey(
        "EventType", on_delete=models.PROTECT, related_name="capacities"
    )
    resource_type = models.ForeignKey("ResourceType", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=0)

    def natural_key(self):
        return (self.event_type, self.resource_type)

    def __str__(self):
        return f"{self.event_type} {self.resource_type} ({str(self.quantity)})"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["resource_type", "event_type"],
                name="unique_resource_type_event_type",
            )
        ]


class ResourceConsumptionManager(models.Manager):
    def get_by_natural_key(self, ticket_type, resource_type):
        return self.get(ticket_type=ticket_type, resource_type=resource_type)


class ResourceConsumption(models.Model):
    objects = models.Manager()
    ticket_type = models.ForeignKey(
        "TicketType", on_delete=models.PROTECT, related_name="consumptions"
    )
    resource_type = models.ForeignKey("ResourceType", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=0)

    def natural_key(self):
        return (self.ticket_type, self.resource_type)

    def __str__(self):
        return f"{self.ticket_type} {self.resource_type} ({str(self.quantity)})"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["resource_type", "ticket_type"],
                name="unique_resource_type_ticket_type",
            )
        ]


class Event(models.Model):
    objects = models.Manager()
    start_time = models.DateTimeField()
    event_type = models.ForeignKey(
        "EventType", on_delete=models.PROTECT, related_name="events"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["start_time", "event_type"], name="unique_start_time_event_type"
            )
        ]

    def __str__(self):
        return self.event_type.name + " " + str(timezone.localtime(self.start_time))


class Ticket(models.Model):
    objects = models.Manager()
    ticket_type = models.ForeignKey("TicketType", on_delete=models.PROTECT)
    booking = models.ForeignKey(
        "Booking", on_delete=models.CASCADE, related_name="tickets"
    )
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return self.ticket_type.name + " " + str(self.quantity)


class Booking(models.Model):
    objects = models.Manager()
    event = models.ForeignKey(
        "Event", on_delete=models.PROTECT, related_name="bookings"
    )
    title = models.CharField(max_length=32)
    lastname = models.CharField(max_length=32)
    firstname = models.CharField(max_length=32)
    email = models.EmailField()
    phone_number = models.CharField(max_length=32)
    street = models.CharField(max_length=32)
    city = models.CharField(max_length=32)
    plz = models.CharField(max_length=5)
    comment = models.TextField(blank=True)
    voucher = models.CharField(max_length=32, blank=True)

    def __str__(self):
        return f"{self._meta.object_name}(event={self.event}, lastname={self.lastname}, firstname={self.firstname})"


class Animal(models.Model):
    objects = models.Manager()
    name = models.CharField(max_length=32, unique=True)
    description = models.TextField(blank=True)
    teaser = models.TextField(blank=True)
    sponsorshipAvailable = models.BooleanField(default=False)
    hasCurrentSponsorship = models.BooleanField(default=False)
    sponsorName = models.CharField(max_length=128, blank=True)
    sponsorCustomText = models.TextField(blank=True)

    def natural_key(self):
        return self.name

    def __str__(self):
        return self.name
