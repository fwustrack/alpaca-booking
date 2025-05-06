from django.shortcuts import render
from rest_framework import viewsets

from alpacabooking.models import Event, EventType, TicketType, Booking
from alpacabooking.serializers import EventSerializer, EventTypeSerializer, TicketTypeSerializer, BookingSerializer


# Create your views here.
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class EventTypeViewSet(viewsets.ModelViewSet):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer


class TicketTypeViewSet(viewsets.ModelViewSet):
    queryset = TicketType.objects.all()
    serializer_class = TicketTypeSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = []
