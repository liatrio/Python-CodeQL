# Generated by Django 4.0.4 on 2022-04-21 05:35

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('allDay', models.BooleanField()),
                ('start', models.CharField(max_length=128)),
                ('end', models.CharField(max_length=128)),
                ('title', models.CharField(max_length=128)),
                ('startTime', models.CharField(blank=True, max_length=128, null=True)),
                ('endTime', models.CharField(blank=True, max_length=128, null=True)),
                ('daysOfWeek', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=128), blank=True, null=True, size=None)),
                ('editable', models.BooleanField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
