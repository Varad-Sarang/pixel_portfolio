from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.forms.models import model_to_dict
from django.views.decorators.http import require_http_methods
import json

from showcase.models import Project, Education, Skill
from .models import UserPreference, RunHistory, DesktopItem, Theme, Profile, SocialLink, ContactMessage, Note
from django.views.decorators.http import require_POST

@ensure_csrf_cookie
def home(request):
    """Landing page - Start Screen"""
    return render(request, 'pages/home.html')

def home_older(request):
    """Older version (debug)"""
    return render(request, "pages/home_older.html")

def about(request):
    """About Me - Player Profile"""
    skills = Skill.objects.all()
    education = Education.objects.all()
    profile = Profile.objects.first()
    social_links = SocialLink.objects.filter(visible=True).order_by("order", "name")
    context = {
        'skills': skills,
        'education': education,
        'profile': profile,
        'social_links': social_links,
    }
    return render(request, 'pages/about.html', context)

def contact(request):
    """Contact - NPC Dialogue"""
    if request.method == "POST":
        name = (request.POST.get("name") or "").strip()
        email = (request.POST.get("email") or "").strip()
        subject = (request.POST.get("subject") or "").strip()
        message = (request.POST.get("message") or "").strip()
        if name and email and subject and message:
            ContactMessage.objects.create(name=name, email=email, subject=subject, message=message)
            # Redirect to avoid form re-post
            return redirect('pages:contact')
        # Fallthrough: render with error if fields missing
    return render(request, 'pages/contact.html')


def notepad_page(request):
    """Standalone Notepad page (also used by desktop app)."""
    return render(request, 'pages/notepad.html')


def calculator_page(request):
    """Standalone Calculator page (also used by desktop app)."""
    return render(request, 'pages/calculator.html')


def mycomputer_page(request):
    """Standalone My Computer page with quick links."""
    return render(request, 'pages/mycomputer.html')


def recycle_page(request):
    """Standalone Recycle Bin page listing deleted notes as a demo."""
    deleted_notes = Note.objects.filter(is_deleted=True).order_by('-updated_at')
    return render(request, 'pages/recycle.html', { 'deleted_notes': deleted_notes })


# ----- JSON API -----

def get_or_create_preferences() -> UserPreference:
    obj, _ = UserPreference.objects.get_or_create(pk=1, defaults={
        "theme": "retro-98",
        "wallpaper": "default",
        "sound_enabled": True,
        "volume": 50,
    })
    return obj


@require_http_methods(["GET", "POST"])
def api_preferences(request):
    if request.method == "GET":
        prefs = get_or_create_preferences()
        return JsonResponse(model_to_dict(prefs))

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    prefs = get_or_create_preferences()
    prefs.theme = data.get("theme", prefs.theme)
    prefs.wallpaper = data.get("wallpaper", prefs.wallpaper)
    prefs.sound_enabled = bool(data.get("sound_enabled", prefs.sound_enabled))
    if isinstance(data.get("volume"), int):
        prefs.volume = max(0, min(100, int(data.get("volume"))))
    prefs.save()
    return JsonResponse(model_to_dict(prefs))


@require_http_methods(["GET", "POST"]) 
def api_run_history(request):
    if request.method == "GET":
        items = list(RunHistory.objects.order_by("-created_at").values("id", "command", "result", "created_at"))
        return JsonResponse({"results": items})

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    command = (data.get("command") or "").strip()
    result = (data.get("result") or "").strip()
    if not command:
        return JsonResponse({"error": "command is required"}, status=400)
    rh = RunHistory.objects.create(command=command, result=result)
    return JsonResponse({"id": rh.id, "command": rh.command, "result": rh.result, "created_at": rh.created_at})


