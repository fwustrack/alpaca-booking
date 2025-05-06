from rest_framework import serializers

from alpacabooking.models import Event, EventType, TicketType, Ticket, Booking
from alpacabooking.booking_service import BookingService


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
        fields = ['name', 'description', 'price', 'resource_amount', 'event_type', 'id']


class TicketSerializer(serializers.ModelSerializer):
    ticket_type = serializers.PrimaryKeyRelatedField(queryset=TicketType.objects.all())

    class Meta:
        model = Ticket
        fields = ['ticket_type', 'amount']


class BookingSerializer(serializers.ModelSerializer):
    tickets = TicketSerializer(many=True)

    class Meta:
        model = Booking
        fields = ['event', 'tickets', 'title', 'lastname', 'firstname', 'email', 'phone_number', 'street', 'city',
                  'plz', 'comment', 'voucher', 'total_price']
        read_only_fields = ['total_price']

    def create(self, validated_data):
        tickets_data = validated_data.pop('tickets')
        event = validated_data['event']
        BookingService.validate_booking(event, tickets_data)
        booking = Booking.objects.create(**validated_data)
        for ticket_data in tickets_data:
            ticket = Ticket.objects.create(**ticket_data)
            booking.tickets.add(ticket)
        BookingService.calculate_total_price(booking)
        return booking
