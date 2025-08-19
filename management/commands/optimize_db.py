from django.core.management.base import BaseCommand
from django.db import connection
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Optimize database performance for Pixel Portfolio'

    def handle(self, *args, **options):
        self.stdout.write('Optimizing Pixel Portfolio database...')
        
        try:
            # Run migrations to ensure database is up to date
            self.stdout.write('Running migrations...')
            call_command('migrate', verbosity=0)
            
            # Create database indexes for better performance
            with connection.cursor() as cursor:
                # Index for projects
                cursor.execute("""
                    CREATE INDEX IF NOT EXISTS idx_project_status 
                    ON showcase_project(status);
                """)
                
                cursor.execute("""
                    CREATE INDEX IF NOT EXISTS idx_project_created 
                    ON showcase_project(created_date);
                """)
                
                # Index for skills
                cursor.execute("""
                    CREATE INDEX IF NOT EXISTS idx_skill_category 
                    ON showcase_skill(category);
                """)
                
                cursor.execute("""
                    CREATE INDEX IF NOT EXISTS idx_skill_proficiency 
                    ON showcase_skill(proficiency);
                """)
                
                # Index for education
                cursor.execute("""
                    CREATE INDEX IF NOT EXISTS idx_education_years 
                    ON showcase_education(start_year, end_year);
                """)
            
            self.stdout.write(self.style.SUCCESS('Database indexes created successfully'))
            
            # Analyze table statistics
            with connection.cursor() as cursor:
                cursor.execute("ANALYZE showcase_project;")
                cursor.execute("ANALYZE showcase_skill;")
                cursor.execute("ANALYZE showcase_education;")
            
            self.stdout.write(self.style.SUCCESS('Table statistics updated'))
            
            # Check database size
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        name,
                        page_count * page_size as size_bytes
                    FROM pragma_page_count(), pragma_page_size()
                    WHERE name = 'main';
                """)
                result = cursor.fetchone()
                if result:
                    size_mb = result[1] / (1024 * 1024)
                    self.stdout.write(f'Database size: {size_mb:.2f} MB')
            
            self.stdout.write(self.style.SUCCESS('Database optimization completed successfully!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error optimizing database: {e}'))
            raise
