# Changelog

## 0.16.0

- Add the three selected room compositions to the graphical room editor:
  **C · Floating Islands**, **D · Control Deck**, and **E · Cinema Rail**.
- Give every preset a purpose-built desktop and phone layout while retaining
  live entity cards, category filtering, room cameras, and existing controls.
- Replace the former vertical-only room alignment behavior with true logical
  inline alignment: room name, temperature, status, and information align right
  in Hebrew RTL and left in English LTR.
- Add live preset previews, visual selection cards, per-room overrides, reset
  support, schema-8 persistence, and a legacy-layout migration to Control Deck.

## 0.15.1

- Rebuild the whole-home device surface as two distinct optical-glass frames:
  a darker outer background separator and a clearer inner rail with reflected
  light, saturation, blur, and subtle edge highlights.
- Replace opaque white active cards with translucent frosted glass while
  retaining a strong blue state glow and readable white controls.
- Add layered specular highlights, soft colored reflections, refined borders,
  and depth shadows to category and entity cards without blocking the selected
  background image.
- Reduce blur and spacing on phones while keeping the same glass hierarchy,
  card readability, horizontal navigation, and clean browser console output.

## 0.15.0

- Replace the fixed whole-home information row with a real 12-column graphical
  canvas. Administrators can place every widget by column and row, change its
  width and height, scale it, hide it, and choose physical right, center, or
  left content alignment.
- Add explicit Automatic, RTL, and LTR canvas-direction settings so Hebrew
  layouts begin on the right while English layouts begin on the left, without
  reversing numbers or directional controls.
- Add custom Home Assistant entity-state widgets with a selectable entity,
  editable label, graphical placement and sizing, and removal from the canvas.
- Restore a useful whole-home information height and rebalance the clock,
  weather, weekly portion, Shabbat, alarm, and activity-summary surfaces.
- Add compact phone and tablet canvas compositions that keep the complete home
  view readable without an internal information scrollbar or a broken narrow
  desktop grid.
- Migrate stored settings to schema 7 while retaining prior layout choices and
  automatically updating the former compact overview defaults.
- Verify the home screen and graphical editor at 1440x900, 1024x768, 390x844,
  and 360x800 in English and Hebrew RTL, including a saved custom entity widget
  and clean browser console output.

## 0.14.0

- Rebalance the whole-home screen so the information panel uses a deliberate,
  compact height and the device controls receive the remaining useful viewport
  space instead of leaving a large empty hero.
- Expand the graphical home editor with dashboard/focus information styles,
  grid/list activity layouts, navigation visibility, information columns,
  clock and inner spacing controls, category width, and separate desktop/phone
  device-card widths.
- Replace the long room-layout form with a graphical room-screen editor. It can
  edit global defaults or a specific Area against live desktop and phone
  previews, including header proportions, camera, overlay, content alignment,
  widget size, control spacing, and independent desktop/mobile card widths.
- Keep room names and visibility in a compact companion manager, add per-room
  layout reset, and persist the expanded configuration through schema 6.
- Refine the phone home and room proportions so weather, Shabbat information,
  alarms, live room context, and the swipeable controls remain readable without
  page-level horizontal or vertical overflow.
- Verify desktop and phone layouts at 1440×900 and 390×844 in English and Hebrew
  RTL, including live preview controls, room-specific persistence, schema
  migration, and clean browser console output.

## 0.13.0

- Rebuild the whole-home screen as three compact, independently ordered blocks
  for the overview, floor/Area navigation, and swipeable device rail. The new
  layout removes the oversized empty hero and keeps the working controls visible
  in one viewport on desktop, tablet, and phone.
- Add a visual whole-home editor with live desktop and phone previews, block
  reordering, activity-summary placement, logical clock alignment, and separate
  desktop/mobile sizing controls for the overview, device rail, and spacing.
- Add combined device-management filters for display category and Area alongside
  the existing name/entity search, including live result totals and support for
  unassigned devices.
- Correct Hebrew RTL alignment so the clock and information start on the physical
  right, prevent long clock strings from wrapping, and migrate existing schema-4
  layouts to the new logical-start default.
- Extend stored configuration to schema 5 and verify all user views, a room view,
  and all 11 management sections at 390×844 in Hebrew RTL, plus focused 360×800
  and 1440×900 regression checks with no page-level horizontal overflow.

## 0.12.1

- Refine the complete phone interface at 360–390 px with full-height touch
  targets, single-line scrollable filters, hidden internal scrollbars, and
  compact room-camera overlays.
- Keep 8, 12, and 16-camera views readable on phones with a two-column,
  internally scrolling live grid instead of undersized four-column tiles.
- Collapse device editors on phones while preserving the full expanded editor
  on desktop, reducing the initial mobile Devices page from dozens of long
  forms to a scannable list.
- Improve HVAC mode contrast and verify all home, floor, Area, room, camera,
  popup, and 11 management screens at 360×800 and 390×844 in English and
  Hebrew RTL, followed by a 1440×900 desktop regression check.

