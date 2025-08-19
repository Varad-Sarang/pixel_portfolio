from django.core.management.base import BaseCommand
from django.db import connection
from showcase.models import Project, Education, Skill
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Initialize database with sample data for Pixel Portfolio'

    def handle(self, *args, **options):
        self.stdout.write('Initializing Pixel Portfolio database...')
        
        try:
            # Create sample projects
            if not Project.objects.exists():
                Project.objects.create(
                    title="Pixel Portfolio Website",
                    objective="Create a retro PC-themed portfolio website",
                    description="A fully interactive portfolio website with Windows 95-style interface, live wallpapers, and retro aesthetics.",
                    status="completed",
                    reward="Django, HTML5, CSS3, JavaScript, Retro UI Design",
                    github_link="https://github.com/yourusername/pixel-portfolio",
                    live_demo="https://yourportfolio.com"
                )
                
                Project.objects.create(
                    title="Retro Game Collection",
                    objective="Build a collection of classic arcade games",
                    description="A web-based collection of retro games including Snake, Tetris, and Pong with authentic 8-bit graphics.",
                    status="in_progress",
                    reward="Game Development, Canvas API, Sound Design",
                    github_link="https://github.com/yourusername/retro-games"
                )
                
                self.stdout.write(self.style.SUCCESS('Sample projects created successfully'))
            
            # Create sample education
            if not Education.objects.exists():
                Education.objects.create(
                    degree="Bachelor of Computer Science",
                    institution="Tech University",
                    start_year=2020,
                    end_year=2024,
                    percentage=85.0,
                    description="Specialized in web development and software engineering"
                )
                
                self.stdout.write(self.style.SUCCESS('Sample education created successfully'))
            
            # Create sample skills
            if not Skill.objects.exists():
                Skill.objects.create(
                    name="Python",
                    category="programming",
                    proficiency=90,
                    icon="🐍"
                )
                
                Skill.objects.create(
                    name="Django",
                    category="web",
                    proficiency=85,
                    icon="🎯"
                )
                
                Skill.objects.create(
                    name="JavaScript",
                    category="programming",
                    proficiency=80,
                    icon="⚡"
                )
                
                Skill.objects.create(
                    name="HTML/CSS",
                    category="web",
                    proficiency=95,
                    icon="🌐"
                )
                
                self.stdout.write(self.style.SUCCESS('Sample skills created successfully'))
            
            # Create superuser if none exists
            if not User.objects.filter(is_superuser=True).exists():
                User.objects.create_superuser(
                    username='admin',
                    email='admin@pixelportfolio.com',
                    password='admin123'
                )
                self.stdout.write(self.style.SUCCESS('Superuser created: admin/admin123'))
            
            self.stdout.write(self.style.SUCCESS('Database initialization completed successfully!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error initializing database: {e}'))
            raise
