from django.core.management.base import BaseCommand
from showcase.models import Project, Education, Skill
from django.utils import timezone
from datetime import date

class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create sample projects
        projects_data = [
            {
                'title': 'Alibaug Tourism & Ferry Website',
                'objective': 'Create a comprehensive tourism platform for Alibaug featuring ferry booking system, tourist attractions, and local business listings to boost tourism in the region.',
                'description': 'A comprehensive tourism platform designed to boost tourism in Alibaug region. Features include ferry booking system, tourist attraction guides, local business listings, and an intuitive user interface for both tourists and local businesses.',
                'status': 'completed',
                'reward': 'Full-Stack Development • Django Framework • Database Design • User Authentication • Payment Integration',
                'github_link': 'https://github.com/example/alibaug-tourism',
                'live_demo': 'https://alibaug-tourism.example.com',
            },
            {
                'title': 'Pixel Portfolio Website',
                'objective': 'Design and develop a pixel-themed personal portfolio website with game-like interface.',
                'description': 'A pixel-themed personal portfolio website with game-like interface, featuring smooth animations, responsive design, and interactive elements.',
                'status': 'completed',
                'reward': 'Creative Design • Responsive Layout • Animation Effects',
                'github_link': 'https://github.com/example/pixel-portfolio',
                'live_demo': 'https://pixel-portfolio.example.com',
            },
            {
                'title': 'Student Management System',
                'objective': 'Develop a comprehensive system for managing student records, grades, and attendance.',
                'description': 'A comprehensive system for managing student records, grades, and attendance with role-based access control.',
                'status': 'in_progress',
                'reward': 'Database Management • CRUD Operations • User Roles',
                'github_link': 'https://github.com/example/student-management',
                'live_demo': None,
            },
            {
                'title': 'E-Commerce Prototype',
                'objective': 'Build a basic e-commerce website with product catalog, shopping cart, and checkout process.',
                'description': 'A basic e-commerce website with product catalog, shopping cart, and checkout process.',
                'status': 'completed',
                'reward': 'E-commerce Logic • Payment Integration • Shopping Cart',
                'github_link': 'https://github.com/example/ecommerce-prototype',
                'live_demo': 'https://ecommerce-prototype.example.com',
            }
        ]
        
        for project_data in projects_data:
            project, created = Project.objects.get_or_create(
                title=project_data['title'],
                defaults=project_data
            )
            if created:
                self.stdout.write(f'Created project: {project.title}')
            else:
                self.stdout.write(f'Project already exists: {project.title}')
        
        # Create sample education
        education_data = [
            {
                'degree': 'Bachelor of Computer Applications',
                'institution': 'University of Mumbai',
                'start_year': 2021,
                'end_year': 2024,
                'percentage': 85.0,
                'description': 'Completed comprehensive study in computer science fundamentals, programming languages, database management, and software development methodologies.'
            },
            {
                'degree': 'Higher Secondary Education',
                'institution': 'Maharashtra State Board',
                'start_year': 2019,
                'end_year': 2021,
                'percentage': 78.0,
                'description': 'Focused on Science stream with Mathematics and Computer Science, laying the foundation for programming and logical thinking.'
            }
        ]
        
        for edu_data in education_data:
            education, created = Education.objects.get_or_create(
                degree=edu_data['degree'],
                institution=edu_data['institution'],
                start_year=edu_data['start_year'],
                defaults=edu_data
            )
            if created:
                self.stdout.write(f'Created education: {education.degree}')
            else:
                self.stdout.write(f'Education already exists: {education.degree}')
        
        # Create sample skills
        skills_data = [
            # Programming Languages
            {'name': 'Python', 'category': 'programming', 'proficiency': 85, 'icon': '🐍'},
            {'name': 'JavaScript', 'category': 'programming', 'proficiency': 80, 'icon': '⚡'},
            {'name': 'Java', 'category': 'programming', 'proficiency': 75, 'icon': '☕'},
            {'name': 'C++', 'category': 'programming', 'proficiency': 70, 'icon': '⚙️'},
            
            # Web Technologies
            {'name': 'HTML/CSS', 'category': 'web', 'proficiency': 90, 'icon': '🌐'},
            {'name': 'Django', 'category': 'web', 'proficiency': 80, 'icon': '🎯'},
            {'name': 'React', 'category': 'web', 'proficiency': 70, 'icon': '⚛️'},
            {'name': 'Bootstrap', 'category': 'web', 'proficiency': 85, 'icon': '🎨'},
            
            # Database
            {'name': 'MySQL', 'category': 'database', 'proficiency': 80, 'icon': '🗄️'},
            {'name': 'PostgreSQL', 'category': 'database', 'proficiency': 75, 'icon': '🐘'},
            
            # Tools & Frameworks
            {'name': 'Git/GitHub', 'category': 'tools', 'proficiency': 85, 'icon': '📚'},
            {'name': 'VS Code', 'category': 'tools', 'proficiency': 95, 'icon': '💻'},
        ]
        
        for skill_data in skills_data:
            skill, created = Skill.objects.get_or_create(
                name=skill_data['name'],
                category=skill_data['category'],
                defaults=skill_data
            )
            if created:
                self.stdout.write(f'Created skill: {skill.name}')
            else:
                self.stdout.write(f'Skill already exists: {skill.name}')
        
        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data!'))
