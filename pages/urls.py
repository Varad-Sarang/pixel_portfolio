from django.urls import path
from . import views
from showcase import views as showcase_views

app_name = 'pages'

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('older/', views.home_older, name='home_older'),
    path('notepad/', views.notepad_page, name='notepad'),
    path('calculator/', views.calculator_page, name='calculator'),
    path('mycomputer/', views.mycomputer_page, name='mycomputer'),
    path('recycle/', views.recycle_page, name='recycle'),

    # Showcase routes (use showcase views!)
    path("projects/", showcase_views.projects, name="projects"),
    path("project/<int:pk>/", showcase_views.project_detail, name="project_detail"),

    # JSON API endpoints for desktop functionality
    path('api/preferences/', views.api_preferences, name='api_preferences'),
    path('api/run-history/', views.api_run_history, name='api_run_history'),
    path('api/desktop-items/', views.api_desktop_items, name='api_desktop_items'),
    path('api/desktop-items/template/', views.api_desktop_items_template, name='api_desktop_items_template'),
    path('api/themes/', views.api_themes, name='api_themes'),
    path('api/notes/', views.api_notes, name='api_notes'),
]
