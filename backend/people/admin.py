from django.contrib import admin
from .models import attendance, user

# Admin class for the Attendance model
@admin.register(attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('attendance_id', 'user_id', 'photo_url', 'timestamp')  # Correct fields from the attendance model

# Admin class for the User model
@admin.register(user)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'username', 'email', 'profileImage', 'admin_id')  # Correct fields from the user model
