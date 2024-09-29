from .models import Patient, Therapist, Appointment
from django.http import HttpResponse
from common.json import ModelEncoder
from django.http import JsonResponse
from twilio.rest import Client
from django.views.decorators.http import require_http_methods
import json
import logging
import requests
import os
from dotenv import load_dotenv

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
    properties = ["id", "first_name", "last_name", "phone_number"]
    encoders = {"phone_number": str}


def encode_time(time_obj):
    return time_obj.strftime('%H:%M:%S')


class AppointmentEncoder(ModelEncoder):
    model = Appointment
    properties = ["id", "patient", "therapist", "date", "time"]
    encoders = {"patient": PatientEncoder(), "therapist": TherapistEncoder(), "time": encode_time}


@require_http_methods(["POST"])
def patient_create(request):
    try:
        data = json.loads(request.body)
        patient_phone_number = str(data.get("phone_number", ""))
        therapist_id = data.get("therapist")

        patient = Patient.objects.create(
                first_initial=data["first_initial"],
                last_initial=data["last_initial"],
                phone_number=patient_phone_number,
            )

        therapist = Therapist.objects.get(id=therapist_id)
        try:
                therapist_phone_number = therapist.phone_number
                status_callback_url = "https://fruity-chicken-spend.loca.lt/api/twilio/status/"

                message_url = f"https://42ed-2601-645-e88-7990-ccae-5fac-5ad7-f651.ngrok-free.app/send-message/{patient.id}/"
                short_url = shorten_url(message_url)
                message_body = (
                    f"Patient {patient.first_initial}.{patient.last_initial}. has arrived.\n"
                    f"Click this link to send a message to the patient: {short_url}"
                )
                twilio_client.messages.create(
                    body=message_body,
                    from_=TWILIO_PHONE_NUMBER,
                    to="+15103301074", # (for testing purposes only) replace with therapist_phone_number
                    # to=therapist_phone_number
                    # to="+15108826397", (my peronsal phone number...does not work!)
                    # messaging_service_sid=TWILIO_MESSAGING_SERVICE_SID,
                    status_callback=status_callback_url
                )

                appointment = Appointment.objects.create(
                    patient=patient,
                    therapist=therapist
                )
                print(appointment)
                return JsonResponse(appointment, encoder=AppointmentEncoder, safe=False)
        except Exception as e:
            logger.error(f"Error sending message: {str(e)}")
            raise
    except Exception as e:
        return JsonResponse({"message": f"Patient not created: {str(e)}"}, status=400)


@require_http_methods(["POST"])
def send_message_to_patient(request):
    try:
        data = json.loads(request.body)
        patient_phone_number = data.get("phone_number")
        message_from_therapist = data.get("message")
        # status_callback_url = "https://fruity-chicken-spend.loca.lt/api/twilio/status/"
        message = twilio_client.messages.create(
            body=message_from_therapist,
            to=patient_phone_number,
            from_=TWILIO_PHONE_NUMBER,)
            # status_callback=status_callback_url)

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


@require_http_methods(["POST"])
def receive_message(request):
    try:
        # from_number = request.POST.get('From')
        # message_sid = request.POST.get('MessageSid')
        # message_body = request.POST.get('Body').strip()
        # # in_reply_to = request.POST.get('InReplyTo')

        # print('request', request.POST)

        # logger.info(f"Received message from {from_number} with SID {message_sid} and body: {message_body}")
        # patient_phone, choice = extract_patient_phone_and_choice(message_body)

        # # if in_reply_to:
        # #     session = Session.objects.filter(message_sid=in_reply_to).first()
        # #     if session:
        # patient_phone_number = session.patient_phone
        # print("patient", patient_phone_number)

        # response = twilio_client.messages.create(
        #             # body=message_body,
        #         body="I'm running 10 minutes late.",
        #             # from_=TWILIO_PHONE_NUMBER,
        #             # to=patient_phone_number,
        #         to="+18777804236",  # (for testing purposes only) replace with patient_phone_number
        #             messaging_service_sid=TWILIO_MESSAGING_SERVICE_SID
        # )

        return HttpResponse(status=200)
    except Exception as e:
        logger.error(f"Error processing received message: {str(e)}")
        return HttpResponse(status=500)


@require_http_methods(["GET"])
def therapist_list(request):
    try:
        therapists = Therapist.objects.all()
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


@require_http_methods(["GET"])
def patient_detail(request, pk):
    try:
        patient = Patient.objects.get(id=pk)
        return JsonResponse(patient, encoder=PatientEncoder, safe=False)
    except Exception as e:
        return JsonResponse(
            {"message": f"Patient not retreived: {str(e)}"}, status=400
        )
