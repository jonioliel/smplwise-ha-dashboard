# SmplWise HA Dashboard

A responsive, automatically generated whole-home dashboard for Home Assistant.
It is installed as both a full-screen sidebar panel and a Lovelace custom card.

## Version 0.1 MVP

- Automatic hierarchy: whole home → floor → area → entity.
- Live Home Assistant state updates.
- English and Hebrew (including RTL).
- Responsive desktop, tablet, and mobile layouts.
- Switches, lights, media players, covers, cameras, and alarm panels.
- Camera live view through Home Assistant's camera stream component. When a
  camera/integration supports WebRTC, Home Assistant negotiates WebRTC.
- Automatic Area pictures with configurable Area/manual background modes.
- Admin-managed dashboard action policies for users, groups, domains, and
  entities.
- HACS custom integration and manual installation.

## HACS installation

Until the repository is accepted into the HACS default catalog:

1. Open HACS → Integrations → Custom repositories.
2. Add the GitHub repository URL and select **Integration**.
3. Install **SmplWise HA Dashboard** and restart Home Assistant.
4. Open Settings → Devices & services → Add integration.
5. Search for **SmplWise HA Dashboard** and add it.

## Manual installation

Copy `custom_components/smplwise_ha_dashboard` into the Home Assistant
`config/custom_components` directory, restart Home Assistant, and add the
integration from Settings → Devices & services.

## Full-screen panel

After setup, **SmplWise** appears in the Home Assistant sidebar. Its URL is:

```text
/smplwise-ha-dashboard
```

Browser full-screen and kiosk applications can open this path directly.

## Lovelace card

Add this JavaScript resource if Home Assistant has not loaded the panel module
in the current browser session:

```text
/smplwise-ha-dashboard/smplwise-ha-dashboard-v0.3.0.js
```

Resource type: **JavaScript module**.

Then add the card:

```yaml
type: custom:smplwise-ha-dashboard-card
default_view: home
```

Supported values for `default_view` are `home`, `floors`, and `areas`.

## Permissions

The integration's manager lets an administrator add allow/deny policies for
Home Assistant users and groups, scoped to an entity domain. The backend checks
every action sent through this dashboard.

These policies only restrict actions initiated through SmplWise HA Dashboard.
They do not grant Home Assistant permissions and cannot prevent a user from
using another Home Assistant dashboard when that user already has permission
there. Native Home Assistant authorization remains authoritative.

## Camera and WebRTC

SmplWise delegates live camera playback to Home Assistant. WebRTC therefore
depends on the camera integration, Home Assistant configuration, network path,
and browser support. The entity's standard Home Assistant more-info dialog is
available as a fallback.

## Development checks

```bash
python -m compileall custom_components/smplwise_ha_dashboard
node --check custom_components/smplwise_ha_dashboard/frontend/smplwise-ha-dashboard.js
```

## Security

The custom WebSocket action endpoint uses a strict service allowlist and applies
dashboard policies before calling Home Assistant services. Sensitive alarm and
lock workflows will receive additional confirmation/code handling before the
first stable release.

## License

MIT

