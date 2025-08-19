from django.core.management.base import BaseCommand
from django.db import connection
from showcase.models import Project, Education, Skill
from pages.models import Theme, UserPreference
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
            
            # Seed themes if none exist
            if Theme.objects.count() == 0:
                presets = [
                    {
                        "key": "retro-98",
                        "name": "Retro 98",
                        "is_default": True,
                        "variables": {
                            "--retro-bg": "#0a0a0a",
                            "--retro-desktop": "#000080",
                            "--retro-taskbar": "#c0c0c0",
                            "--retro-window": "#c0c0c0",
                            "--retro-border": "#808080",
                            "--retro-text": "#000000",
                            "--retro-highlight": "#ffffff",
                            "--retro-shadow": "#404040",
                            "--retro-info": "#0080ff"
                        }
                    },
                    {
                        "key": "retro-amber",
                        "name": "Retro Amber CRT",
                        "variables": {
                            "--retro-bg": "#000000",
                            "--retro-desktop": "#1a1200",
                            "--retro-taskbar": "#4a3b00",
                            "--retro-window": "#2a2100",
                            "--retro-border": "#6b5200",
                            "--retro-text": "#ffbf00",
                            "--retro-highlight": "#ffc933",
                            "--retro-shadow": "#332600",
                            "--retro-info": "#ffbf00"
                        }
                    },
                    {
                        "key": "modern-mint",
                        "name": "Modern Mint",
                        "variables": {
                            "--retro-bg": "#0d1117",
                            "--retro-desktop": "#0b3d3d",
                            "--retro-taskbar": "#1f6f6f",
                            "--retro-window": "#163a3a",
                            "--retro-border": "#2aa198",
                            "--retro-text": "#e6fffb",
                            "--retro-highlight": "#c2fff6",
                            "--retro-shadow": "#0a2a2a",
                            "--retro-info": "#2ec4b6"
                        }
                    },
                    {
                        "key": "modern-neon",
                        "name": "Modern Neon",
                        "variables": {
                            "--retro-bg": "#0b0f1a",
                            "--retro-desktop": "#0f172a",
                            "--retro-taskbar": "#111827",
                            "--retro-window": "#111827",
                            "--retro-border": "#374151",
                            "--retro-text": "#e5e7eb",
                            "--retro-highlight": "#93c5fd",
                            "--retro-shadow": "#0b1020",
                            "--retro-info": "#60a5fa"
                        }
                    }
                ]
                for t in presets:
                    Theme.objects.create(**t)
                self.stdout.write(self.style.SUCCESS('Seeded themes.'))

            # Ensure preferences exist with default theme key
            UserPreference.objects.get_or_create(pk=1, defaults={"theme": "retro-98"})

            self.stdout.write(self.style.SUCCESS('Database initialization completed successfully!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error initializing database: {e}'))
            raise
