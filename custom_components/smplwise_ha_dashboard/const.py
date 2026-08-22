"""Constants for SmplWise HA Dashboard."""

DOMAIN = "smplwise_ha_dashboard"
PANEL_URL = "smplwise-ha-dashboard"
PANEL_TITLE = "SmplWise"
PANEL_ICON = "mdi:home-lightning-bolt-outline"
FRONTEND_URL = "/smplwise-ha-dashboard/smplwise-ha-dashboard-v0.8.0.js"
STORAGE_KEY = "smplwise_ha_dashboard.config"
STORAGE_VERSION = 1

DEFAULT_CONFIG = {
    "language": "auto",
    "theme": "smplwise",
    "featured_area_id": None,
    "default_view": "home",
    "camera_grid_count": 4,
    "background_source": "automatic",
    "global_background": "",
    "manual_backgrounds": {},
    "media_backgrounds": {},
    "area_domain_filters": {},
    "area_overrides": {},
    "entity_overrides": {},
    "area_backgrounds": True,
    "hidden_entities": [],
    "hidden_areas": [],
    "policies": [],
}

SUPPORTED_DOMAINS = {
    "alarm_control_panel",
    "camera",
    "climate",
    "cover",
    "light",
    "media_player",
    "switch",
}

