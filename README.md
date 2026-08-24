# SmplWise HA Dashboard

A responsive, automatically generated whole-home dashboard for Home Assistant.
It is installed as both a full-screen sidebar panel and a Lovelace custom card.

## Current capabilities

- Automatic hierarchy: whole home → floor → area → entity.
- Live Home Assistant state updates.
- English and Hebrew (including RTL).
- Responsive desktop, tablet, and mobile layouts.
- Five selectable whole-home compositions in the graphical editor: **A ·
  Control Center**, **B · Home by Rooms**, **C · Daily Briefing**, **D · Split
  Operations**, and **E · Scenes & Actions**. Every composition uses live Area,
  entity, alarm, weather, scene, and script data with RTL/LTR-aware placement.
- Three purpose-built room layouts in the graphical room editor: **C · Floating
  Islands**, **D · Control Deck**, and **E · Cinema Rail**. Each has a dedicated
  desktop and phone composition, while room names and data use logical start
  alignment—right in Hebrew and left in English.
- Switches, lights, climate/HVAC entities, media players, covers, cameras, and
  alarm panels.
- A whole-home information surface centered on local date/time, with optional
  current weather plus weekly Torah portion, candle-lighting, and Havdalah
  values read from Home Assistant entities.
- A graphical whole-home editor with live desktop and phone previews, block
  ordering, compact/focus information styles, grid/list activity layouts,
  widget and clock scaling, navigation visibility, internal spacing, and
  independent desktop/mobile card sizing. Activity totals are direct shortcuts
  to their category in the continuous device rail.
- A direction-aware 12-column information canvas with explicit Automatic,
  RTL, and LTR modes. Every information widget has independent column, row,
  width, height, physical text alignment, scale, and visibility controls in the
  graphical editor.
- Custom Home Assistant entity-state widgets can be added to the information
  canvas, renamed, positioned, resized, duplicated through multiple entity
  selections, or removed. The canvas automatically becomes a compact two-column
  phone layout while preserving the chosen reading direction.
- Floor-grouped room navigation with live active/inactive indicators. An
  administrator can exclude individual entities from the Area activity result.
  Floors inherit the live status of their child Areas, and each floor is a
  collapsible group with configurable default and remembered expansion state.
- A compact single-row floor/Area navigator on the whole-home screen keeps the
  **Active / All** switch and device controls visible without page scrolling.
- One continuous horizontal device rail on the home view. It can switch between
  **Active** and **All**, continues from one editable category to the next, and
  keeps the category tabs synchronized while the rail is swiped or scrolled.
- Dynamic category sections in every Area. Empty room categories and filters
  are omitted automatically.
- Capability-aware HVAC controls for target temperature or temperature range,
  HVAC mode, fan mode, target humidity, preset, vertical swing, and horizontal
  swing when each option is exposed by the climate entity.
- Live camera cards through Home Assistant's native camera stream component.
  When a camera/integration supports WebRTC, Home Assistant negotiates WebRTC
  and falls back to its other supported stream types when required.
- A dedicated camera center in the desktop sidebar and mobile navigation, with
  selectable 4, 8, 12, or 16-camera pages and an administrator-defined default.
- Full-screen camera enlargement with 100–400% zoom, slider/buttons, mouse-wheel
  zoom, and drag-to-pan on desktop and touch screens.
- Selectable SmplWise Dark and image-derived Controlly Glass designs.
- Automatic Area pictures, manual URLs, or visual background selection from
  the existing Home Assistant Media library.
- One global fallback background for areas that do not have an Area picture or
  an explicit background.
- A single background manager that combines Media selection and manual URLs.
- A dedicated administrator screen for supported entities without a Home
  Assistant Area. Administrators can select several entities and assign all of
  them to one Area in the native Home Assistant Entity Registry.
- Per-area device-type filters, individual entity visibility, and entity search.
- Per-entity dashboard name and display-category overrides, including showing a
  switch under Lighting while preserving its native switch actions.
- Independent bulk editing in **Manage → Devices**: selected entities can have
  only their category changed or only their display Area replaced; the two
  operations never require one another.
- Multi-Area dashboard membership: one Home Assistant entity can be displayed
  in several rooms without changing or duplicating the native entity.
- A categorized manager instead of one long settings page: appearance, home
  information, floor navigation, cameras, rooms, categories, entities,
  backgrounds, filters, permissions, and native unassigned entities.
- Optional alarm access on the whole-home information surface, including a
  multi-alarm selector in management. Alarm panels remain available even when
  they do not have a Home Assistant Area.
- Viewport-contained home, Area, camera, and management shells on desktop,
  tablet, and mobile, with dense content moving to internal horizontal or
  settings-only scrolling instead of extending the whole page.
- Administrator controls for text/icon scale, rectangular/square/circular
  device cards, adjustable rectangular card height, category names and order,
  and per-category turn-on/turn-off action labels.
- Rich Area headers with optional room image, temperature, humidity, live
  summary, and configurable top/bottom control placement. Administrators can
  use the graphical room editor to switch between desktop and phone previews,
  edit global defaults or one Area, and tune header proportions, overlay,
  content alignment, control spacing, widget scale, desktop/mobile card width,
  and camera-window size.
- Optional live Area cameras in the upper room section. The global default can
  show the first camera automatically or hide cameras, while each Area can
  inherit that behavior, choose a specific camera, or disable it.
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
/smplwise-ha-dashboard/smplwise-ha-dashboard-v0.17.1.js
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

## Entity display and multi-Area membership

Administrators can use **Manage → Devices** to change
the dashboard name and display category of each supported entity, or select any
number of Areas in which it should appear. Selecting no Area places it in the
manager's unassigned state. The Reset action restores the Home Assistant name,
native domain category, native Area assignment, and activity behavior.

These overrides affect only SmplWise HA Dashboard. Service calls always use the
entity's real Home Assistant domain, and the Home Assistant entity/device
registry is not modified.

The separate **Manage → No Area** screen is intentionally different: its batch
assignment action changes the selected entities' native `area_id` in Home
Assistant. It is administrator-only, requires an explicit confirmation in the
UI, and assigns every selected entity to the single chosen native Area. Extra
SmplWise multi-Area membership can still be added afterward from **Devices**.

## Camera and WebRTC

SmplWise delegates live camera playback to Home Assistant. WebRTC therefore
depends on the camera integration, Home Assistant configuration, network path,
and browser support. The entity's standard Home Assistant more-info dialog is
available as a fallback.

The camera center discovers every visible `camera.*` entity, including cameras
without an Area. The entity state `idle` does not mean that the live view is
offline; SmplWise shows the stream and reserves an unavailable indication for
`unavailable` or `unknown` entities.

Camera and alarm entities do not need an Area assignment to appear in the
camera center or to remain manageable. Unassigned entities are deliberately
excluded from the whole-home device rail and appear in **Manage → No Area**,
where they can be assigned natively in bulk.

## Background priority

For each Area, the dashboard uses the first available source in this order:

1. Area image selected from Home Assistant Media.
2. Manual Area image URL.
3. Home Assistant Area picture.
4. Global image selected from Home Assistant Media.
5. Manual global image URL.

## Home information entities

Date and time are rendered locally and are always available. Weather is read
from a `weather.*` entity. Weekly portion and Shabbat times are read from sensor
entities, including the standard Jewish Calendar integration's
`parshat_hashavua`, candle-lighting, and Havdalah sensors. SmplWise can detect
the common entity IDs automatically, or an administrator can select an explicit
entity in **Manage → Home screen**. ISO 8601 timestamp sensor values are shown in
the Home Assistant/browser local time zone.

## Development checks

```bash
python -m compileall custom_components/smplwise_ha_dashboard
node --check custom_components/smplwise_ha_dashboard/frontend/smplwise-ha-dashboard.js
```

## Security

The custom WebSocket action endpoint uses a strict service allowlist and applies
dashboard policies before calling Home Assistant services. The batch Area
assignment endpoint is administrator-only, validates the target Area, and
updates only registered entity `area_id` values. Sensitive alarm and lock
workflows will receive additional confirmation/code handling before the first
stable release.

## License

MIT

