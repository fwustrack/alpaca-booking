from django.contrib import admin

from .models import Event, EventType, Booking, TicketType, Ticket, ResourceConsumption, ResourceType, ResourceCapacity

# Register your models here.
admin.site.register(Event)
admin.site.register(EventType)
admin.site.register(Booking)
admin.site.register(TicketType)
admin.site.register(Ticket)
admin.site.register(ResourceType)
admin.site.register(ResourceCapacity)
admin.site.register(ResourceConsumption)
