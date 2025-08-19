from django.contrib import admin
from .models import UserPreference, RunHistory, DesktopItem, Theme


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
	list_display = ("theme", "wallpaper", "sound_enabled", "volume", "updated_at")
	readonly_fields = ("updated_at",)


@admin.register(RunHistory)
class RunHistoryAdmin(admin.ModelAdmin):
	list_display = ("command", "created_at")
	search_fields = ("command", "result")
	readonly_fields = ("created_at",)


@admin.register(DesktopItem)
class DesktopItemAdmin(admin.ModelAdmin):
	list_display = ("label", "item_type", "pos_x", "pos_y", "updated_at")
	list_filter = ("item_type",)
	search_fields = ("label",)
	readonly_fields = ("created_at", "updated_at")


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
	list_display = ("key", "name", "is_default", "updated_at")
	list_filter = ("is_default",)
	search_fields = ("key", "name")

