from django.db import models

# Create your models here.

class attendance(models.Model):
    attendance_id = models.CharField(max_length=100)
    user_id = models.CharField(max_length=100)
    photo_url = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.id
    

class user(models.Model):
    user_id = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    profileImage = models.CharField(max_length=100)
    admin_id = models.CharField(max_length=100)

    def _str_(self):
        return self.id
