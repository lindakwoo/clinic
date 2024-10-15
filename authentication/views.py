

from django.db import IntegrityError
from rest_framework import status
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import serializers
from .models import Profile
import logging
from common.json import ModelEncoder
logger = logging.getLogger('authentication')


class UserEncoder(ModelEncoder):
    model = User
    properties = ["id", "username"]


class HomeView(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, request):
        content = {
            "message": "Welcome to the JWT Authentication page using React Js and Django!"}
        return Response(content)


class SignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    organization_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'confirm_password', 'organization_name')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        print("Organization Name:", data.get('organization_name'))
        print("Confirm Password:", data.get('confirm_password'))
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        print('validated', validated_data)
        organization_name = validated_data.pop('organization_name')
        validated_data.pop('confirm_password')
        try:
            user = User(
                username=validated_data['username']
            )
            user.set_password(validated_data['password'])
            user.save()

            Profile.objects.create(user=user, organization_name=organization_name)

            return user

        except IntegrityError as e:
            # Handle integrity errors (e.g., unique constraint violation)
            raise serializers.ValidationError({"detail": str(e)})

        except Exception as e:
            # Handle other exceptions
            raise serializers.ValidationError({"detail": "An error occurred during signup: " + str(e)})


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user.username,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    logger.debug("Login view accessed.")
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    logger.debug(f"Current user: {user}")
    if user is not None:
        logger.debug(f"Current user: {user}")
        request.session.flush()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            "user": user.username
        }, status=status.HTTP_200_OK)
    return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        logger.info("LogoutView POST method called")
        refresh_token = request.data.get("refresh_token")
        logger.info(f"Received refresh_token: {refresh_token}")

        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            logger.info(f"Successfully blacklisted refresh_token: {refresh_token}")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error in LogoutView: {e}")
            return Response({"detail!": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_org_name(request):
    user = request.user
    try:
        profile = Profile.objects.get(user=user)
        return Response({
            'organization_name': profile.organization_name,
        })
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found.'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    try:
        return Response({
            'user_id': user.id
        })
    except Profile.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)
