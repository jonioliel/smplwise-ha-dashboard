"""WebSocket API for SmplWise HA Dashboard."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import area_registry as ar, floor_registry as fr

from .const import DOMAIN
from .store import DashboardStore

_LOGGER = logging.getLogger(__name__)

ALLOWED_SERVICES = {
    "alarm_control_panel": {"alarm_arm_home", "alarm_arm_away", "alarm_disarm"},
    "climate": {
        "set_fan_mode",
        "set_humidity",
        "set_hvac_mode",
        "set_preset_mode",
        "set_swing_horizontal_mode",
        "set_swing_mode",
        "set_temperature",
        "turn_off",
        "turn_on",
    },
    "cover": {"open_cover", "close_cover", "stop_cover", "set_cover_position"},
    "light": {"turn_on", "turn_off"},
    "media_player": {
        "media_play_pause",
        "media_previous_track",
        "media_next_track",
        "volume_mute",
        "volume_set",
        "turn_on",
        "turn_off",
    },
    "switch": {"turn_on", "turn_off"},
}


def _groups(connection: websocket_api.ActiveConnection) -> set[str]:
    """Return group ids for the connected user."""
    return {group.id for group in connection.user.groups}


@callback
def async_register_commands(hass: HomeAssistant, store: DashboardStore) -> None:
    """Register the dashboard API."""

    @websocket_api.websocket_command(
        {vol.Required("type"): f"{DOMAIN}/bootstrap"}
    )
    @websocket_api.async_response
    async def bootstrap(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        area_registry = ar.async_get(hass)
        floor_registry = fr.async_get(hass)
        areas = [
            {
                "id": area.id,
                "name": area.name,
                "floor_id": area.floor_id,
                "icon": area.icon,
                "picture": area.picture,
                "temperature_entity_id": area.temperature_entity_id,
                "humidity_entity_id": area.humidity_entity_id,
            }
            for area in area_registry.async_list_areas()
        ]
        floors = [
            {"id": floor.floor_id, "name": floor.name, "level": floor.level}
            for floor in floor_registry.async_list_floors()
        ]
        connection.send_result(
            msg["id"],
            {
                "areas": areas,
                "floors": floors,
                "config": store.data,
                "user": {
                    "id": connection.user.id,
                    "name": connection.user.name,
                    "is_admin": connection.user.is_admin,
                    "groups": sorted(_groups(connection)),
                },
            },
        )

    @websocket_api.websocket_command(
        {vol.Required("type"): f"{DOMAIN}/admin_context"}
    )
    @websocket_api.require_admin
    @websocket_api.async_response
    async def admin_context(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        try:
            users = await hass.auth.async_get_users()
            groups_by_id = {
                group.id: group
                for user in users
                for group in user.groups
            }
            connection.send_result(
                msg["id"],
                {
                    "users": [
                        {
                            "id": user.id,
                            "name": user.name,
                            "is_admin": user.is_admin,
                        }
                        for user in users
                    ],
                    "groups": [
                        {"id": group.id, "name": group.name}
                        for group in groups_by_id.values()
                    ],
                },
            )
        except Exception as err:
            _LOGGER.exception("Failed to load dashboard users and groups")
            connection.send_error(msg["id"], "admin_context_error", str(err))

    @websocket_api.websocket_command(
        {
            vol.Required("type"): f"{DOMAIN}/save_config",
            vol.Required("config"): dict,
        }
    )
    @websocket_api.require_admin
    @websocket_api.async_response
    async def save_config(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        await store.async_save(msg["config"])
        connection.send_result(msg["id"], store.data)

    @websocket_api.websocket_command(
        {
            vol.Required("type"): f"{DOMAIN}/execute",
            vol.Required("domain"): str,
            vol.Required("service"): str,
            vol.Required("entity_id"): str,
            vol.Optional("service_data", default={}): dict,
        }
    )
    @websocket_api.async_response
    async def execute(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        try:
            entity_id = msg["entity_id"]
            entity_domain = entity_id.partition(".")[0]
            requested_domain = msg["domain"]
            requested_service = msg["service"]
            valid_toggle = (
                requested_domain == "homeassistant"
                and requested_service == "toggle"
                and entity_domain in {"light", "switch"}
            )
            valid_domain_service = (
                requested_domain == entity_domain
                and requested_service
                in ALLOWED_SERVICES.get(entity_domain, set())
            )
            if not (valid_toggle or valid_domain_service):
                connection.send_error(
                    msg["id"],
                    "invalid_action",
                    "Action is not allowed by the dashboard API",
                )
                return
            if not store.can_control(
                connection.user.id,
                _groups(connection),
                entity_id,
                entity_domain,
                connection.user.is_admin,
            ):
                connection.send_error(
                    msg["id"],
                    "not_allowed",
                    "Dashboard policy denied this action",
                )
                return
            data = {**msg["service_data"], "entity_id": entity_id}
            await hass.services.async_call(
                requested_domain, requested_service, data, blocking=True
            )
        except Exception as err:  # Defensive boundary for all custom API failures.
            _LOGGER.exception(
                "Dashboard command failed: %s.%s for %s",
                msg.get("domain"),
                msg.get("service"),
                msg.get("entity_id"),
            )
            connection.send_error(msg["id"], "service_error", str(err))
            return
        connection.send_result(msg["id"], {"success": True})

    websocket_api.async_register_command(hass, bootstrap)
    websocket_api.async_register_command(hass, admin_context)
    websocket_api.async_register_command(hass, save_config)
    websocket_api.async_register_command(hass, execute)

