from .models import Patient, Therapist, Appointment
from django.http import HttpResponse
from common.json import ModelEncoder
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from twilio.rest import Client
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.http import require_http_methods
import json
import logging
import requests
import os
from dotenv import load_dotenv
from django.views.decorators.csrf import csrf_exempt

load_dotenv()


def shorten_url(url):
    # Use a service like TinyURL (for simplicity, no authentication required)
    api_url = f"http://tinyurl.com/api-create.php?url={url}"
    response = requests.get(api_url)
    return response.text


logger = logging.getLogger(__name__)

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_MESSAGING_SERVICE_SID = os.getenv("TWILIO_MESSAGING_SERVICE_SID")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


class PatientEncoder(ModelEncoder):
    model = Patient
    properties = ["id", "first_initial", "last_initial", "phone_number"]
    encoders = {"phone_number": str}


class TherapistEncoder(ModelEncoder):
    model = Therapist
    properties = ["id", "first_name", "last_name", "phone_number", "organization_name"]
    encoders = {"phone_number": str}


def encode_time(time_obj):
    return time_obj.strftime('%H:%M:%S')


class AppointmentEncoder(ModelEncoder):
    model = Appointment
    properties = ["id", "patient", "therapist", "date", "time", "therapist_name"]
    encoders = {"patient": PatientEncoder(), "therapist": TherapistEncoder(), "time": encode_time}


@csrf_exempt
@require_http_methods(["POST"])
def patient_create(request):
    try:
        data = json.loads(request.body)
        patient_phone_number = str(data.get("phone_number", ""))
        therapist_id = data.get("therapist")
        organization_name = data.get("organization_name")

        patient = Patient.objects.create(
                first_initial=data["first_initial"],
                last_initial=data["last_initial"],
                organization_name=organization_name,
                phone_number=patient_phone_number if isinstance(patient_phone_number, str) else str(patient_phone_number),
            )

        therapist = Therapist.objects.get(id=therapist_id)
        try:
            therapist_phone_number = therapist.phone_number if isinstance(therapist.phone_number, str) else str(therapist.phone_number)

            message_url = f"https://uplift-clinic2.web.app/send_message/{patient.id}/"
            short_url = shorten_url(message_url)
            message_body = (
                f"Patient {patient.first_initial}.{patient.last_initial}. has arrived.\n"
                f"Click this link to send a message to the patient: {short_url}"
            )
            twilio_client.messages.create(
                body=message_body,
                from_=TWILIO_PHONE_NUMBER,
                to=therapist_phone_number
            )

            appointment = Appointment.objects.create(
                patient=patient,
                therapist=therapist,
                organization_name=organization_name,
            )
            print(appointment)
            return JsonResponse(appointment, encoder=AppointmentEncoder, safe=False)
        except Exception as e:
            logger.error(f"Error sending message: {str(e)}")
            raise
    except Exception as e:
        return JsonResponse({"message": f"Patient not created: {str(e)}"}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def send_message_to_patient(request):
    try:
        data = json.loads(request.body)
        patient_phone_number = data.get("phone_number")
        message_from_therapist = data.get("message")
        message = twilio_client.messages.create(
            body=message_from_therapist,
            to=patient_phone_number,
            from_=TWILIO_PHONE_NUMBER,)

        return JsonResponse({'status': 'Message sent', 'messageSid': message.sid})

    except Exception as e:
        logger.error(f"Error sending message: {str(e)}")
        raise


@require_http_methods(["POST"])
def twilio_status_callback(request):
    try:
        message_sid = request.POST.get('MessageSid')
        message_status = request.POST.get('MessageStatus')
        logger.info(f"Message {message_sid} status: {message_status}")
        return HttpResponse(status=200)
    except Exception as e:
        logger.error(f"Error processing status callback: {str(e)}")
        return HttpResponse(status=500)


@csrf_exempt
@require_http_methods(["GET"])
def therapist_list(request, organization_name):
    try:
        therapists = Therapist.objects.filter(organization_name=organization_name)
        return JsonResponse(
            {"therapists": therapists}, encoder=TherapistEncoder, safe=False
        )
    except Exception as e:
        return JsonResponse(
            {"message": f"Therapists not retreived: {str(e)}"}, status=400
        )


@require_http_methods(["GET"])
def therapist_detail(request, pk):
    try:
        therapist = Therapist.objects.get(id=pk)
        return JsonResponse(therapist, encoder=TherapistEncoder, safe=False)
    except Exception as e:
        return JsonResponse(
            {"message": f"Therapist not retreived: {str(e)}"}, status=400
        )


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def therapist_create(request):
    try:
        # Extract the token from the Authorization header
        logger.debug(f"Request META: {request.META}")
        auth_header = request.META.get('HTTP_AUTHORIZATION', None)
        if not auth_header:
            return JsonResponse({'error': 'Authorization header not provided.'}, status=403)

        # The token should be in the format "Bearer <token>"
        token = auth_header.split(' ')[1] if ' ' in auth_header else None
        if not token:
            return JsonResponse({'error': 'Token not provided.'}, status=403)
        auth_service_url = 'https://uplift-clinic-677edaaf8da8.herokuapp.com/org_name/'
        response = requests.get(auth_service_url, headers={'Authorization': f'Bearer {token}'})
        if response.status_code != 200:
            return Response({'error': 'Failed to retrieve profile.'}, status=status.HTTP_400_BAD_REQUEST)
        organization_name = response.json().get('organization_name')
        data = json.loads(request.body)
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        phone_number = data.get("phone_number")

        if not first_name or not last_name or not phone_number:
            return JsonResponse({"message": "Missing required fields"}, status=400)

        created_by = request.user

        therapist = Therapist.objects.create(
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            organization_name=organization_name,
            created_by=created_by
        )

        return JsonResponse(therapist, encoder=TherapistEncoder, safe=False)
    except json.JSONDecodeError:
        return JsonResponse({"message": "Invalid JSON"}, status=400)
    except Exception as e:
        logger.error(f"Error creating therapist: {str(e)}")
        return JsonResponse({"message": f"Error creating therapist: {str(e)}"}, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
def therapist_delete(request, pk):
    try:
        therapist = Therapist.objects.get(id=pk)
        therapist.delete()
        return JsonResponse({"message": "Therapist deleted successfully."}, status=204)
    except Therapist.DoesNotExist:
        return JsonResponse({"message": "Therapist not found."}, status=404)
    except Exception as e:
        logger.error(f"Error deleting therapist: {str(e)}")
        return JsonResponse({"message": f"Error deleting therapist: {str(e)}"}, status=400)


@require_http_methods(["GET"])
def patient_detail(request, pk):
    try:
        patient = Patient.objects.get(id=pk)
        return JsonResponse(patient, encoder=PatientEncoder, safe=False)
    except Exception as e:
        return JsonResponse(
            {"message": f"Patient not retreived: {str(e)}"}, status=400
        )


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def appointment_list(request, organization_name):
    try:
        appointments = Appointment.objects.filter(organization_name=organization_name).order_by("date", "-time")
        return JsonResponse(
            {"appointments": appointments}, encoder=AppointmentEncoder, safe=False
        )
    except Exception as e:
        return JsonResponse(
            {"message": f"Appointments not retreived: {str(e)}"}, status=400
        )
