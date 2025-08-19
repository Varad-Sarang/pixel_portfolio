from django.shortcuts import render, get_object_or_404
from .models import Project, Education, Skill

def projects(request):
    """Projects - Quest Log"""
    projects = Project.objects.all().order_by('-created_date')
    context = {
        'projects': projects,
    }
    return render(request, 'showcase/projects.html', context)

def project_detail(request, pk):
    """Individual project detail"""
    project = get_object_or_404(Project, pk=pk)
    context = {
        'project': project,
    }
    return render(request, 'showcase/project_detail.html', context)