from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.utils import timezone
from django.contrib.auth.models import User


# Create your models here.


class Patient(models.Model):
    first_initial = models.CharField(max_length=1)
    last_initial = models.CharField(max_length=1)
    phone_number = PhoneNumberField()
    organization_name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.first_initial + self.last_initial


class Therapist(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = PhoneNumberField()
    organization_name = models.CharField(max_length=100, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='therapists', default=1)

    def __str__(self):
        return self.last_name


class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    therapist = models.ForeignKey(Therapist, on_delete=models.SET_NULL, null=True)
    therapist_name = models.CharField(max_length=200, blank=True, null=True) # Store therapist's name for display in case the therapist gets deleted
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    organization_name = models.CharField(max_length=100, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Store therapist's name when the appointment is created
        if not self.therapist_name and self.therapist:
            self.therapist_name = f"{self.therapist.first_name} {self.therapist.last_name}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Appointment for {self.patient} with {self.therapist} on {self.date} at {self.time}"

    @property
    def datetime(self):
        # Combine date and time into a single timezone-aware datetime object
        naive_datetime = timezone.datetime.combine(self.date, self.time)
        return timezone.make_aware(naive_datetime, timezone.get_current_timezone())

    def display_datetime(self):
        # Return a formatted string of the datetime for admin display
        return self.datetime.strftime("%Y-%m-%d %I:%M:%S %p") if self.date and self.time else "Not set"

    display_datetime.short_description = "Appointment Date & Time"  # This will set the column header in admin
