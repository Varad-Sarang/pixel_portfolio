from django.urls import path
from . import views

app_name = 'showcase'

urlpatterns = [
    path('projects/', views.projects, name='projects'),
    path('project/<int:pk>/', views.project_detail, name='project_detail'),
]
