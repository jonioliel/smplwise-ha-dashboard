import assert from "node:assert/strict";

const countMatches = (value, expression) => (String(value).match(expression) || []).length;
const cssRule = (source, selector, occurrence = "last") => {
  const token = `${selector}{`;
  const start = occurrence === "first" ? source.indexOf(token) : source.lastIndexOf(token);
  assert.notEqual(start, -1, `missing CSS selector: ${selector}`);
  const bodyStart = start + token.length;
  const end = source.indexOf("}", bodyStart);
  assert.notEqual(end, -1, `unterminated CSS selector: ${selector}`);
  return source.slice(bodyStart, end);
};
const cssNumber = (body, property, unit) => {
  const match = body.match(new RegExp(`${property}:([0-9.]+)${unit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  assert.ok(match, `missing ${property} in CSS rule: ${body}`);
  return Number(match[1]);
};

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
    config_schema_version: 13,
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

const homePresets = [
  "home_os",
  "bento",
  "live_focus",
  "floor_lens",
  "spatial",
  "signal",
  "calm",
  "room_mosaic",
  "day_flow",
  "modular_pro",
];
const homePresetMarkers = {
  home_os: "homeOverviewBlock",
  bento: "homeBentoCanvas",
  live_focus: "homeLiveFocusCanvas",
  floor_lens: "homeFloorLens",
  spatial: "homeSpatialCanvas",
  signal: "homeSignalCanvas",
  calm: "homeCalmCanvas",
  room_mosaic: "homeRoomMosaic",
  day_flow: "homeDayFlowCanvas",
  modular_pro: "homeModularCanvas",
};
for (const preset of homePresets) {
  dashboard._boot.config.home_layout = { layout_preset: preset };
  const layout = dashboard._homeLayoutConfig();
  assert.equal(layout.layout_preset, preset, `${preset}: runtime should retain the selected home composition`);
  const html = dashboard._controllyHomeHtml([], 0);
  assert.match(html, new RegExp(`homePreset-${preset}`), `${preset}: runtime wrapper is missing`);
  assert.ok(html.includes(homePresetMarkers[preset]), `${preset}: unique composition markup is missing`);
}
for (const [legacy, expected] of Object.entries({ control: "home_os", rooms: "room_mosaic", briefing: "calm", split: "signal", scenes: "spatial" })) {
  dashboard._boot.config.home_layout = { layout_preset: legacy };
  assert.equal(dashboard._homeLayoutConfig().layout_preset, expected, `${legacy}: legacy composition should migrate safely`);
}
dashboard._boot.config.home_layout = { layout_preset: "home_os" };
dashboard._boot.config.floor_navigation = {};
assert.equal(dashboard._floorNavigationConfig().show_sidebar_floors, false, "floor tree should be hidden by default");
const homeEditor = dashboard._homeInfoSettingHtml();
assert.equal((homeEditor.match(/name="homeLayoutPreset"/g) || []).length, 10, "home editor should expose all ten compositions");
for (const preset of homePresets) assert.match(homeEditor, new RegExp(`value="${preset}"`), `${preset}: home editor option is missing`);

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
assert.match(onCard, /class="[^"]*\bentityStyle-neon_rim\b[^"]*\bcategory-light\b[^"]*\bon\b/);
assert.match(onCard, /entityStateWord">פועל/);
assert.match(onCard, /class="entityVisual"/);
assert.match(onCard, /class="entityGauge"/);
assert.match(onCard, /class="entityMetric"/);
assert.match(onCard, /class="quickIcon"/);
assert.match(onCard, /class="quickLabel"/);
assert.match(onCard, /class="entityMetric" hidden><\/span>/);
assert.match(onCard, /class="entityStateLabel" hidden><\/small>/);
assert.doesNotMatch(onCard.match(/^<article class="[^"]+"/)?.[0] || "", /\bhasMetric\b|\bhasSecondary\b/);
assert.equal(countMatches(onCard, />פועל</g), 1, "binary state should appear once in the top status chip");
for (const part of ["entityDesignLayer", "designSheen", "designRim", "designSplit", "designOrb", "designScale", "designNeedle", "designToggle", "designSpine"]) assert.match(onCard, new RegExp(`class="${part}`));
assert.equal(dashboard._dir(), "rtl");

const idleClimate = {
  entity_id: "climate.bedroom",
  state: "cool",
  attributes: { friendly_name: "מיזוג חדר שינה", hvac_action: "idle", temperature: 22 },
};
const coolingClimate = {
  ...idleClimate,
  entity_id: "climate.living_room",
  attributes: { ...idleClimate.attributes, friendly_name: "מיזוג סלון", hvac_action: "cooling" },
};
const pausedPlayer = {
  entity_id: "media_player.television",
  state: "paused",
  attributes: { friendly_name: "טלוויזיה" },
};
assert.equal(dashboard._homeEntityVisible(idleClimate), false, "a climate entity in idle must not be treated as active");
assert.equal(dashboard._homeEntityVisible(coolingClimate), true, "a climate entity that is actually cooling must be active");
assert.equal(dashboard._homeEntityVisible(pausedPlayer), true, "a paused media session should remain active");
assert.match(dashboard._entityCardHtml(idleClimate, { activeOnly: true }), /data-active-visible="false"[^>]*style="[^"]*display:none"[^>]*data-active-only[^>]*hidden/);
assert.doesNotMatch(dashboard._entityCardHtml(idleClimate), /\bon\b/);
assert.match(dashboard._entityCardHtml(coolingClimate), /class="[^"]*\bon\b/);
dashboard._homeDeviceMode = "active";
const activeClimateRail = dashboard._homeDeviceRailHtml([idleClimate, coolingClimate]);
assert.match(activeClimateRail, /class="homeDeviceRail activeOnly"/);
assert.match(activeClimateRail, /data-category-count>1</);
assert.match(activeClimateRail, /data-entity-card="climate\.bedroom"[^>]*display:none[^>]*hidden/);

const languageFixtures = {
  he: {
    name: "מנורת התקרה המרכזית הארוכה במיוחד במסדרון הכניסה הראשי",
    onWord: "פועל",
    offWord: "כבוי",
    turnOn: "הדלקה",
    turnOff: "כיבוי",
    dir: "rtl",
  },
  en: {
    name: "Extra long central ceiling light in the main entrance corridor",
    onWord: "On",
    offWord: "Off",
    turnOn: "Turn on",
    turnOff: "Turn off",
    dir: "ltr",
  },
};

const assertDeviceCardContract = (html, { on, fixture, matrixLabel, style }) => {
  const classMatch = html.match(/^<article class="([^"]+)"/);
  assert.ok(classMatch, `${matrixLabel}: card root should be an article`);
  const classes = new Set(classMatch[1].trim().split(/\s+/));
  assert.equal(classes.has("on"), on, `${matrixLabel}: root on class should track HA state`);
  assert.ok(classes.has(`entityStyle-${style}`), `${matrixLabel}: card root must carry its own style identity`);
  assert.equal(countMatches(html, /<button\b/g), 2, `${matrixLabel}: a light card should expose main and quick buttons only`);
  for (const className of ["entityDesignLayer", "entityMain", "entityTop", "entityVisual", "entityCopy", "entityMetric", "quick", "quickIcon", "quickLabel"]) {
    assert.equal(countMatches(html, new RegExp(`class="${className}"`, "g")), 1, `${matrixLabel}: ${className} should occur exactly once`);
  }
  for (const className of ["designSheen", "designRim", "designSplit", "designOrb", "designScale", "designNeedle", "designToggle", "designSpine"]) {
    assert.equal(countMatches(html, new RegExp(`class="${className}`, "g")), 1, `${matrixLabel}: ${className} layer should occur exactly once`);
  }

  const designIndex = html.indexOf('class="entityDesignLayer"');
  const mainIndex = html.indexOf('class="entityMain"');
  const copyIndex = html.indexOf('class="entityCopy"');
  const nameIndex = html.indexOf(fixture.name);
  const mainCloseIndex = html.indexOf("</button>", mainIndex);
  const quickIndex = html.indexOf('class="quick"');
  assert.ok(designIndex < mainIndex, `${matrixLabel}: decoration must stay behind the main button`);
  assert.ok(mainIndex < copyIndex && copyIndex < nameIndex && nameIndex < mainCloseIndex, `${matrixLabel}: device name must remain inside the main-button copy block`);
  assert.ok(mainCloseIndex < quickIndex, `${matrixLabel}: quick action must be a sibling, not nested inside the main button`);
  assert.ok(html.includes(`</button><button class="quick"`), `${matrixLabel}: main and quick controls should be adjacent siblings`);

  const stateWord = on ? fixture.onWord : fixture.offWord;
  const action = on ? fixture.turnOff : fixture.turnOn;
  assert.ok(html.includes(`<span class="entityStateWord">${stateWord}</span>`), `${matrixLabel}: localized state label is misplaced or missing`);
  assert.ok(html.includes(`<span class="quickLabel">${action}</span>`), `${matrixLabel}: localized action label is misplaced or missing`);
  assert.ok(html.includes(`aria-label="${action}"`), `${matrixLabel}: quick action needs the same accessible label as its visible label`);
  assert.ok(html.includes(`aria-pressed="${on}"`), `${matrixLabel}: quick action pressed state should match HA state`);

  const metric = html.match(/<span class="entityMetric"([^>]*)>([^<]*)<\/span>/);
  assert.ok(metric, `${matrixLabel}: metric slot should remain structurally stable`);
  assert.equal(classes.has("hasMetric"), on, `${matrixLabel}: only the active dimmable-light fixture should reserve metric geometry`);
  assert.equal(/\bhidden\b/.test(metric[1]), !on, `${matrixLabel}: an empty binary metric must be hidden`);
  assert.equal(metric[2], on ? "85%" : "", `${matrixLabel}: metric must add information instead of repeating state`);
  const secondary = html.match(/<small class="entityStateLabel"([^>]*)>([^<]*)<\/small>/);
  assert.ok(secondary && /\bhidden\b/.test(secondary[1]) && secondary[2] === "", `${matrixLabel}: binary secondary state must not duplicate the primary state word`);
  assert.equal(classes.has("hasSecondary"), false, `${matrixLabel}: binary cards should not reserve secondary-state geometry`);

  const visual = html.match(/--entity-level:([0-9.]+);--entity-angle:([0-9.]+)deg/);
  assert.ok(visual, `${matrixLabel}: bounded visual level and angle should be present`);
  const level = Number(visual[1]);
  const angle = Number(visual[2]);
  assert.ok(level >= 0 && level <= 100, `${matrixLabel}: visual level ${level} is outside 0..100`);
  assert.ok(angle >= 0 && angle <= 360, `${matrixLabel}: visual angle ${angle} is outside 0..360`);
};

let exhaustiveCardCases = 0;
for (const style of styles) {
  for (const desktopSize of ["compact", "standard", "large"]) {
    for (const mobileSize of ["compact", "standard", "large"]) {
      for (const [language, fixture] of Object.entries(languageFixtures)) {
        dashboard._boot.config.entity_card_style = style;
        dashboard._boot.config.desktop_card_size = desktopSize;
        dashboard._boot.config.mobile_card_size = mobileSize;
        dashboard._boot.config.language = language;
        dashboard._hass.language = language;
        dashboard._render();
        const appOpening = dashboard.shadowRoot.innerHTML.match(/<div class="([^"]*\bapp\b[^"]*)"[^>]*>/);
        assert.ok(appOpening, `${style}/${desktopSize}/${mobileSize}/${language}: rendered app wrapper is missing`);
        const appClassTokens = appOpening[1].split(/\s+/);
        for (const token of [`selectedCardStyle-${style}`, `cardDesktop-${desktopSize}`, `cardMobile-${mobileSize}`]) {
          assert.ok(appClassTokens.includes(token), `${style}/${desktopSize}/${mobileSize}/${language}: wrapper omitted ${token}`);
        }
        assert.equal(appClassTokens.some(token => token.startsWith("cardStyle-")), false, `${style}/${desktopSize}/${mobileSize}/${language}: selected style must not leak through a global cardStyle-* wrapper class`);
        assert.ok(appOpening[0].includes(`data-card-style="${style}"`), `${style}/${desktopSize}/${mobileSize}/${language}: wrapper omitted the selected-style data contract`);
        assert.ok(dashboard.shadowRoot.innerHTML.includes(`dir="${fixture.dir}"`), `${style}/${desktopSize}/${mobileSize}/${language}: rendered direction is wrong`);

        for (const on of [false, true]) {
          const state = {
            entity_id: `light.matrix_${language}_${on ? "on" : "off"}`,
            state: on ? "on" : "off",
            attributes: { friendly_name: fixture.name, brightness: 217 },
          };
          assertDeviceCardContract(dashboard._entityCardHtml(state), {
            on,
            fixture,
            style,
            matrixLabel: `${style}/${desktopSize}/${mobileSize}/${language}/${state.state}`,
          });
          exhaustiveCardCases += 1;
        }
      }
    }
  }
}
assert.equal(exhaustiveCardCases, styles.length * 3 * 3 * 2 * 2, "full style × desktop size × mobile size × language × state matrix should run");
dashboard._boot.config.language = "he";
dashboard._hass.language = "he";
dashboard._boot.config.entity_card_style = "neon_rim";
dashboard._boot.config.desktop_card_size = "compact";
dashboard._boot.config.mobile_card_size = "compact";
for (const style of styles) {
  const explicitlyStyled = dashboard._entityCardHtml(onLight, { style });
  assert.match(explicitlyStyled, new RegExp(`^<article class="[^"]*\\bentityStyle-${style}\\b`), `${style}: explicit per-card style should reach runtime markup`);
  const explicitRootClasses = (explicitlyStyled.match(/^<article class="([^"]+)"/) || [])[1]?.split(/\s+/) || [];
  assert.deepEqual(explicitRootClasses.filter(token => token.startsWith("entityStyle-")), [`entityStyle-${style}`], `${style}: runtime card must carry exactly one isolated style class`);
}
assert.match(dashboard._entityCardHtml(onLight, { style: "not_a_style" }), /^<article class="[^"]*\bentityStyle-neon_rim\b/, "unknown per-card style should safely fall back to configured style");

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
for (const style of styles) assert.ok(css.includes(`entityStyle-${style}`), `${style}: per-card style selector is missing`);
for (const marker of [
  "Device card fidelity v3",
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

const roomMarker = "/* Room experience v2";
const fidelityV3Marker = "/* Device card fidelity v3";
const roomStart = css.indexOf(roomMarker);
const fidelityV3Start = css.lastIndexOf(fidelityV3Marker);
assert.ok(roomStart >= 0 && fidelityV3Start > roomStart, "device-card fidelity v3 must be the final card cascade layer after room v2");
const roomV2Css = css.slice(roomStart, fidelityV3Start);
const fidelityV3Css = css.slice(fidelityV3Start);

const baseCardRule = cssRule(fidelityV3Css, ".themeControlly .entityDesigned", "first");
for (const declaration of ["box-sizing:border-box!important", "position:relative!important", "isolation:isolate!important", "overflow:hidden!important", "min-inline-size:0!important", "display:grid!important", "text-align:start!important"]) {
  assert.ok(baseCardRule.includes(declaration), `v3 base card geometry is missing ${declaration}`);
}
const designLayerRule = cssRule(fidelityV3Css, ".themeControlly .entityDesigned .entityDesignLayer", "first");
assert.ok(designLayerRule.includes("position:absolute!important") && designLayerRule.includes("z-index:1!important") && designLayerRule.includes("overflow:hidden!important") && designLayerRule.includes("pointer-events:none!important"), "v3 visual layers must stay clipped and non-interactive behind controls");
const mainButtonRule = cssRule(fidelityV3Css, ".themeControlly .entityDesigned .entityMain", "first");
for (const declaration of ["z-index:2!important", "box-sizing:border-box!important", "width:100%!important", "height:100%!important", "min-width:0!important", "min-height:0!important", "display:grid!important", "text-align:start!important"]) {
  assert.ok(mainButtonRule.includes(declaration), `v3 main-button geometry is missing ${declaration}`);
}
const quickButtonRule = cssRule(fidelityV3Css, ".themeControlly .entityDesigned .quick", "first");
assert.ok(quickButtonRule.includes("z-index:3!important") && quickButtonRule.includes("display:flex!important"), "v3 quick control must sit above decoration and remain a real layout item");
assert.equal(cssNumber(quickButtonRule, "height", "px"), 44, "v3 quick action must be exactly one 44px control row");
assert.ok(cssNumber(quickButtonRule, "min-width", "px") >= 44 && cssNumber(quickButtonRule, "min-height", "px") >= 44, "v3 quick action needs a 44×44px touch target");
assert.ok(cssNumber(quickButtonRule, "font-size", "px") <= 14, "quick-action text must stay subordinate to the device name");

const copyRule = cssRule(fidelityV3Css, ".themeControlly .entityDesigned .entityCopy", "first");
assert.ok(copyRule.includes("min-width:0!important") && copyRule.includes("width:100%!important") && copyRule.includes("text-align:start!important") && copyRule.includes("overflow:hidden!important"), "v3 copy column must shrink, clip, and follow logical reading direction");
const nameRule = cssRule(fidelityV3Css, ".themeControlly .entityDesigned .entityCopy b", "first");
for (const declaration of ["overflow:hidden!important", "text-overflow:ellipsis!important", "white-space:normal!important", "-webkit-line-clamp:2!important"]) assert.ok(nameRule.includes(declaration), `device name is missing ${declaration}`);
for (const selector of [".themeControlly .entityDesigned .entityCategoryName", ".themeControlly .entityDesigned .entityStateWord", ".themeControlly .entityDesigned .entityStateLabel", ".themeControlly .entityDesigned .entityControlPreview strong"]) {
  const body = cssRule(fidelityV3Css, selector, "first");
  for (const declaration of ["overflow:hidden!important", "text-overflow:ellipsis!important", "white-space:nowrap!important"]) assert.ok(body.includes(declaration), `${selector} must safely clip long content with ${declaration}`);
}
assert.ok(cssNumber(baseCardRule, "--f-title-size", "px") <= 17, "base device name token must remain readable without becoming oversized");
assert.ok(cssNumber(baseCardRule, "--f-metric-size", "px") <= 30, "base metric token must remain bounded");
assert.ok(cssNumber(cssRule(fidelityV3Css, ".themeControlly .entityDesigned .entityStateWord", "first"), "font-size", "px") <= 12, "primary state text should remain compact");
assert.ok(cssNumber(cssRule(fidelityV3Css, ".themeControlly .entityDesigned .entityStateLabel", "first"), "font-size", "px") <= 12, "secondary state text should remain compact");
assert.ok(cssRule(fidelityV3Css, ".themeControlly .entityDesigned .entityMetric[hidden],.themeControlly .entityDesigned .entityStateLabel[hidden]", "first").includes("display:none!important"), "empty metric and secondary slots must collapse instead of leaving duplicate-state gaps");
const litCardRule = cssRule(fidelityV3Css, ".themeControlly .entityDesigned.on", "first");
assert.ok(litCardRule.includes("border-color:rgba(var(--resolved-accent)") && litCardRule.includes("box-shadow:"), "v3 on cards need both an accent border and visible light bloom");

const styleContracts = {
  luminous_frost: [".themeControlly .entityStyle-luminous_frost .designSheen{display:block!important", ".themeControlly .entityStyle-luminous_frost.on .designSheen{"],
  neon_rim: [".themeControlly .entityStyle-neon_rim .designRim{display:block!important", ".themeControlly .entityStyle-neon_rim.on .designRim{"],
  split_command: [".themeControlly .entityStyle-split_command .designSplit{display:block!important", ".themeControlly .entityStyle-split_command.on .designSplit{"],
  ambient_wash: [".themeControlly .entityStyle-ambient_wash .designSheen{display:block!important", ".themeControlly .entityStyle-ambient_wash.on{"],
  physical_toggle: [".themeControlly .entityStyle-physical_toggle .designToggle{display:flex!important", ".themeControlly .entityStyle-physical_toggle.on .designToggle>i{"],
  high_contrast: [".themeControlly .entityStyle-high_contrast .entityGauge{", ".themeControlly .entityStyle-high_contrast.on{"],
  halo_orb: [".themeControlly .entityStyle-halo_orb .designOrb{display:block!important", ".themeControlly .entityStyle-halo_orb.on .designOrb{"],
  instrument_ring: [".themeControlly .entityStyle-instrument_ring .designScale{display:block!important", ".themeControlly .entityStyle-instrument_ring .designNeedle{display:block!important"],
  light_spine: [".themeControlly .entityStyle-light_spine .designSpine{display:block!important", ".themeControlly .entityStyle-light_spine.on .designSpine{"],
  lucid_minimal: [".themeControlly .entityStyle-lucid_minimal .designSheen{display:block!important", ".themeControlly .entityStyle-lucid_minimal.on .designSheen{"],
};
for (const style of styles) {
  assert.ok(fidelityV3Css.includes(`.themeControlly.cardColor-signature .entityStyle-${style}{`), `${style}: v3 signature color token is missing`);
  assert.ok(fidelityV3Css.includes(`.themeControlly .entityStyle-${style}{`), `${style}: v3 per-card style surface is missing`);
  assert.equal(fidelityV3Css.includes(`.cardStyle-${style} .entityDesigned`), false, `${style}: v3 styling must not depend on a global selected-style wrapper`);
  for (const contract of styleContracts[style]) assert.ok(fidelityV3Css.includes(contract), `${style}: missing distinct v3 visual contract ${contract}`);

  dashboard._boot.config.entity_card_style = style;
  const styleEditor = dashboard._themeSettingHtml();
  assert.match(styleEditor, new RegExp(`name="entityCardStyle" value="${style}" checked`), `${style}: editor selection should match runtime config`);
  assert.equal(countMatches(styleEditor, /previewEntity/g), styles.length * 2, `${style}: every editor choice should show one on and one off card`);
  assert.equal(countMatches(styleEditor, /class="entityDesignLayer"/g), styles.length * 2, `${style}: editor previews should use the production design-layer anatomy`);
  assert.equal(countMatches(styleEditor, /--entity-level:82/g), styles.length, `${style}: every editor choice should include an on-state preview`);
  assert.equal(countMatches(styleEditor, /--entity-level:0/g), styles.length, `${style}: every editor choice should include an off-state preview`);
  for (const previewStyle of styles) {
    assert.equal(countMatches(styleEditor, new RegExp(`\\bentityStyle-${previewStyle}\\b`, "g")), 2, `${style}: ${previewStyle} previews must carry their own production style class`);
    const choiceStart = styleEditor.indexOf(`data-card-style-choice="${previewStyle}"`);
    const nextChoice = styleEditor.indexOf('data-card-style-choice="', choiceStart + 1);
    assert.ok(choiceStart >= 0, `${style}: editor choice for ${previewStyle} is missing`);
    const choiceHtml = styleEditor.slice(choiceStart, nextChoice >= 0 ? nextChoice : styleEditor.length);
    assert.equal(countMatches(choiceHtml, new RegExp(`\\bentityStyle-${previewStyle}\\b`, "g")), 2, `${style}: ${previewStyle} choice must own exactly its on/off preview pair`);
    for (const otherStyle of styles.filter(candidate => candidate !== previewStyle)) {
      assert.equal(countMatches(choiceHtml, new RegExp(`\\bentityStyle-${otherStyle}\\b`, "g")), 0, `${style}: ${previewStyle} choice leaked ${otherStyle} into its previews`);
    }
  }
}
dashboard._boot.config.entity_card_style = "neon_rim";

assert.ok(fidelityV3Css.includes('.themeControlly[dir="rtl"] .entityDesigned .entityCopy{align-items:flex-end!important;text-align:right!important'), "v3 RTL card copy must be explicitly right aligned");
assert.ok(fidelityV3Css.includes('.themeControlly[dir="ltr"] .entityDesigned .entityCopy{align-items:flex-start!important;text-align:left!important'), "v3 LTR card copy must be explicitly left aligned");
const spineRule = cssRule(fidelityV3Css, ".themeControlly .entityStyle-light_spine .designSpine", "first");
assert.ok(spineRule.includes("inset-inline-start:") && !/(^|;)left:|(^|;)right:/.test(spineRule), "light spine must use a logical edge in RTL and LTR");
assert.ok(fidelityV3Css.includes('.themeControlly[dir="rtl"] .entityStyle-physical_toggle.on .designToggle>i{transform:translateX(-34px)!important'), "physical toggle needs a mirrored RTL on-state transform");

const desktopBreakpoint = Number((fidelityV3Css.match(/@media\(min-width:(901)px\)/) || [])[1]);
const mobileBreakpoint = Number((fidelityV3Css.match(/@media\(max-width:(900)px\)/) || [])[1]);
assert.equal(mobileBreakpoint + 1, desktopBreakpoint, "v3 mobile and desktop card media queries must meet without a width gap");
for (const width of [899, 900, 901, 902]) {
  const mobileMatches = width <= mobileBreakpoint;
  const desktopMatches = width >= desktopBreakpoint;
  assert.notEqual(mobileMatches, desktopMatches, `${width}px must resolve to exactly one primary v3 card breakpoint`);
}

const desktopHeights = {
  compact: cssNumber(cssRule(fidelityV3Css, ".themeControlly.cardDesktop-compact .entityDesigned:not(.previewEntity)", "first"), "min-height", "px"),
  standard: cssNumber(cssRule(fidelityV3Css, ".themeControlly.cardDesktop-standard .entityDesigned:not(.previewEntity)", "first"), "min-height", "px"),
  large: cssNumber(cssRule(fidelityV3Css, ".themeControlly.cardDesktop-large .entityDesigned:not(.previewEntity)", "first"), "min-height", "px"),
};
assert.deepEqual(desktopHeights, { compact: 176, standard: 216, large: 252 }, "desktop v3 size presets should have one deterministic geometry scale");
const expectedMobileHeights = { compact: 176, standard: 204, large: 236 };
const mobileHeights = {};
for (const [size, expectedHeight] of Object.entries(expectedMobileHeights)) {
  const selector = `.themeControlly.cardMobile-${size} .entityDesigned:not(.previewEntity)`;
  const sizeRule = cssRule(fidelityV3Css, selector, "first");
  assert.ok(sizeRule.includes("width:100%!important") && sizeRule.includes("min-width:0!important"), `${size}: phone cards must release desktop fixed width geometry`);
  for (const property of ["height", "min-height", "max-height"]) {
    assert.equal(cssNumber(sizeRule, property, "px"), expectedHeight, `${size}: phone cards should use the exact ${expectedHeight}px ${property} contract`);
  }
  mobileHeights[size] = cssNumber(sizeRule, "height", "px");
}
assert.deepEqual(mobileHeights, expectedMobileHeights, "phone v3 size presets should have one deterministic geometry scale");
assert.ok(fidelityV3Css.includes("@media(max-width:359px){.themeControlly .roomExperience .serviceGrid,.themeControlly.mobileHomeVertical .railCategory{grid-template-columns:1fr!important}"), "phones up to 359px must use one card column");
assert.ok(fidelityV3Css.includes(".themeControlly .roomExperience .serviceGrid,.themeControlly.mobileHomeVertical .railCategory{grid-template-columns:repeat(2,minmax(0,1fr))!important"), "regular phones must use the intended two-column grid without horizontal card scrolling");

const roomMobileStart = roomV2Css.indexOf("@media(max-width:1100px)");
const roomMobileEnd = roomV2Css.indexOf("@media(max-width:430px)", roomMobileStart);
assert.ok(roomMobileStart >= 0 && roomMobileEnd > roomMobileStart, "room v2 responsive structure should remain bounded and testable before v3 geometry overrides it");
const roomMobileCss = roomV2Css.slice(roomMobileStart, roomMobileEnd);
const roomMobileCardRule = cssRule(roomMobileCss, ".themeControlly .roomExperience .entityDesigned", "first");
assert.ok(roomMobileCardRule.includes("width:100%!important") && roomMobileCardRule.includes("min-width:0!important") && roomMobileCardRule.includes("height:auto!important"), "responsive room cards must release desktop fixed geometry before v3 sizing is applied");

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

let roomParityCases = 0;
for (const preset of ["floating", "deck", "cinema"]) {
  for (const position of ["top", "bottom"]) {
    dashboard._boot.config.area_overrides = {
      [roomArea.id]: { layout_preset: preset, controls_position: position },
    };
    const runtimeRoom = dashboard._areaViewHtml(roomArea);
    assert.ok(runtimeRoom.includes(`roomPreset-${preset} controls-${position}`), `${preset}/${position}: runtime room classes should reflect its saved layout`);
    assert.ok(runtimeRoom.includes(`data-room-preset="${preset}"`), `${preset}/${position}: runtime room should expose its preset`);
    const runtimeHeroIndex = runtimeRoom.indexOf('<section class="roomHero ');
    const runtimeControlsIndex = runtimeRoom.indexOf('<section class="roomControls">');
    assert.ok(runtimeHeroIndex >= 0 && runtimeControlsIndex >= 0, `${preset}/${position}: runtime room needs both hero and controls sections`);
    assert.equal(runtimeControlsIndex < runtimeHeroIndex, position === "top", `${preset}/${position}: runtime DOM order should match controls position`);

    for (const previewDevice of ["desktop", "mobile"]) {
      dashboard._roomPreviewDevice = previewDevice;
      const editorRoom = dashboard._roomSettingsHtml();
      assert.ok(editorRoom.includes(`roomPreviewV2 preset-${preset} controls-${position}`), `${preset}/${position}/${previewDevice}: editor preview classes should match runtime`);
      assert.ok(editorRoom.includes(`data-device="${previewDevice}" data-preset="${preset}"`), `${preset}/${position}/${previewDevice}: editor preview metadata should match runtime`);
      assert.match(editorRoom, new RegExp(`name="roomLayoutPreset" value="${preset}" data-room-layout-control checked`), `${preset}/${position}/${previewDevice}: editor preset control should match preview`);
      assert.match(editorRoom, new RegExp(`<option value="${position}" selected>`), `${preset}/${position}/${previewDevice}: editor position control should match preview`);
      const previewHeroIndex = editorRoom.indexOf('<section class="roomPreviewHero ');
      const previewControlsIndex = editorRoom.indexOf('<section class="roomPreviewControls">');
      assert.ok(previewHeroIndex >= 0 && previewControlsIndex >= 0, `${preset}/${position}/${previewDevice}: editor needs both hero and controls sections`);
      assert.equal(previewControlsIndex < previewHeroIndex, position === "top", `${preset}/${position}/${previewDevice}: editor DOM order should match runtime`);
      roomParityCases += 1;
    }
  }
}
assert.equal(roomParityCases, 3 * 2 * 2, "all room presets, positions, and preview devices should be checked");

console.log(`card style smoke tests passed: ${exhaustiveCardCases} card variants + ${roomParityCases} room/editor parity cases`);
