from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

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
