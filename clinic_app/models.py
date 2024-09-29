from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.utils import timezone

# Create your models here.


class Patient(models.Model):
    first_initial = models.CharField(max_length=1)
    last_initial = models.CharField(max_length=1)
    phone_number = PhoneNumberField()

    def __str__(self):
        return self.first_initial + self.last_initial


class Therapist(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = PhoneNumberField()

    def __str__(self):
        return self.last_name


class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    therapist = models.ForeignKey(Therapist, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment for {self.patient} with {self.therapist} on {self.date} at {self.time}"

    @property
    def datetime(self):
        # Combine date and time into a single timezone-aware datetime object
        naive_datetime = timezone.datetime.combine(self.date, self.time)
        return timezone.make_aware(naive_datetime, timezone.get_current_timezone())

    def display_datetime(self):
        # Return a formatted string of the datetime for admin display
        return self.datetime.strftime("%Y-%m-%d %H:%M:%S") if self.date and self.time else "Not set"

    display_datetime.short_description = "Appointment Date & Time"  # This will set the column header in admin
