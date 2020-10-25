from django.db import models
import uuid

from taggit.managers import TaggableManager
from django.contrib.postgres.fields import ArrayField


# Create your models here.
class Campaigns(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    campaign_name = models.CharField(max_length=100)
    campaign_description = models.TextField(default='No Description')


class UsersDirectory(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    user_email = models.CharField(max_length=250)
    tag = ArrayField(models.CharField(max_length=200), blank=True)
    is_subscribed = models.BooleanField(default=False)


class CampaignSendRequest(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    campaign = models.ForeignKey(Campaigns, on_delete=models.CASCADE)
    request_name = models.CharField(max_length=100)
    template = models.TextField()
    subject = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    email_user = models.CharField(max_length=200)
    tag = ArrayField(models.CharField(max_length=200), blank=True)
    mails_send = models.BooleanField(default=False)


class CampaignUserResponse(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    campaign_request = models.ForeignKey(CampaignSendRequest, on_delete=models.CASCADE)
    user = models.ForeignKey(UsersDirectory, on_delete=models.CASCADE)
    userResponses = models.JSONField()
    counter = models.IntegerField(default=0)
    
