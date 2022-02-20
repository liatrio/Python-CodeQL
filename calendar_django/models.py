from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField

class Event(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete = models.CASCADE, related_name = 'events')
    allDay = models.BooleanField()
    start = models.CharField(max_length = 128)
    end = models.CharField(max_length = 128)
    title = models.CharField(max_length = 128)
    startTime = models.CharField(max_length = 128, blank=True, null=True)
    endTime = models.CharField(max_length = 128, blank=True, null=True)
    daysOfWeek = ArrayField(models.CharField(max_length = 128), blank=True, null=True)
    editable = models.BooleanField()
