from django.urls import include, path
from rest_framework import routers

from alpacabooking.views import (
    AnimalViewSet,
    BookingViewSet,
    EventTypeViewSet,
    EventViewSet,
    TicketTypeViewSet,
    UserRolesPermissionsView,
)

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r"events", EventViewSet)
router.register(r"eventTypes", EventTypeViewSet)
router.register(r"ticketTypes", TicketTypeViewSet)
router.register(r"bookings", BookingViewSet)
router.register(r"animals", AnimalViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("me/", UserRolesPermissionsView.as_view()),
]
