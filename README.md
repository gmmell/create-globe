# Create Globe 🌍

A reusable skill for **Codex and Claude Code** that creates interactive Earth globes from a working Three.js starter.

Includes Earth textures, day/night lighting, city lights, clouds, atmosphere, a Milky Way background, and mouse, touch, and keyboard controls. Globe creation only: no flight planner, search, weather, music, or tracking.

No npm install, map API key, or paid map service is required by the generated globe. You need Codex or Claude Code to use the skill, and a browser with WebGL 2 to view the result. Git is needed for the clone commands below. Python 3 is useful for local previews; another static HTTP server also works.

## Install with your agent

**Paste into Codex:**

```text
Use $skill-installer to install the create-globe skill from
https://github.com/gmmell/create-globe
The SKILL.md file is at the repository root. Install it as create-globe.
Do not overwrite an existing installation without checking first.
```

**Paste into Claude Code:**

```text
Install https://github.com/gmmell/create-globe as a personal skill
at ~/.claude/skills/create-globe. The SKILL.md is at the repository root.
Clone the complete repository so the bundled template assets are included.
Do not overwrite an existing installation without checking first.
```

Start a new session if the skill does not appear.

## Create your first globe

**Codex:**

```text
Use $create-globe to make an interactive Earth globe in outputs/my-globe.
Title it “Our World” and start a local preview.
```

**Claude Code:**

```text
/create-globe Make an interactive Earth globe in outputs/my-globe.
Title it “Our World” and start a local preview.
```

Ask for a different title, colours, starting viewpoint, or globe styling. The skill copies its template into your output folder; the installed starter stays reusable.

## Manual installation

macOS/Linux, or a shell with Git and mkdir:

**Codex — current documented personal skill directory:**

```sh
mkdir -p ~/.agents/skills
git clone https://github.com/gmmell/create-globe.git ~/.agents/skills/create-globe
```

**Claude Code:**

```sh
mkdir -p ~/.claude/skills
git clone https://github.com/gmmell/create-globe.git ~/.claude/skills/create-globe
```

On Windows, download **Code → Download ZIP**, extract it, rename the extracted folder to `create-globe`, and move it into `%USERPROFILE%\.agents\skills\` for Codex or `%USERPROFILE%\.claude\skills\` for Claude Code. Keep `SKILL.md` directly inside `create-globe`, with `assets` beside it.

Some Codex versions and the bundled skill installer use `~/.codex/skills/` (or `$CODEX_HOME/skills`). Use the installer prompt above if unsure, and avoid installing duplicate copies in multiple discovery directories.

These Claude instructions target **Claude Code**, which can create files and run a local server. They are not Claude web-chat installation instructions.

## Preview the starter without an agent

From a clone of this repository:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory assets/globe-template
```

Open **http://localhost:8000**. On Windows, use `py -3` instead of `python3` if needed. Stop the server with Ctrl+C.

For a generated globe, replace `assets/globe-template` with its output directory. Use HTTP rather than double-clicking `index.html`: browser ES modules need a server. Choose another port if 8000 is busy.

## Update

Run `git pull --ff-only` inside your installed skill directory. If you changed the skill locally, review those changes before updating. A ZIP installation can be replaced after backing up any customisations. Updating the skill does not change previously generated globes.

## What is inside

- `SKILL.md` — instructions shared by both agents.
- `assets/globe-template/` — standalone HTML, CSS, JavaScript, local Three.js modules, and four textures.
- `THIRD_PARTY_NOTICES.md` — texture and library credits.

The Earth is spherical. Lighting is approximate; surface and cloud textures are reference imagery, not live weather. Zoom is limited to the bundled images. No external tile or weather service is contacted by the starter.

## Credits and license

Original skill instructions and starter code are MIT licensed. **Textures and bundled libraries have their own terms**; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Keep the visible About & credits section in generated globes.

Installation references: [Codex skills](https://developers.openai.com/codex/skills/) · [Claude Code skills](https://code.claude.com/docs/en/skills).
