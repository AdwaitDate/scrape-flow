# Flow Scrape

Flow Scrape is a visual web-scraping workflow builder built with Next.js 14, React Flow, Puppeteer, Prisma, and SQLite. It lets users compose browser actions, extract page content, transform results into JSON, and send them to a webhook. Workflows can also use AI-assisted data extraction.

## Technology stack

- Next.js 14 with Server Actions
- React Flow (`@xyflow/react`) for the visual workflow editor
- Prisma ORM with SQLite (the current Prisma schema is configured for SQLite)
- Puppeteer for browser automation

## Workflow actions

- **Launch browser** to start a browser session.
- **Navigate to URL** to open a page.
- **Page to HTML** to capture the current page markup.
- **Extract text from element** with a CSS selector.
- **Fill input**, **click element**, **scroll to element**, and **wait for element** to interact with a page.
- **Extract data via AI** to turn page content into structured JSON.
- **Read JSON** and **build JSON** to access or assemble workflow data.
- **Deliver via webhook** to send results to another service with an HTTP POST request.
