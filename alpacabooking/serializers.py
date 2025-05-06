from rest_framework import serializers

from alpacabooking.models import Event, EventType, TicketType


class EventTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EventType
        fields = ['name', 'id']


class EventSerializer(serializers.HyperlinkedModelSerializer):
    event_type = EventTypeSerializer()

    class Meta:
        model = Event
        fields = ['start_time', 'event_type', 'id',]


class TicketTypeSerializer(serializers.HyperlinkedModelSerializer):
    event_type = serializers.PrimaryKeyRelatedField(queryset=EventType.objects.all())

    class Meta:
        model = TicketType
        fields = ['name', 'description', 'price', 'resource_amount', 'event_type', 'id']
