from django.contrib import admin

from .models import Patient, Therapist, Appointment


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ["id", "first_initial", "last_initial", "phone_number", "organization_name"]


@admin.register(Therapist)
class TherapistAdmin(admin.ModelAdmin):
    list_display = ["id", "first_name", "last_name", "phone_number", "organization_name", "created_by"]


@admin.register(Appointment)
class Appointment(admin.ModelAdmin):
    list_display = ["id", "patient", "therapist", "display_datetime", "therapist_name", "organization_name"]
