from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied

from alpacabooking.models import Event, EventType, TicketType, Booking
from alpacabooking.serializers import EventSerializer, EventTypeSerializer, TicketTypeSerializer, BookingSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import DjangoModelPermissions


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
    permission_classes = [DjangoModelPermissions]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.has_perm('alpacabooking.view_booking'):
            return Booking.objects.all()
        raise PermissionDenied("Kein Zugriff.")
