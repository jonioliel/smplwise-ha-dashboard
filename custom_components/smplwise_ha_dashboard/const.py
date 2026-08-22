"""Constants for SmplWise HA Dashboard."""

DOMAIN = "smplwise_ha_dashboard"
PANEL_URL = "smplwise-ha-dashboard"
PANEL_TITLE = "SmplWise"
PANEL_ICON = "mdi:home-lightning-bolt-outline"
FRONTEND_URL = "/smplwise-ha-dashboard/smplwise-ha-dashboard-v0.11.0.js"
STORAGE_KEY = "smplwise_ha_dashboard.config"
STORAGE_VERSION = 1

DEFAULT_CONFIG = {
    "config_schema_version": 3,
    "language": "auto",
    "theme": "smplwise",
    "default_view": "home",
    "camera_grid_count": 4,
    "text_scale": 1.0,
    "icon_scale": 1.0,
    "entity_card_shape": "rectangle",
    "entity_card_height": 158,
    "category_settings": {},
    "home_info": {
        "show_weather": True,
        "weather_entity_id": None,
        "show_parasha": False,
        "parasha_entity_id": None,
        "show_shabbat": False,
        "candle_lighting_entity_id": None,
        "havdalah_entity_id": None,
        "show_alarms": True,
        "alarm_entity_ids": None,
    },
    "floor_navigation": {
        "remember_expansion": True,
        "default_collapsed": True,
    },
    "room_defaults": {
        "show_image": True,
        "show_temperature": True,
        "show_info": True,
        "controls_position": "bottom",
    },
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

