# OpenClaw Mission Control

Live dashboard for monitoring and controlling my OpenClaw stack. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Agent Status** – view active agents, models, sessions
- **Channels** – monitor connected messaging channels (WhatsApp, Telegram, etc.)
- **Models** – see configured models and aliases
- **Logs** – browse daily logs and error logs
- **Config Editor** – edit OpenClaw configuration in‑browser
- **File Browser** – navigate workspace files
- **Gateway Control** – restart gateway, check status
- **Task Queue** – view and manage `BACKLOG.md` tasks
- **System Health** – disk, memory, security configuration

## Getting Started

### Prerequisites

- Node.js 18+
- OpenClaw gateway running on `ws://localhost:18789`

### Installation

```bash
git clone https://github.com/AustyVoankark/mission-control.git
cd mission-control
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

The built files will be in the `dist` folder.

## Architecture

- **React + TypeScript** – component‑based UI
- **Vite** – fast dev server and bundler
- **Tailwind CSS** – utility‑first styling
- **WebSocket client** – connects to OpenClaw gateway (`ws://localhost:18789`)
- **Modular components** – each tab is a separate component

## Gateway Integration

The dashboard communicates with the OpenClaw gateway via WebSocket RPC. It can:

- List sessions and sub‑agents
- Get gateway status and restart it
- Read and patch configuration
- Fetch system health metrics
- Read workspace files (via gateway proxy)

## Screenshot

![Mission Control Dashboard](screenshot.png)

## Deployment

This dashboard is designed to run locally alongside the OpenClaw gateway. It can also be hosted statically (e.g., GitHub Pages) if the gateway is publicly accessible (not recommended for security).

## Related Repositories

- [openclaw‑setup](https://github.com/AustyVoankark/openclaw-setup) – full documentation of my OpenClaw configuration
- [polymarket‑bot](https://github.com/AustyVoankark/polymarket-bot) – BTC prediction‑market trading bot
- [web‑scraper‑tools](https://github.com/AustyVoankark/web-scraper-tools) – Python scraping and search scripts

## License

MIT