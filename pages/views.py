from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.forms.models import model_to_dict
from django.views.decorators.http import require_http_methods
import json

from showcase.models import Project, Education, Skill
from .models import UserPreference, RunHistory, DesktopItem, Theme

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
    context = {
        'skills': skills,
        'education': education,
    }
    return render(request, 'pages/about.html', context)

def contact(request):
    """Contact - NPC Dialogue"""
    return render(request, 'pages/contact.html')


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


@require_http_methods(["GET"]) 
def api_themes(request):
    """Return available themes (key, name, and variables)."""
    qs = Theme.objects.order_by("name").values("key", "name", "variables", "is_default")
    return JsonResponse({"results": list(qs)})