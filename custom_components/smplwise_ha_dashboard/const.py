"""Constants for SmplWise HA Dashboard."""

DOMAIN = "smplwise_ha_dashboard"
PANEL_URL = "smplwise-ha-dashboard"
PANEL_TITLE = "SmplWise"
PANEL_ICON = "mdi:home-lightning-bolt-outline"
FRONTEND_URL = "/smplwise-ha-dashboard/smplwise-ha-dashboard-v0.13.0.js"
STORAGE_KEY = "smplwise_ha_dashboard.config"
STORAGE_VERSION = 1

DEFAULT_CONFIG = {
    "config_schema_version": 5,
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
    "home_layout": {
        "show_activity_overview": True,
        "activity_position": "end",
        "activity_width": 300,
        "activity_scale": 1.0,
        "info_scale": 1.0,
        "info_alignment": "start",
        "activity_categories": ["light", "switch", "climate", "cover"],
        "info_order": ["weather", "parasha", "candle", "havdalah"],
        "section_order": ["overview", "navigation", "devices"],
        "desktop_overview_min": 300,
        "desktop_devices_height": 210,
        "mobile_overview_min": 180,
        "mobile_devices_height": 190,
        "section_gap": 10,
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
        "hero_size": 42,
        "controls_size": 58,
        "hero_widget_scale": 1.0,
        "control_card_width": 195,
        "hero_camera": "auto",
        "hero_camera_size": 34,
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

