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
            self.data.update(stored)

    async def async_save(self, data: dict[str, Any]) -> None:
        """Persist validated settings."""
        self.data = {**deepcopy(DEFAULT_CONFIG), **data}
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

