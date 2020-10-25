from rest_framework import serializers

from .models import Campaigns,UsersDirectory,CampaignSendRequest,CampaignUserResponse
from taggit_serializer.serializers import (TagListSerializerField,
                                           TaggitSerializer)
class CampaignsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaigns
        fields = '__all__'


class UsersDirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersDirectory
        fields = ['user_email','tag','is_subscribed']



class CampaignSendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignSendRequest
        fields = '__all__'