from django.db import models

# Create your models here.

class People(models.Model):
    name = models.CharField(max_length=120)
    id = models.IntegerField(primary_key=True)
    image_url = models.CharField(max_length=2083)

    def _str_(self):
        return self.id
