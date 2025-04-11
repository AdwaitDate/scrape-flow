# Flow Scrape

This is a highly customizable web scraper built with Next.js 14, PostgreSQL, Prisma, and React Flow. It enables users to create, manage, and execute complex web scraping workflows with a visual, no-code/low-code interface. The scraper comes with advanced features such as AI-based data extraction



## Technologies Used

- Nextjs 14 with server actions
- React Flow
- Sqllite with Prisma DB
- Puppeteer
- Prisma


## Features

- Launch Browser

  - Initiates a browser instance to begin the web scraping process, enabling interaction with web pages.

- Page to HTML

  - Extracts the complete HTML content of the current page for detailed analysis and processing.

- Extract Text from Element

  - Retrieves the text content from a specified HTML element using a given CSS selector.

- Fill Input

  - Automatically fills a specified input field with a desired value, emulating user input.

- Click Element

  - Simulates a click action on a specified HTML element, triggering any associated events or navigation.

- Scroll to Element

  - Scrolls to a specified element on the page, emulating user behavior for dynamic content loading.

- Wait for Element

  - Pauses the workflow until a specified element becomes visible or hidden on the page.

- Extract Data via AI

  - Uses AI to parse HTML content and extract structured data based on a custom prompt, returning JSON output.

- Read JSON

  - Reads and retrieves a specific key or property from a JSON object for use in workflows.

- Build JSON

  - Adds or updates data within an existing JSON object or creates a new one with the specified properties.

- Deliver via Webhook

  - Sends the scraped data to an external API endpoint through a POST request for further processing or storage.

- Navigate to URL

  - Navigates to a specified URL, loading the desired web page for scraping or interaction.
