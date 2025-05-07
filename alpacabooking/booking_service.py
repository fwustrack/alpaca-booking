# alpacabooking/services/booking_service.py
from django.db.models import Sum, F
from rest_framework.exceptions import ValidationError


class BookingService:
    @staticmethod
    def validate_booking(event, tickets_data):
        for ticket_data in tickets_data:
            ticket_type = ticket_data['ticket_type']
            if ticket_type.event_type != event.event_type:
                raise ValidationError(f"TicketType '{ticket_type.name}' gehört nicht zum EventType des Events.")

    @staticmethod
    def calculate_total_price(booking):
        total = booking.tickets.aggregate(
            total_price=Sum(F('ticket_type__price') * F('amount'))
        )['total_price'] or 0.0
        booking.total_price = total
        booking.save()
        return total
