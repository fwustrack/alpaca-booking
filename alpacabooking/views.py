from rest_framework import viewsets

from alpacabooking.models import Event, EventType, TicketType, Booking
from alpacabooking.serializers import EventSerializer, EventTypeSerializer, TicketTypeSerializer, BookingSerializer
from rest_framework.permissions import BasePermission


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


class BookingPermission(BasePermission):
    def has_permission(self, request, view):
        # Allow all users to create bookings
        if request.method == 'POST':
            return True
        # Allow only authenticated users to view or edit bookings
        if request.method == 'GET':
            return request.user.has_perm('alpacabooking.view_booking')
        return request.user.is_authenticated and request.user.is_staff


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [BookingPermission]
