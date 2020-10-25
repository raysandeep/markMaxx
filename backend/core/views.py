from typing import Counter
from uuid import UUID
from rest_framework import generics,pagination,parsers
from rest_framework import request
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Campaigns,UsersDirectory,CampaignSendRequest,CampaignUserResponse
from .serializers import(
    CampaignsSerializer,
    UsersDirectorySerializer,
    CampaignSendRequestSerializer,
)
from celery.task import task
from django.utils.timezone import now
from rest_framework.pagination import PageNumberPagination


LOGO_URL = ''

def sendSampleMail(dicti):
    print(dicti)
    return True


class MainPagination(pagination.PageNumberPagination):       
    page_size = 10


@task(name="sendemails", serializer='json')
def sendEmails(id):
    campaign = CampaignSendRequest.objects.filter(id=id)[0]
    users = UsersDirectory.objects.filter(is_subscribed=True).filter(tag__contains=campaign.tag)
    template = campaign.template
    subject = campaign.subject
    email = campaign.email
    email_user = campaign.email_user
    listi = []
    for i in users:
        sendSampleMail({
                "template":template.replace("DSCVITLOGOURL",LOGO_URL+"/"+id+"/"+i.id+"/"),
                "subject": subject,
                "email":email,
                "user":email_user,
                "users":i.user_email,
            })
        listi.append(CampaignUserResponse(**{
            'campaign_request':campaign,
            'user':i,
            'userResponses':{'responses':{
                'message':'Email Sent',
                'time':str(now())
            }},
            'counter':1
        }))
        

    CampaignUserResponse.objects.bulk_create(listi)
    campaign.mails_send = True
    campaign.save()
    return True


class CampaignCreate(generics.ListCreateAPIView):
    queryset = Campaigns.objects.all()
    serializer_class = CampaignsSerializer
    parser_classes = [parsers.JSONParser]


class UsersAdd(APIView):
    def post(self,request):
        data = request.data
        users = UsersDirectory.objects.all()
        exists_list = []
        counter = 0
        print(data['tags'])
        for i in data['emails']: 
            if users.filter(user_email=i).exists():
                exists_list.append(i)
            else:
                serializer = UsersDirectorySerializer(data={"user_email":i,"tag":data['tags']})
                if serializer.is_valid():
                    counter+=1
                    serializer.save()
                else:
                    exists_list.append(i)
        return Response({
            "fails":exists_list,
            "fails_count":len(exists_list),
            "success":counter
        },status=200)


class ListUsers(generics.ListAPIView):
    queryset = UsersDirectory.objects.all()
    serializer_class = UsersDirectorySerializer
    parser_classes = [parsers.JSONParser]
    pagination_class = MainPagination


class UpdateUser(generics.RetrieveUpdateDestroyAPIView):
    queryset = UsersDirectory.objects.all()
    serializer_class = UsersDirectorySerializer
    parser_classes = [parsers.JSONParser]



class CreateCampaignSendResuest(APIView):
    def post(self,request):
        campaigns = CampaignSendRequest.objects.filter(campaign=request.data.get('id'))
        serializer = CampaignSendRequestSerializer(campaigns, many=True)
        return Response(serializer.data)


class SendSampleEmail(APIView):
    def post(self,request):
        try:
            dicti = {
                "template":request.data['template'],
                "subject": request.data['subject'],
                "email":request.data['email'],
                "user":request.data['user'],
                "users":request.data['users'],
            }
        except:
            return Response(status=400)
        sendSampleMail(dicti)
        return Response({},status=200)



class Dashboard(APIView):
    def get(self,request):
        campaigns = Campaigns.objects.all().count()
        users = UsersDirectory.objects.all()
        unsubscribed = users.filter(is_subscribed=False).count()
        subscribed = users.count() - unsubscribed
        return Response({
            "unsubcribed":unsubscribed,
            "subscribed":subscribed,
            "campaigns":campaigns
        },status=200)


class CampaignsDashboard(APIView):
    def post(self,request):
        id = request.data.get("id")
        try:
            val = UUID(id, version=4)
        except ValueError:
            return Response(status=404)
        campaigns = CampaignUserResponse.objects.filter(campaign_request__campaign__id=id)
        delivered = campaigns.filter(counter=1).count()
        opened_once = campaigns.filter(counter=2).count()
        opened_more_than_once = campaigns.filter(counter__gte=3).count()
        return Response({
            "delivered":delivered,
            "opened_once":opened_once,
            "opened_more_than_once":opened_more_than_once
        })

class SubCampaignsDashboard(APIView):
    def post(self,request):
        id = request.data.get("id")
        campaigns = CampaignSendRequest.objects.filter(id=id)
        delivered = campaigns.filter(counter=1)
        opened_once = campaigns.filter(counter=2)
        opened_more_than_once = campaigns.filter(counter__gte=3)
        return Response({
            "delivered":delivered,
            "opened_once":opened_once,
            "opened_more_than_once":opened_more_than_once
        })



class SubCampaignCreate(APIView):
    def post(self,request):
        serializer = CampaignSendRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            sendEmails.delay(serializer.data['id'])
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)