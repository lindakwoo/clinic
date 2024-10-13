from .views import (
    patient_create,
    therapist_list,
    therapist_detail,
    twilio_status_callback,
    receive_message,
    patient_detail,
    send_message_to_patient,
    appointment_list,
    therapist_delete,
    therapist_create
)
from django.urls import path

urlpatterns = [
    path("patients/", patient_create,  name="patient_create"),
    path("patients/<int:pk>/", patient_detail,  name="patient_detail"),
    path("therapists/<str:organization_name>", therapist_list,  name="therapist_list"),
    path("therapists/<int:pk>/", therapist_detail,  name="therapist_detail"),
    path('therapists/create/', therapist_create, name='therapist_create'),
    path('therapists/<int:pk>/delete/', therapist_delete, name='therapist_delete'),
    path("appointments/<str:organization_name>/", appointment_list,  name="appointment_list"),
    path('twilio/status/', twilio_status_callback, name='twilio_status_callback'),
    path('twilio/send_message_to_patient/', send_message_to_patient, name='send_message_to_patient'),
]
