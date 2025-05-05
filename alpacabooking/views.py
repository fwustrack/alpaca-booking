from django.shortcuts import render
from rest_framework import viewsets

from alpacabooking.models import Event, EventType
from alpacabooking.serializers import EventSerializer, EventTypeSerializer


# Create your views here.
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class EventTypeViewSet(viewsets.ModelViewSet):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer