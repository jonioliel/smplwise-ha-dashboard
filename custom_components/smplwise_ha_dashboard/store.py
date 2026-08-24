"""Persistent settings and dashboard authorization policy."""

from __future__ import annotations

from copy import deepcopy
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DEFAULT_CONFIG, STORAGE_KEY, STORAGE_VERSION


class DashboardStore:
    """Store settings that are edited from the dashboard manager."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, STORAGE_KEY
        )
        self.data: dict[str, Any] = deepcopy(DEFAULT_CONFIG)

    async def async_load(self) -> None:
        """Load and merge stored settings."""
        stored = await self._store.async_load()
        if stored:
            previous_version = int(stored.get("config_schema_version") or 1)
            self.data.update(stored)
            for section in (
                "home_info",
                "home_layout",
                "room_defaults",
                "floor_navigation",
            ):
                self.data[section] = {
                    **deepcopy(DEFAULT_CONFIG[section]),
                    **(stored.get(section) or {}),
                }
            migrated = False
            if previous_version < 2:
                # v0.9 introduced the weather widget as opt-in. The compact
                # home screen in v0.10 promotes it to a default information tile.
                self.data["home_info"]["show_weather"] = True
                migrated = True
            if previous_version < 3:
                self.data["entity_card_height"] = DEFAULT_CONFIG["entity_card_height"]
                migrated = True
            if previous_version < 4:
                migrated = True
            if previous_version < 5:
                # The original logical-end default put Hebrew clock content on
                # the left. Schema 5 promotes a right-aligned RTL home layout.
                self.data["home_layout"]["info_alignment"] = "start"
                migrated = True
            if previous_version < 6:
                # Schema 6 turns the whole-home hero into a fixed visual block
                # and gives the remaining height to useful device controls.
                layout = self.data["home_layout"]
                if layout.get("desktop_overview_min") == 300:
                    layout["desktop_overview_min"] = 280
                if layout.get("desktop_devices_height") == 210:
                    layout["desktop_devices_height"] = 240
                if layout.get("mobile_overview_min") == 180:
                    layout["mobile_overview_min"] = 220
                migrated = True
            if previous_version < 7:
                # Schema 7 replaces the fixed two-column information block
                # with a direction-aware 12-column canvas. Restore enough
                # height for information to remain legible on wall panels.
                layout = self.data["home_layout"]
                if layout.get("desktop_overview_min") in (280, 300):
                    layout["desktop_overview_min"] = 340
                if layout.get("mobile_overview_min") in (180, 220):
                    layout["mobile_overview_min"] = 240
                migrated = True
            if migrated:
                self.data["config_schema_version"] = 7
                await self._store.async_save(self.data)

    async def async_save(self, data: dict[str, Any]) -> None:
        """Persist validated settings."""
        self.data = {**deepcopy(DEFAULT_CONFIG), **data}
        for section in (
            "home_info",
            "home_layout",
            "room_defaults",
            "floor_navigation",
        ):
            self.data[section] = {
                **deepcopy(DEFAULT_CONFIG[section]),
                **(data.get(section) or {}),
            }
        await self._store.async_save(self.data)

    def can_control(
        self,
        user_id: str,
        group_ids: set[str],
        entity_id: str,
        domain: str,
        is_admin: bool,
    ) -> bool:
        """Apply the most specific matching dashboard policy.

        Administrators retain access. A matching deny wins over allow. When no
        policy matches, control is allowed and Home Assistant's own permission
        layer still applies.
        """
        if is_admin:
            return True
        decisions: list[bool] = []
        for policy in self.data.get("policies", []):
            subjects = policy.get("subjects", {})
            applies = user_id in subjects.get("users", []) or bool(
                group_ids.intersection(subjects.get("groups", []))
            )
            if not applies:
                continue
            resources = policy.get("resources", {})
            entity_match = entity_id in resources.get("entities", [])
            domain_match = domain in resources.get("domains", [])
            all_match = bool(resources.get("all"))
            if entity_match or domain_match or all_match:
                decisions.append(policy.get("effect", "deny") == "allow")
        return False if False in decisions else all(decisions) if decisions else True

