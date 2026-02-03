from django.contrib import admin

from .models import (
    Animal,
    Booking,
    Event,
    EventType,
    ResourceCapacity,
    ResourceConsumption,
    ResourceType,
    Ticket,
    TicketType,
)

# Register your models here.
admin.site.register(Event)
admin.site.register(EventType)
admin.site.register(Booking)
admin.site.register(TicketType)
admin.site.register(Ticket)
admin.site.register(ResourceType)
admin.site.register(ResourceCapacity)
admin.site.register(ResourceConsumption)
admin.site.register(Animal)
