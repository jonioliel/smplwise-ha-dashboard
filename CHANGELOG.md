# Changelog

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
