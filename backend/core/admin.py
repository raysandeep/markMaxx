from django.contrib import admin

# Register your models here.
from .models import Campaigns,UsersDirectory,CampaignSendRequest,CampaignUserResponse

admin.site.register(Campaigns)
admin.site.register(UsersDirectory)
admin.site.register(CampaignSendRequest)
admin.site.register(CampaignUserResponse)