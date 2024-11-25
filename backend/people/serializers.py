from rest_framework import serializers
from .models import attendance, user

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = attendance
        fields = ('attendance_id', 'user_id', 'photo_url', 'timestamp')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ('user_id', 'username', 'email', 'profileImage', 'admin_id')
                  