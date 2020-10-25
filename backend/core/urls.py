from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/',views.Dashboard.as_view()),
    path('campaigns/dashboard/',views.CampaignsDashboard.as_view()),
    path('subcampaign/dashboard/',views.SubCampaignsDashboard.as_view()),
    path('send/sample/',views.SendSampleEmail.as_view()),
    path('create/subcampaign/',views.SubCampaignCreate.as_view()),
    path('list/subcampaign/',views.CreateCampaignSendResuest.as_view()),
    path('update/user/',views.UpdateUser.as_view()),
    path('list/users/',views.ListUsers.as_view()),
    path('users/add/',views.UsersAdd.as_view()),
    path('create/campaign/',views.CampaignCreate.as_view()),
]