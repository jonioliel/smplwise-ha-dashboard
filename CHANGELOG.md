# Changelog

## 0.8.0

- Reorganize whole-home active devices into clear category sections such as
  **Lights on now**, **Climate active now**, and **Covers open now**.
- Group every Area dynamically by the categories that actually contain devices;
  rooms without climate, covers, media, or other categories do not show empty
  headings.
- Add Home Assistant `climate` discovery and capability-aware HVAC controls for
  modes, target temperature/range, fan, humidity, presets, and both swing axes.
- Add climate services to the permission-checked backend action allowlist.
- Add a searchable entity editor for dashboard names and display categories,
  including presenting a switch as a light without changing its native action.
- Add dashboard-only multi-Area membership so one entity can appear in several
  rooms, be moved to another room, or be intentionally left unassigned.
- Keep legacy Area filters compatible so upgrading cannot silently hide newly
  supported climate entities before the administrator saves new filter choices.
- Deduplicate entity totals on floors when an entity belongs to multiple Areas.
- Extend the browser harness with advanced and basic climate entities and verify
  desktop, 390 px mobile, Hebrew RTL, scroll stability, dropdown stability,
  category omission, HVAC service payloads, override persistence, and
  multi-room rendering.

## 0.7.1

- Declare Home Assistant's HTTP component dependency so the integration passes
  hassfest dependency validation.
- Update the validation workflow runtime and keep GitHub-side repository
  description/topic metadata outside source-package validation.

## 0.7.0

- Replace camera `idle` status cards with Home Assistant native live camera
  streams, preferring WebRTC whenever the camera integration exposes it.
- Add a dedicated Camera center to the desktop sidebar and mobile navigation.
- Discover cameras with and without Home Assistant Area assignments.
- Add selectable 4, 8, 12, and 16-camera layouts with pagination.
- Add a focused camera viewer with native playback controls, 100–400% zoom,
  range and button controls, mouse-wheel zoom, and drag-to-pan.
- Keep active camera streams, camera zoom, and pan position stable while Home
  Assistant state updates arrive.
- Add a native Picture Entity fallback for frontend sessions where
  `ha-camera-stream` has not yet been registered.
- Add a manager setting and Lovelace option for the default camera count and
  allow the camera center to be the default view.
- Verify desktop, 390 px mobile, Hebrew RTL, all four layouts, pagination,
  stream fallback, persistent scroll, stream-instance stability, and zoom/pan.

## 0.6.0

- Add an explicit **Exit to HA** action to the full-screen panel header.
- Add one global fallback background for every area without its own Media,
  manual URL, or Home Assistant Area picture.
- Merge manual image URLs and the Home Assistant Media browser into one
  background manager, including previews, source labels, and reset actions.
- Preserve unsaved background URL drafts while browsing Home Assistant Media.
- Show supported entities without an Area in a dedicated **Not assigned to an
  area** section and view, with alarms and cameras prioritized.
- Include unassigned entities in whole-home totals and live status metrics.
- Add per-area device-type filters, per-entity visibility controls, and device
  search to the manager.
- Add a manager action to refresh Home Assistant areas, entities, and devices
  after registry assignments change.
- Apply hidden-area and device-type settings consistently to whole-home views.
- Keep area-specific imagery ahead of the global fallback when automatically
  choosing the featured room.
- Verify camera streaming, alarm controls, global/area background precedence,
  filters, search, 390 px scrolling, dropdown stability, and frequent updates.

## 0.5.0

- Replace the fixed brown Controlly palette with a neutral glass material whose visible tint comes from the selected room image.
- Use the featured-room image across the complete Controlly dashboard background with a subtle readability overlay.
- Add neutral translucent surfaces, backdrop blur, saturation, fine light borders, inner highlights, and near-white active cards.
- Add a visual Home Assistant Media browser for room backgrounds.
- Browse folders through `media_source/browse_media`, filter to images, show thumbnails, and support back navigation.
- Store stable `media-source://` identifiers and resolve signed image URLs again whenever the dashboard loads.
- Add per-room previews and a clear-background action in dashboard management.
- Verify the media picker at 390 px with no horizontal overflow and during frequent Home Assistant updates.

## 0.4.1

- Stop rebuilding the complete dashboard DOM for every Home Assistant update.
- Patch live device states and Controlly metrics in place so scrolling, focus, and open controls remain stable.
- Ignore identical and unsupported-domain state updates by using a relevant-state signature.
- Keep the settings DOM untouched while a user edits an input or dropdown.
- Preserve scroll position during direct device commands and delayed command feedback.
- Add an administrator-selectable featured room.
- Choose the automatic featured room by room picture, device count, and stable alphabetical order instead of registry order.
- Add stress tests with identical updates every 50 ms and relevant light changes every 250 ms.

## 0.4.0

- Rebuild the Controlly home view around a large featured-room image, live home status, horizontal room navigation, filters, and device controls.
- Fix full-screen mobile scrolling by making the dashboard surface the explicit vertical scroll container.
- Add momentum scrolling and overscroll containment for touch devices.
- Add responsive layouts for 360 px, 390 px, 720 px, 900 px, and desktop widths.
- Prevent horizontal overflow on narrow phones while keeping the bottom navigation fixed.
- Expand the browser QA harness to 31 devices, three rooms, two floors, users, groups, room pictures, and long management screens.

## 0.3.0

- Add the optional Controlly Glass dashboard design.
- Keep SmplWise Dark as the default and allow administrators to switch designs.
- Add responsive glass surfaces, warm layered backgrounds, active-device contrast, and a mobile-specific Controlly layout.
- Version the frontend URL again so Home Assistant and browsers cannot reuse the previous cached bundle.

## 0.2.0

- Fix domain filters whose cards remained visible because component CSS overrode the `hidden` attribute.
- Load Home Assistant users and groups automatically for administrators.
- Read groups from each Home Assistant user, matching the current authentication API.
- Add dashboard room editing: display name, background URL, and visibility.
- Add one-tap controls with live state indicators for lights and switches.
- Add pending and result feedback for dashboard commands.
- Use a versioned frontend URL to prevent an old cached JavaScript bundle after HACS updates.
- Correct the stored default view values for whole-home, floor, and area views.
