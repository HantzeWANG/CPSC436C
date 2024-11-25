from rest_framework import serializers
from .models import Attendance, Profile


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ('attendance_id', 'profile_id', 'photo_url', 'timestamp')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('profile_id', 'profile_name', 'profile_image', 'admin_id')
