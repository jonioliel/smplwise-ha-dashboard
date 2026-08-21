# SmplWise HA Dashboard

A responsive, automatically generated whole-home dashboard for Home Assistant.
It is installed as both a full-screen sidebar panel and a Lovelace custom card.

## Current capabilities

- Automatic hierarchy: whole home → floor → area → entity.
- Live Home Assistant state updates.
- English and Hebrew (including RTL).
- Responsive desktop, tablet, and mobile layouts.
- Switches, lights, media players, covers, cameras, and alarm panels.
- Live camera cards through Home Assistant's native camera stream component.
  When a camera/integration supports WebRTC, Home Assistant negotiates WebRTC
  and falls back to its other supported stream types when required.
- A dedicated camera center in the desktop sidebar and mobile navigation, with
  selectable 4, 8, 12, or 16-camera pages.
- Full-screen camera enlargement with 100–400% zoom, slider/buttons, mouse-wheel
  zoom, and drag-to-pan on desktop and touch screens.
- Selectable SmplWise Dark and image-derived Controlly Glass designs.
- Automatic Area pictures, manual URLs, or visual background selection from
  the existing Home Assistant Media library.
- One global fallback background for areas that do not have an Area picture or
  an explicit background.
- A single background manager that combines Media selection and manual URLs.
- A dedicated view for cameras, alarm panels, and other supported entities that
  are not assigned to a Home Assistant Area.
- Per-area device-type filters, individual entity visibility, and entity search.
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
/smplwise-ha-dashboard/smplwise-ha-dashboard-v0.7.0.js
```

Resource type: **JavaScript module**.

Then add the card:

```yaml
type: custom:smplwise-ha-dashboard-card
default_view: home
camera_grid_count: 4
```

Supported values for `default_view` are `home`, `floors`, `areas`, and
`cameras`. Supported values for `camera_grid_count` are `4`, `8`, `12`, and
`16`. Administrators can also set both defaults from the dashboard manager.

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

The camera center discovers every visible `camera.*` entity, including cameras
without an Area. The entity state `idle` does not mean that the live view is
offline; SmplWise shows the stream and reserves an unavailable indication for
`unavailable` or `unknown` entities.

Camera and alarm entities do not need an Area assignment. When no Area is set
on the entity or its device, SmplWise shows it under **Not assigned to an
area**. Assigning an Area later moves it into that Area after a dashboard reload
or after selecting **Refresh areas and devices** in the manager.

## Background priority

For each Area, the dashboard uses the first available source in this order:

1. Area image selected from Home Assistant Media.
2. Manual Area image URL.
3. Home Assistant Area picture.
4. Global image selected from Home Assistant Media.
5. Manual global image URL.

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

