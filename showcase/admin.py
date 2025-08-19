from django.contrib import admin
from .models import Project, Education, Skill

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_date')
    list_filter = ('status', 'created_date')
    search_fields = ('title', 'description')
    ordering = ('-created_date',)

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_year', 'end_year', 'percentage')
    list_filter = ('start_year', 'end_year')
    search_fields = ('degree', 'institution')
    ordering = ('-end_year',)

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency', 'icon')
    list_filter = ('category', 'proficiency')
    search_fields = ('name',)
    ordering = ('name',)
