from django.db import models
from django.urls import reverse

class Project(models.Model):
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
        ('planned', 'Planned'),
    ]
    
    title = models.CharField(max_length=200)
    objective = models.TextField()  # What the project aimed to achieve
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    reward = models.CharField(max_length=300)  # Skills/technologies learned
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    github_link = models.URLField(blank=True, null=True)
    live_demo = models.URLField(blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_date']

class Education(models.Model):
    degree = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    start_year = models.IntegerField()
    end_year = models.IntegerField()
    percentage = models.FloatField(help_text="For XP bar display")
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.degree} - {self.institution}"
    
    class Meta:
        ordering = ['-end_year']

class Skill(models.Model):
    SKILL_CATEGORIES = [
        ('programming', 'Programming Languages'),
        ('web', 'Web Technologies'),
        ('database', 'Database'),
        ('tools', 'Tools & Frameworks'),
    ]
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=SKILL_CATEGORIES)
    proficiency = models.IntegerField(help_text="1-100 for progress bar")
    icon = models.CharField(max_length=100, help_text="CSS class or emoji")
    
    def __str__(self):
        return self.name