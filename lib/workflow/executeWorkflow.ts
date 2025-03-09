import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";
import { TaskType } from "@/types/task";
import puppeteer from "puppeteer-core";

// Helper to sort nodes in execution order
function topologicalSort(nodes: AppNode[], edges: Edge[]): AppNode[] {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const graph = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();

  // Initialize graph and in-degree count
  nodes.forEach(node => {
    graph.set(node.id, new Set());
    inDegree.set(node.id, 0);
  });

  // Build graph and count incoming edges
  edges.forEach(edge => {
    const source = edge.source;
    const target = edge.target;
    graph.get(source)?.add(target);
    inDegree.set(target, (inDegree.get(target) || 0) + 1);
  });

  // Find nodes with no dependencies
  const queue = nodes
    .filter(node => (inDegree.get(node.id) || 0) === 0)
    .map(node => node.id);
  
  const result: AppNode[] = [];

  // Process queue
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodeMap.get(nodeId)!;
    result.push(node);

    // Update neighbors
    graph.get(nodeId)?.forEach(neighbor => {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    });
  }

  return result;
}

// Execute a single task
async function executeTask(task: AppNode, inputs: any, browser?: puppeteer.Browser) {
  const taskType = task.data.type;
  const taskDef = TaskRegistry[taskType];
  
  if (!taskDef) {
    throw new Error(`Unknown task type: ${taskType}`);
  }

  switch (taskType) {
    case TaskType.LAUNCH_BROWSER:
      try {
        const url = task.data.inputs?.["Website Url"] || "https://www.example.com";
        
        // Use an existing Chrome installation
        const browser = await puppeteer.launch({ 
          headless: true,
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Path to Chrome on macOS
          args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
          ],
          ignoreHTTPSErrors: true
        });
        
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
        return { browser, page };
      } catch (error) {
        console.error("Browser launch error:", error);
        throw new Error(`Failed to launch browser: ${error.message}`);
      }

    case TaskType.PAGE_TO_HTML:
      const html = await inputs.page.content();
      return { html, page: inputs.page, browser: inputs.browser };

    case TaskType.EXTRACT_TEXT:
      const selector = task.data.inputs?.["CSS Selector"] || "";
      const elements = await inputs.page.$$(selector);
      const texts = await Promise.all(
        elements.map((el: any) => inputs.page.evaluate((el: any) => el.textContent, el))
      );
      return { extractedText: texts, page: inputs.page, browser: inputs.browser };

    case TaskType.EXTRACT_TABLE:
      const tableSelector = task.data.inputs?.["Table Selector"] || "table";
      const tableData = await inputs.page.evaluate((selector: string) => {
        const table = document.querySelector(selector);
        if (!table) return [];
        
        const rows = Array.from(table.querySelectorAll('tr'));
        return rows.map(row => {
          const cells = Array.from(row.querySelectorAll('td, th'));
          return cells.map(cell => cell.textContent?.trim() || '');
        });
      }, tableSelector);
      return { tableData, page: inputs.page, browser: inputs.browser };

    case TaskType.CLICK_ELEMENT:
      const clickSelector = task.data.inputs?.["Element Selector"] || "";
      await inputs.page.waitForSelector(clickSelector);
      await inputs.page.click(clickSelector);
      await inputs.page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
      return { page: inputs.page, browser: inputs.browser };

    case TaskType.FORM_INPUT:
      const inputSelector = task.data.inputs?.["Input Selector"] || "";
      const textValue = task.data.inputs?.["Text Value"] || "";
      await inputs.page.waitForSelector(inputSelector);
      await inputs.page.type(inputSelector, textValue);
      return { page: inputs.page, browser: inputs.browser };

    case TaskType.SCROLL_PAGE:
      const scrollAmount = task.data.inputs?.["Scroll Amount"] || 0;
      if (scrollAmount > 0) {
        await inputs.page.evaluate((amount: number) => {
          window.scrollBy(0, amount);
        }, scrollAmount);
      } else {
        // Scroll to bottom if no specific amount
        await inputs.page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
      }
      return { page: inputs.page, browser: inputs.browser };

    case TaskType.PAGINATION:
      let currentPage = 1;
      const maxPages = task.data.inputs?.["Max Pages"] || 5;
      const nextButtonSelector = task.data.inputs?.["Next Button Selector"] || "";
      
      while (currentPage < maxPages) {
        const nextButton = await inputs.page.$(nextButtonSelector);
        if (!nextButton) break;
        
        await nextButton.click();
        await inputs.page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
        currentPage++;
      }
      
      return { page: inputs.page, browser: inputs.browser };

    case TaskType.SCREENSHOT:
      const filename = task.data.inputs?.["Filename"] || "screenshot.png";
      const fullPage = task.data.inputs?.["Full Page"] || false;
      await inputs.page.screenshot({
        path: filename,
        fullPage: fullPage
      });
      return { page: inputs.page, browser: inputs.browser };

    case TaskType.FILTER_DATA:
      const data = inputs.data || [];
      const filterCondition = task.data.inputs?.["Filter Condition"] || "";
      // Simple filtering using Function constructor (be careful with this in production)
      const filterFn = new Function('item', `return ${filterCondition}`);
      const filteredData = data.filter(filterFn);
      return { filteredData, page: inputs.page, browser: inputs.browser };

    case TaskType.DELAY:
      const duration = task.data.inputs?.["Duration (ms)"] || 1000;
      await new Promise(resolve => setTimeout(resolve, duration));
      return { page: inputs.page, browser: inputs.browser };

    case TaskType.SAVE_TO_JSON:
      const jsonData = inputs.data || [];
      const jsonFilename = task.data.inputs?.["Filename"] || "data.json";
      // In a real implementation, this would save to a file
      console.log('Saving to JSON:', jsonFilename, jsonData);
      return { page: inputs.page, browser: inputs.browser };

    case TaskType.SAVE_TO_CSV:
      const csvData = inputs.data || [];
      const csvFilename = task.data.inputs?.["Filename"] || "data.csv";
      // In a real implementation, this would save to a file
      console.log('Saving to CSV:', csvFilename, csvData);
      return { page: inputs.page, browser: inputs.browser };

    default:
      throw new Error(`Task type ${taskType} not implemented`);
  }
}

// Execute the entire workflow
export async function executeWorkflow(nodes: AppNode[], edges: Edge[]) {
  const sortedNodes = topologicalSort(nodes, edges);
  const nodeOutputs = new Map<string, any>();
  let browser: puppeteer.Browser | undefined;

  try {
    for (const node of sortedNodes) {
      // Find all incoming edges to this node
      const incomingEdges = edges.filter(edge => edge.target === node.id);
      
      // Collect inputs from connected nodes
      const inputs: any = {};
      for (const edge of incomingEdges) {
        const sourceOutput = nodeOutputs.get(edge.source);
        if (sourceOutput) {
          Object.assign(inputs, sourceOutput);
        }
      }

      // Add browser instance if available
      if (browser) {
        inputs.browser = browser;
      }

      // Execute the task
      const output = await executeTask(node, inputs, browser);
      nodeOutputs.set(node.id, output);

      // Store browser instance if created
      if (output.browser && !browser) {
        browser = output.browser;
      }
    }

    // Close browser when done
    if (browser) {
      await browser.close();
    }

    return nodeOutputs;
  } catch (error) {
    // Make sure to close browser on error
    if (browser) {
      await browser.close();
    }
    throw error;
  }
} 