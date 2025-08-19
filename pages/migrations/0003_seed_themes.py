from django.db import migrations


def seed_themes(apps, schema_editor):
	Theme = apps.get_model('pages', 'Theme')
	UserPreference = apps.get_model('pages', 'UserPreference')
	if Theme.objects.exists():
		return
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
	UserPreference.objects.get_or_create(pk=1, defaults={"theme": "retro-98"})


def unseed_themes(apps, schema_editor):
	Theme = apps.get_model('pages', 'Theme')
	Theme.objects.all().delete()


class Migration(migrations.Migration):

	dependencies = [
		('pages', '0002_theme_alter_userpreference_theme'),
	]

	operations = [
		migrations.RunPython(seed_themes, unseed_themes),
	]
