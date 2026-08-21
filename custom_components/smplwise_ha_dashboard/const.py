"""Constants for SmplWise HA Dashboard."""

DOMAIN = "smplwise_ha_dashboard"
PANEL_URL = "smplwise-ha-dashboard"
PANEL_TITLE = "SmplWise"
PANEL_ICON = "mdi:home-lightning-bolt-outline"
FRONTEND_URL = "/smplwise-ha-dashboard/smplwise-ha-dashboard.js"
STORAGE_KEY = "smplwise_ha_dashboard.config"
STORAGE_VERSION = 1

DEFAULT_CONFIG = {
    "language": "auto",
    "default_view": "home",
    "background_source": "automatic",
    "manual_backgrounds": {},
    "area_backgrounds": True,
    "hidden_entities": [],
    "hidden_areas": [],
    "policies": [],
}

SUPPORTED_DOMAINS = {
    "alarm_control_panel",
    "camera",
    "cover",
    "light",
    "media_player",
    "switch",
}

