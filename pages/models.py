from django.db import models
class Theme(models.Model):
	"""A named theme with a set of CSS variable overrides."""
	key = models.SlugField(max_length=50, unique=True)
	name = models.CharField(max_length=100)
	variables = models.JSONField(default=dict, blank=True)
	is_default = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return self.name


class UserPreference(models.Model):
	"""Singleton-style preferences for the demo (no auth)."""

	# Use a fixed primary key (1) for a single-user demo setup
	id = models.BigAutoField(primary_key=True)
	# Store selected theme key; we avoid FK to keep this lightweight and tolerant to deletes
	theme = models.CharField(max_length=50, default="retro-98")
	wallpaper = models.CharField(max_length=64, default="default")
	sound_enabled = models.BooleanField(default=True)
	volume = models.PositiveIntegerField(default=50)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return f"Preferences(theme={self.theme}, wallpaper={self.wallpaper})"


class RunHistory(models.Model):
	"""Stores commands executed via the Run dialog/command prompt."""
	command = models.CharField(max_length=255)
	result = models.TextField(blank=True, default="")
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return f"{self.command} @ {self.created_at:%Y-%m-%d %H:%M:%S}"


class DesktopItem(models.Model):
	"""Persist user-created items on the desktop (e.g., folders)."""
	ITEM_CHOICES = [
		("folder", "Folder"),
		("shortcut", "Shortcut"),
	]

	label = models.CharField(max_length=100)
	item_type = models.CharField(max_length=20, choices=ITEM_CHOICES, default="folder")
	pos_x = models.IntegerField(default=100)
	pos_y = models.IntegerField(default=100)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return f"{self.item_type}:{self.label} ({self.pos_x},{self.pos_y})"

