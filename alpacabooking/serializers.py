from rest_framework import serializers

from alpacabooking.models import Event, EventType


class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ['start_time', 'event_type', 'id']


class EventTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EventType
        fields = ['name', 'id']
