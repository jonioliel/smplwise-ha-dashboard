# Changelog

## 0.2.0

- Fix domain filters whose cards remained visible because component CSS overrode the `hidden` attribute.
- Load Home Assistant users and groups automatically for administrators.
- Read groups from each Home Assistant user, matching the current authentication API.
- Add dashboard room editing: display name, background URL, and visibility.
- Add one-tap controls with live state indicators for lights and switches.
- Add pending and result feedback for dashboard commands.
- Use a versioned frontend URL to prevent an old cached JavaScript bundle after HACS updates.
- Correct the stored default view values for whole-home, floor, and area views.
