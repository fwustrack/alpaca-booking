from django.db import models


# Create your models here.

class EventTypeManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)


class EventType(models.Model):
    name = models.CharField(max_length=32, unique=True)
    objects = EventTypeManager()

    def natural_key(self):
        return (self.name,)

    def __str__(self):
        return self.name


class Event(models.Model):
    start_time = models.DateTimeField()
    event_type = models.ForeignKey('EventType', on_delete=models.CASCADE)

    def __str__(self):
        return self.event_type.name + " " + str(self.start_time)


class TicketType(models.Model):
    name = models.CharField(max_length=32)
    description = models.TextField()
    price = models.FloatField()
    resource_amount = models.IntegerField()
    event_type = models.ForeignKey('EventType', on_delete=models.CASCADE)
    def __str__(self):
        return self.name


class Ticket(models.Model):
    ticket_type = models.ForeignKey('TicketType', on_delete=models.CASCADE)
    amount = models.IntegerField()

    def __str__(self):
        return self.ticket_type.name + " " + str(self.amount)


class Booking(models.Model):
    event = models.ForeignKey('Event', on_delete=models.CASCADE)
    tickets = models.ManyToManyField('Ticket')
    title = models.CharField(max_length=32)
    lastname = models.CharField(max_length=32)
    firstname = models.CharField(max_length=32)
    email = models.EmailField()
    phone_number = models.CharField(max_length=32)
    street = models.CharField(max_length=32)
    city = models.CharField(max_length=32)
    plz = models.CharField(max_length=5)
    comment = models.TextField(blank=True, null=True)
    voucher = models.CharField(max_length=32, blank=True, null=True)

    def __str__(self):
        return f"{self._meta.object_name}(event={self.event}, lastname={self.lastname}, firstname={self.firstname})"
