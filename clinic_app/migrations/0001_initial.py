# Generated by Django 5.1.1 on 2024-09-14 18:14

import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Patient",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("first_initial", models.CharField(max_length=1)),
                ("last_initial", models.CharField(max_length=1)),
                (
                    "phone_number",
                    phonenumber_field.modelfields.PhoneNumberField(
                        blank=True, max_length=128, null=True, region=None
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Session",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "patient_phone_number",
                    phonenumber_field.modelfields.PhoneNumberField(
                        blank=True, max_length=128, null=True, region=None
                    ),
                ),
                ("MessageSid", models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="Therapist",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("first_name", models.CharField(max_length=100)),
                ("last_name", models.CharField(max_length=100)),
                (
                    "phone_number",
                    phonenumber_field.modelfields.PhoneNumberField(
                        blank=True, max_length=128, null=True, region=None
                    ),
                ),
            ],
        ),
    ]
