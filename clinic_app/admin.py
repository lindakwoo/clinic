from django.contrib import admin

from .models import Patient, Therapist, Session, Appointment


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ["id", "first_initial", "last_initial", "phone_number"]


@admin.register(Therapist)
class TherapistAdmin(admin.ModelAdmin):
    list_display = ["id", "first_name", "last_name", "phone_number"]


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ["id", "patient_phone", "doctor_phone", "message_sid", "created_at"]


@admin.register(Appointment)
class Appointment(admin.ModelAdmin):
    list_display = ["id", "patient", "therapist", "date", "time"]
