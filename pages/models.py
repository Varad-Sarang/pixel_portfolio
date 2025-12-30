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


# ---- Content models to drive dynamic pages ----

class Profile(models.Model):
	"""Site owner profile for the About page."""
	full_name = models.CharField(max_length=120)
	title = models.CharField(max_length=160, blank=True)
	avatar = models.ImageField(upload_to="profile/", blank=True, null=True)
	location = models.CharField(max_length=160, blank=True)
	email = models.EmailField(blank=True)
	phone = models.CharField(max_length=40, blank=True)
	resume_url = models.URLField(blank=True)
	bio = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Profile"
		verbose_name_plural = "Profile"

	def __str__(self) -> str:
		return self.full_name


class SocialLink(models.Model):
	"""Links shown on About/Contact pages."""
	name = models.CharField(max_length=80)
	url = models.URLField()
	icon = models.CharField(max_length=8, blank=True, help_text="Emoji or short icon text")
	order = models.PositiveIntegerField(default=0)
	visible = models.BooleanField(default=True)

	class Meta:
		ordering = ["order", "name"]

	def __str__(self) -> str:
		return self.name


class ContactMessage(models.Model):
	"""Messages submitted from the contact form."""
	name = models.CharField(max_length=120)
	email = models.EmailField()
	subject = models.CharField(max_length=200)
	message = models.TextField()
	is_read = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["-created_at"]

	def __str__(self) -> str:
		return f"{self.subject} from {self.name}"


class Note(models.Model):
	"""Simple notes for the Notepad app."""
	title = models.CharField(max_length=200)
	content = models.TextField(blank=True)
	is_deleted = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-updated_at"]

	def __str__(self) -> str:
		return self.title