@require_http_methods(["GET", "POST", "PATCH", "DELETE"]) 
def api_desktop_items(request):
    if request.method == "GET":
        items = list(DesktopItem.objects.order_by("id").values("id", "label", "item_type", "pos_x", "pos_y"))
        return JsonResponse({"results": items})

    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
        except Exception:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        label = (data.get("label") or "New Folder").strip() or "New Folder"
        item_type = data.get("item_type", "folder")
        pos_x = int(data.get("pos_x", 100))
        pos_y = int(data.get("pos_y", 100))
        item = DesktopItem.objects.create(label=label, item_type=item_type, pos_x=pos_x, pos_y=pos_y)
        return JsonResponse({"id": item.id, "label": item.label, "item_type": item.item_type, "pos_x": item.pos_x, "pos_y": item.pos_y})

    if request.method == "PATCH":
        try:
            data = json.loads(request.body.decode("utf-8"))
        except Exception:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        try:
            item = DesktopItem.objects.get(pk=int(data.get("id")))
        except (DesktopItem.DoesNotExist, TypeError, ValueError):
            return JsonResponse({"error": "Invalid id"}, status=404)
        if "label" in data:
            item.label = (data.get("label") or item.label)
        if "pos_x" in data:
            item.pos_x = int(data.get("pos_x"))
        if "pos_y" in data:
            item.pos_y = int(data.get("pos_y"))
        item.save()
        return JsonResponse({"id": item.id, "label": item.label, "item_type": item.item_type, "pos_x": item.pos_x, "pos_y": item.pos_y})

    if request.method == "DELETE":
        try:
            data = json.loads(request.body.decode("utf-8"))
            DesktopItem.objects.filter(pk=int(data.get("id"))).delete()
            return JsonResponse({"ok": True})
        except Exception:
            return JsonResponse({"error": "Invalid request"}, status=400)

    return HttpResponseNotAllowed(["GET", "POST", "PATCH", "DELETE"])


@require_POST
def api_desktop_items_template(request):
    """Create a desktop item from a preset template key."""
    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    key = (data.get("key") or "").strip().lower()
    presets = {
        "house": {
            "label": "House",
            "item_type": "folder",
            "pos_x": 80,
            "pos_y": 360,
        },
        "docs": {
            "label": "Documents",
            "item_type": "folder",
            "pos_x": 220,
            "pos_y": 360,
        },
        "pics": {
            "label": "Pictures",
            "item_type": "folder",
            "pos_x": 360,
            "pos_y": 360,
        },
        "link_projects": {
            "label": "Projects",
            "item_type": "shortcut",
            "pos_x": 500,
            "pos_y": 360,
        },
    }

    preset = presets.get(key)
    if not preset:
        return JsonResponse({"error": "Unknown template key"}, status=400)

    item = DesktopItem.objects.create(**preset)
    return JsonResponse({"id": item.id, "label": item.label, "item_type": item.item_type, "pos_x": item.pos_x, "pos_y": item.pos_y})


@require_http_methods(["GET"]) 
def api_themes(request):
    """Return available themes (key, name, and variables)."""
    qs = Theme.objects.order_by("name").values("key", "name", "variables", "is_default")
    return JsonResponse({"results": list(qs)})


@require_http_methods(["GET", "POST", "PATCH", "DELETE"]) 
def api_notes(request):
    """Lightweight JSON API to back the Notepad app (admin-managed too)."""
    if request.method == "GET":
        items = list(Note.objects.filter(is_deleted=False).order_by("-updated_at").values("id", "title", "content", "is_deleted", "updated_at", "created_at"))
        return JsonResponse({"results": items})

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if request.method == "POST":
        title = (data.get("title") or "Untitled").strip() or "Untitled"
        content = data.get("content") or ""
        note = Note.objects.create(title=title, content=content)
        return JsonResponse({"id": note.id, "title": note.title, "content": note.content, "created_at": note.created_at, "updated_at": note.updated_at})

    if request.method == "PATCH":
        try:
            note = Note.objects.get(pk=int(data.get("id")))
        except (Note.DoesNotExist, TypeError, ValueError):
            return JsonResponse({"error": "Invalid id"}, status=404)
        if "title" in data:
            note.title = (data.get("title") or note.title)
        if "content" in data:
            note.content = data.get("content") or note.content
        if "is_deleted" in data:
            note.is_deleted = bool(data.get("is_deleted"))
        note.save()
        return JsonResponse({"id": note.id, "title": note.title, "content": note.content, "is_deleted": note.is_deleted, "updated_at": note.updated_at})

    if request.method == "DELETE":
        try:
            Note.objects.filter(pk=int(data.get("id"))).delete()
            return JsonResponse({"ok": True})
        except Exception:
            return JsonResponse({"error": "Invalid request"}, status=400)

    return HttpResponseNotAllowed(["GET", "POST", "PATCH", "DELETE"])