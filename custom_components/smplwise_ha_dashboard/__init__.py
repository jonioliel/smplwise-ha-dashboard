"""SmplWise HA Dashboard integration."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import panel_custom
from homeassistant.components.frontend import async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    FRONTEND_URL,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL,
)
from .store import DashboardStore
from .websocket import async_register_commands

type SmplWiseConfigEntry = ConfigEntry[None]


async def async_setup_entry(
    hass: HomeAssistant, entry: SmplWiseConfigEntry
) -> bool:
    """Set up the dashboard, static assets, WebSocket API, and sidebar panel."""
    frontend_dir = Path(__file__).parent / "frontend"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL, str(frontend_dir / "smplwise-ha-dashboard.js"), True)]
    )

    store = DashboardStore(hass)
    await store.async_load()
    store.data.update(entry.options)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = store
    async_register_commands(hass, store)

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="smplwise-ha-dashboard-panel",
        frontend_url_path=PANEL_URL,
        module_url=FRONTEND_URL,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        require_admin=False,
        config={"entry_id": entry.entry_id},
    )
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def async_unload_entry(
    hass: HomeAssistant, entry: SmplWiseConfigEntry
) -> bool:
    """Unload the sidebar panel."""
    async_remove_panel(hass, PANEL_URL)
    hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    return True


async def _async_update_listener(
    hass: HomeAssistant, entry: SmplWiseConfigEntry
) -> None:
    """Reload when basic integration options change."""
    await hass.config_entries.async_reload(entry.entry_id)

