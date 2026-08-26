import assert from "node:assert/strict";

globalThis.HTMLElement = class {
  attachShadow() {
    this.shadowRoot = {
      addEventListener() {},
      querySelector() { return null; },
      querySelectorAll() { return []; },
    };
    return this.shadowRoot;
  }
};

const registry = new Map();
globalThis.customElements = {
  define(name, constructor) { registry.set(name, constructor); },
  get(name) { return registry.get(name); },
};
globalThis.window = globalThis;
globalThis.CSS = { escape: value => String(value) };

await import("../custom_components/smplwise_ha_dashboard/frontend/smplwise-ha-dashboard.js?card-style-smoke");

const Dashboard = customElements.get("smplwise-ha-dashboard-panel");
assert.ok(Dashboard, "dashboard custom element should be registered");

const dashboard = new Dashboard();
dashboard._boot = {
  config: {
    config_schema_version: 12,
    language: "he",
    theme: "controlly",
    default_view: "home",
    text_scale: 1,
    icon_scale: 1,
    entity_card_shape: "rectangle",
    entity_card_height: 158,
    entity_card_style: "luminous_frost",
    entity_card_color_mode: "dynamic",
    desktop_card_size: "standard",
    mobile_card_size: "compact",
    entity_overrides: {},
    category_settings: {},
  },
  user: { id: "admin", name: "Admin", is_admin: true, groups: [] },
  areas: [],
  floors: [],
};
dashboard._hass = { states: {}, language: "he" };
dashboard._entityRegistry = [];
dashboard._deviceRegistry = [];
dashboard._entityRegistryById = new Map();
dashboard._deviceRegistryById = new Map();

const styles = [
  "luminous_frost",
  "neon_rim",
  "split_command",
  "ambient_wash",
  "physical_toggle",
  "high_contrast",
  "halo_orb",
  "instrument_ring",
  "light_spine",
  "lucid_minimal",
];

assert.deepEqual(dashboard._cardVisualConfig().styles, styles);
assert.deepEqual(dashboard._cardVisualConfig().colorModes, ["dynamic", "category", "signature"]);
assert.equal(dashboard._cardVisualConfig().colorMode, "dynamic");

for (const style of styles) {
  for (const desktopSize of ["compact", "standard", "large"]) {
    for (const mobileSize of ["compact", "standard", "large"]) {
      dashboard._boot.config.entity_card_style = style;
      dashboard._boot.config.desktop_card_size = desktopSize;
      dashboard._boot.config.mobile_card_size = mobileSize;
      const config = dashboard._cardVisualConfig();
      assert.equal(config.style, style);
      assert.equal(config.desktopSize, desktopSize);
      assert.equal(config.mobileSize, mobileSize);
    }
  }
}

dashboard._boot.config.entity_card_style = "neon_rim";
dashboard._boot.config.desktop_card_size = "compact";
const editor = dashboard._themeSettingHtml();
assert.equal((editor.match(/data-card-style-choice=/g) || []).length, 10);
assert.match(editor, /name="entityCardStyle" value="neon_rim" checked/);
assert.match(editor, /id="cfgDesktopCardSize"/);
assert.match(editor, /id="cfgMobileCardSize"/);
assert.match(editor, /id="cfgCardColorMode"/);

const offLight = {
  entity_id: "light.table",
  state: "off",
  attributes: { friendly_name: "מנורת שולחן" },
};
const onLight = { ...offLight, state: "on" };
dashboard._hass.states[offLight.entity_id] = offLight;
const offCard = dashboard._entityCardHtml(offLight);
const onCard = dashboard._entityCardHtml(onLight);
assert.match(offCard, /category-light/);
assert.match(offCard, /entityStateWord">כבוי/);
assert.match(onCard, /class="entity entityDesigned category-light domain-light[^\"]* on/);
assert.match(onCard, /entityStateWord">פועל/);
assert.match(onCard, /class="entityVisual"/);
assert.match(onCard, /class="entityGauge"/);
assert.match(onCard, /class="entityMetric"/);
assert.match(onCard, /class="quickIcon"/);
assert.match(onCard, /class="quickLabel"/);
for (const part of ["entityDesignLayer", "designSheen", "designRim", "designSplit", "designOrb", "designScale", "designNeedle", "designToggle", "designSpine"]) assert.match(onCard, new RegExp(`class="${part}`));
assert.equal(dashboard._dir(), "rtl");

const coloredLight = { ...onLight, attributes: { ...onLight.attributes, rgb_color: [20, 120, 240] } };
assert.deepEqual(dashboard._entityAccent(coloredLight), { rgb: "20,120,240", alt: "255,241,198" });
assert.match(dashboard._entityCardHtml(coloredLight), /--entity-accent:20,120,240/);
const heating = { entity_id: "climate.heating", state: "heat", attributes: { friendly_name: "Heating" } };
const cooling = { entity_id: "climate.cooling", state: "cool", attributes: { friendly_name: "Cooling" } };
assert.notEqual(dashboard._entityAccent(heating).rgb, dashboard._entityAccent(cooling).rgb);
const alarmTriggered = { entity_id: "alarm_control_panel.home", state: "triggered", attributes: {} };
const alarmDisarmed = { ...alarmTriggered, state: "disarmed" };
assert.notEqual(dashboard._entityAccent(alarmTriggered).rgb, dashboard._entityAccent(alarmDisarmed).rgb);

dashboard._boot.config.language = "en";
assert.equal(dashboard._dir(), "ltr");
assert.match(dashboard._entityCardHtml(onLight), /entityStateWord">On/);
dashboard._boot.config.language = "he";

dashboard._boot.config.theme = "controlly";
dashboard._render();
assert.match(dashboard.shadowRoot.innerHTML, /app themeControlly themeGlass/);
dashboard._boot.config.theme = "smplwise";
dashboard._render();
assert.match(dashboard.shadowRoot.innerHTML, /app themeControlly themeSmplwise/);
dashboard._boot.config.theme = "controlly";

const css = dashboard._styles();
for (const style of styles) assert.ok(css.includes(`cardStyle-${style}`));
for (const marker of [
  "Isolated device-card fidelity layer",
  "entityDesignLayer",
  "cardColor-dynamic",
  "cameraZoomSurface.zoomed",
  "mobileHomeVertical .homeDeviceRail .entityDesigned",
  "themeControlly.themeSmplwise",
  "panelMode::before{position:fixed",
  ".themeControlly.panelMode .mobileNav,.themeControlly.cardMode .mobileNav{position:fixed!important",
  "overscroll-behavior-y:contain",
  "@container home-overview",
  "grid-auto-rows:minmax(150px,auto)",
  "var(--home-mobile-overview-min,250px)",
  "var(--room-mobile-hero-height,278px)",
  "aspect-ratio:auto!important",
  "-webkit-mask:radial-gradient",
  "position:static!important;min-width:0!important;height:auto!important",
  "Room experience v2",
  "roomHeroSummary",
  "roomControlToolbar",
  "roomRailButtons",
  "var(--room-floating-controls,44%)",
  "var(--room-cinema-controls,40%)",
  "roomPreviewV2",
  "roomPreviewSummary",
  "roomPreviewCategories",
  "--room-preview-floating-controls",
  "scroll-margin-block-start:84px",
  "calc(100dvh - 158px)",
]) assert.ok(css.includes(marker), `missing CSS regression marker: ${marker}`);
assert.ok(String(dashboard.connectedCallback).includes('window.addEventListener("scroll",this._windowScrollHandler,{passive:true,capture:true})'), "card-mode room scroll listener should capture the external document scroller");
for (const size of ["compact", "standard", "large"]) {
  if (size !== "standard") {
    assert.ok(css.includes(`cardDesktop-${size}`));
    assert.ok(css.includes(`cardMobile-${size}`));
  }
}

const roomArea = { id: "living", name: "סלון", floor_id: "ground" };
const roomStates = [
  { entity_id: "light.table", state: "on", attributes: { friendly_name: "מנורת שולחן", brightness: 210 } },
  { entity_id: "switch.fan", state: "off", attributes: { friendly_name: "מאוורר" } },
  { entity_id: "climate.living", state: "cool", attributes: { friendly_name: "מיזוג סלון", temperature: 23, current_temperature: 24.1 } },
  { entity_id: "cover.window", state: "open", attributes: { friendly_name: "תריס חלון", current_position: 70 } },
];
dashboard._boot.areas = [roomArea];
dashboard._boot.floors = [{ id: "ground", name: "קומת כניסה" }];
dashboard._hass.states = Object.fromEntries(roomStates.map(state => [state.entity_id, state]));
dashboard._hass.config = { unit_system: { temperature: "°C" } };
dashboard._entityRegistry = roomStates.map(state => ({ entity_id: state.entity_id, area_id: roomArea.id }));
dashboard._deviceRegistry = [];
dashboard._indexRegistries();
dashboard._filter = "light";
const roomHtml = dashboard._areaViewHtml(roomArea);
for (const marker of ["roomExperience", "roomHeroSummary", "roomControlToolbar", 'data-room-filter="all"', 'data-room-scroll="previous"', 'data-room-scroll="next"']) assert.ok(roomHtml.includes(marker), `missing room markup marker: ${marker}`);
for (const category of ["light", "switch", "climate", "cover"]) assert.ok(roomHtml.includes(`data-category-section="${category}"`), `room rail omitted ${category} while another filter was active`);
assert.match(roomHtml, /--room-overlay-soft:/);

dashboard._settingsSection = "rooms";
dashboard._roomEditorArea = roomArea.id;
dashboard._roomPreviewDevice = "mobile";
const roomEditorHtml = dashboard._roomSettingsHtml();
for (const marker of ["roomPreviewV2", "roomPreviewSummary", "roomPreviewCategories", 'data-device="mobile"', "--room-preview-floating-controls", "--room-preview-cinema-controls"]) assert.ok(roomEditorHtml.includes(marker), `room editor preview omitted ${marker}`);
assert.match(roomEditorHtml, /data-room-preview-temperature/);
assert.match(roomEditorHtml, /data-room-preview-info/);
assert.match(roomEditorHtml, /class="active" aria-pressed="true" data-room-preview-device="mobile"/);
assert.match(roomEditorHtml, /class="" aria-pressed="false" data-room-preview-device="desktop"/);

console.log("card style smoke tests passed: 10 styles × 3 desktop sizes × 3 phone sizes");
