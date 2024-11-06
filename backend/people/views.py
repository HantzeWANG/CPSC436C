from django.shortcuts import render
from rest_framework import viewsets
from .serializers import PeopleSerializer
from .models import People

class PeopleView(viewsets.ModelViewSet):
    serializer_class = PeopleSerializer
    queryset = People.objects.all()
