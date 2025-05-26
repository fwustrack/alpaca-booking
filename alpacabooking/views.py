from rest_framework import viewsets

from alpacabooking.models import Event, EventType, TicketType, Booking, Animal
from alpacabooking.serializers import EventSerializer, EventTypeSerializer, TicketTypeSerializer, BookingSerializer, \
    AnimalSerializer
from rest_framework.permissions import BasePermission

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRolesPermissionsSerializer
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

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class UserRolesPermissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "username": user.username,
            "groups": list(user.groups.values_list("name", flat=True)),
            "permissions": list(user.get_all_permissions()),
        }
        serializer = UserRolesPermissionsSerializer(data)
        return Response(serializer.data)
