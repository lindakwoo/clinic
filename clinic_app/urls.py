from .views import (
    patient_create,
    therapist_list,
    therapist_detail,
    twilio_status_callback,
    receive_message,
    patient_detail,
    send_message_to_patient,
    appointment_list,
)
from django.urls import path

urlpatterns = [
    path("patients/", patient_create,  name="patient_create"),
    path("patients/<int:pk>/", patient_detail,  name="patient_detail"),
    path("therapists/", therapist_list,  name="therapist_list"),
    path("therapists/<int:pk>/", therapist_detail,  name="therapist_detail"),
    path("appointments/", appointment_list,  name="appointment_list"),
    path('twilio/status/', twilio_status_callback, name='twilio_status_callback'),
    path('twilio/receive/', receive_message, name='receive_message'),
    path('twilio/send_message_to_patient/', send_message_to_patient, name='send_message_to_patient'),
]
