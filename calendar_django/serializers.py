from .models import Event
from rest_framework import serializers

class EventSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only = True,
        default = serializers.CurrentUserDefault()
    )

    class Meta:
        model = Event
        fields = '__all__'