## 0.12.0

- Replace the ambiguous **Your home** block with a configurable **Activity
  overview** whose live category totals link directly to the matching device
  rail section.
- Add whole-home controls for activity-overview visibility, logical side,
  width, metric scale, visible categories, category order, information-widget
  scale, information order, and clock/information alignment.
- Add global and per-Area sizing for the room hero, control section, hero
  widgets, device-card width, and live camera window.
- Add an optional live camera overlay to each Area hero. It can automatically
  use the first camera assigned to the Area, select a specific camera per Area,
  inherit the global behavior, or be disabled.
- Extend stored configuration to schema 4 with deep-merged defaults so existing
  dashboards gain the new controls without losing their settings.
- Expand the local harness with an Area-assigned WebRTC camera and verify
  persistence, live stream mounting, activity shortcuts, desktop 1440×900,
  tablet 1024×768, phone 390×844, LTR, and Hebrew RTL layouts.

## 0.11.0

- Merge the whole-home floor selector and the selected floor's Areas into one
  compact horizontal navigation row on desktop, tablet, and mobile.
- Keep every available device category in one continuous home rail and
  synchronize the highlighted category tab while the user swipes or scrolls
  between category sections.
- Make category tabs direct rail navigation controls. In **Active** mode,
  categories with no active cards are omitted; **All** restores every available
  category.
- Add a live-preview administrator slider for rectangular whole-home card
  height, with a supported 110–260 px range and persisted schema-3 migration.
- Verify one-viewport layout and internal-only horizontal scrolling at 1440×900,
  1024×768, and 390×844 in both LTR and RTL layouts.

## 0.10.0

- Turn the desktop sidebar floor list into collapsible groups. A floor is now
  marked active whenever an activity-contributing entity in any child Area is
  active.
- Add manager controls for the default collapsed/expanded floor state and for
  remembering each browser's last expansion state.
- Replace the large whole-home room listing with a compact two-level floor and
  Area navigator so the **Active / All** selector and device rail remain in the
  first viewport.
- Rework home, Area, camera, and management layouts to remain inside one
  desktop, tablet, or mobile viewport. Dense controls use horizontal rails or
  an internal manager scroller.
- Give the camera center its own manager section and allow 4, 8, 12, or 16
  cameras to be selected as its saved default.
- Add whole-home alarm cards and administrator selection of which alarm panels
  appear, including alarm entities without a native Area.
- Make enabled weather visible even when no entity is found by showing a clear
  diagnostic, while preserving automatic `weather.*` discovery and explicit
  entity selection.
- Add independent multi-device category and display-Area bulk actions. Applying
  one bulk field preserves every unrelated override.
- Migrate stored configuration to schema 2 with deep-merged home, room, and
  floor-navigation defaults so upgrades preserve existing settings.
- Expand the local browser harness to two unassigned alarm panels and verify
  1440 px desktop, 1024 px tablet, 390 px mobile, English/RTL Hebrew, 4/16 camera
  grids, camera zoom, alarm and HVAC dialogs, bulk edits, floor-state memory,
  weather selection, and scroll/dropdown stability under rapid HA updates.

## 0.9.0

- Replace the featured-room home hero with a neutral date/time surface so an
  arbitrary Area can no longer become the main whole-home content.
- Add optional Home Assistant weather, weekly Torah portion, candle-lighting,
  and Havdalah entity data with automatic entity detection and administrator
  selectors.
- Group room navigation by floor, sort floors by level, and show live
  active/inactive status in the desktop sidebar and home room rail.
- Add a per-entity option that excludes a device from its Area activity result.
- Exclude entities without a native Home Assistant Area from the whole-home
  device surface.
- Add an administrator-only **No Area** manager with search, multi-selection,
  confirmation, and native Entity Registry `area_id` batch updates.
- Replace vertically stacked home categories with one horizontal, touch-ready
  device rail that continues across categories and switches between **Active**
  and **All** without changing page scroll position.
- Add configurable category order, Hebrew/English category names, and
  per-language action labels. Correct Hebrew actions to **הדלקה** and **כיבוי**.
- Add rectangular, square, and circular entity layouts plus global text and icon
  scale controls.
- Replace fragile Unicode navigation and domain symbols with a consistent inline
  SVG icon set and correct full RTL alignment of the Hebrew sidebar.
- Split management into nine focused sections instead of one long page.
- Add rich Area headers with configurable image, temperature, general
  information, and top/bottom control placement. Area filter buttons now include
  only categories that actually exist in that room.
- Extend the local browser harness with weather and Jewish Calendar sensors,
  Area temperature/humidity, native unassigned entities, and a simulated native
  registry assignment endpoint.
- Verify desktop and 390 px mobile layouts, RTL alignment, horizontal-only device
  scrolling, state-update scroll stability, dropdown stability, settings
  persistence, activity exclusions, native batch assignment, room display
  options, category customization, HVAC payloads, and WebRTC camera zoom.

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
