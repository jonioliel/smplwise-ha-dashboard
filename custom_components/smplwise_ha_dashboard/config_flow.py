"""Config flow for SmplWise HA Dashboard."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN


class SmplWiseDashboardConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure SmplWise HA Dashboard."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Create the single dashboard instance."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            return self.async_create_entry(title="SmplWise HA Dashboard", data={})
        return self.async_show_form(step_id="user", data_schema=vol.Schema({}))

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Return the options flow."""
        return SmplWiseDashboardOptionsFlow()


class SmplWiseDashboardOptionsFlow(config_entries.OptionsFlow):
    """Basic options surfaced in Home Assistant settings."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage basic options."""
        schema = vol.Schema(
            {
                vol.Required(
                    "default_view",
                    default=self.config_entry.options.get("default_view", "home"),
                ): vol.In(["home", "floor", "area"]),
                vol.Required(
                    "language",
                    default=self.config_entry.options.get("language", "auto"),
                ): vol.In(["auto", "en", "he"]),
                vol.Required(
                    "background_source",
                    default=self.config_entry.options.get(
                        "background_source", "automatic"
                    ),
                ): vol.In(["automatic", "area", "manual"]),
            }
        )
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)
        return self.async_show_form(step_id="init", data_schema=schema)

