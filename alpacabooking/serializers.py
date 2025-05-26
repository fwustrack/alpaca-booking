from rest_framework import serializers

from alpacabooking.models import Event, EventType, TicketType, Ticket, Booking, Animal
from alpacabooking.booking_service import BookingService
from rest_framework.fields import SerializerMethodField


class EventTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EventType
        fields = ['name', 'id']


class EventSerializer(serializers.HyperlinkedModelSerializer):
    event_type = EventTypeSerializer()

    class Meta:
        model = Event
        fields = ['start_time', 'event_type', 'id', ]


class TicketTypeSerializer(serializers.HyperlinkedModelSerializer):
    event_type = serializers.PrimaryKeyRelatedField(queryset=EventType.objects.all())

    class Meta:
        model = TicketType
        fields = ['name', 'description', 'price',  'event_type', 'id']


class TicketSerializer(serializers.ModelSerializer):
    ticket_type = serializers.PrimaryKeyRelatedField(queryset=TicketType.objects.all())

    class Meta:
        model = Ticket
        fields = ['ticket_type', 'quantity']


class BookingSerializer(serializers.ModelSerializer):
    tickets = TicketSerializer(many=True)
    total_price = SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['event', 'tickets', 'title', 'lastname', 'firstname', 'email', 'phone_number', 'street', 'city',
                  'plz', 'comment', 'voucher', 'total_price']

    def get_total_price(self, obj):
        return BookingService.calculate_total_price(obj)

    def create(self, validated_data):
        tickets_data = validated_data.pop('tickets')
        event = validated_data['event']
        BookingService.validate_booking(event, tickets_data)
        booking = Booking.objects.create(**validated_data)
        for ticket_data in tickets_data:
            ticket = Ticket.objects.create(**ticket_data)
            booking.tickets.add(ticket)

        return booking


class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ['id', 'name', 'description', 'teaser', 'sponsorshipAvailable', 'hasCurrentSponsorship', 'sponsorName', 'sponsorCustomText']

class UserRolesPermissionsSerializer(serializers.Serializer):
    username = serializers.CharField()
    groups = serializers.ListField(child=serializers.CharField())
    permissions = serializers.ListField(child=serializers.CharField())
