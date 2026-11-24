---
name: create-globe
description: Create an interactive Three.js Earth globe with textured terrain, day and night lighting, city lights, clouds, a Milky Way background, and mouse, touch, and keyboard navigation. Use for globe creation or customisation, not flight planners or general mapping apps.
---

# Create a globe

Use `assets/globe-template/` as the working starter. Resolve this path relative to this skill, never to a previous user's workspace.

Copy the template into the requested output directory. If none is supplied, use a new descriptive directory under `outputs/`. Do not overwrite an existing project without checking the request and its contents. Adapt title, colours, initial viewpoint, and requested globe features in the copied files.

This skill extracts globe creation only. It does not bundle place search, weather, flight routes, data centres, satellites, lunar events, audio, or the original animated loader. Add features outside the core only if the user explicitly requests them.

## Template structure

- `app.js`: scene, texture loading, Earth and atmosphere shaders, sky sphere, camera controls, rendering, and failure messages.
- `astronomy.js`: approximate solar direction and coordinate conversion.
- `index.html` and `style.css`: minimal responsive interface, accessible controls, and visible source credits.
- `assets/`: four required reference textures.
- `vendor/`: local Three.js ES modules, OrbitControls, and MIT license.

Earth radius is 1. `xyz(lat, lon, radius)` maps latitude to +Y and eastward longitude toward −Z. Keep this convention consistent with texture orientation. The sunlight vector is Earth-fixed; the sky rotates by negative Greenwich sidereal time. Treat this as an approximate educational view, not a precision astronomical tool.

Retain the import map and local vendor dependencies. Serve the output over HTTP; ES modules and texture loading do not reliably work through file URLs. For a local preview, run `python3 -m http.server 8000 --bind 127.0.0.1 --directory <output-directory>` using an available port.

Keep camera zoom outside the Earth, cap pixel ratio for mobile performance, and preserve resize handling, touch gestures, keyboard navigation, reduced-motion handling, and load-error feedback. Keep zoom appropriate to the bundled texture resolution; this template has no streamed satellite tiles.

Preserve the source links, credits, limitations, and vendor license in generated output. Existing texture provenance is recorded in the template's About & credits section; no new redistribution clearance is implied. If replacing textures, retain the relevant credits and check the supplied usage terms.

## Check the result

Check JavaScript syntax and resolve all local imports and image paths. When a browser is available, preview the globe on desktop and a narrow viewport: confirm the textures and sky load, rotation and zoom work, reset returns to the initial view, and keyboard focus and credits remain usable. Report any checks you could not run. Deliver the generated directory and preview instructions. Publishing is a separate user request.
