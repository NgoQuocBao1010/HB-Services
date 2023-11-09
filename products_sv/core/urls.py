from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from users.api import router as users_router

api = NinjaAPI(
    title="Django server",
    description="Django Server Swagger docs",
)

api.add_router("/users/", users_router)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
