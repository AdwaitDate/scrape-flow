"use server";

import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import puppeteer from "puppeteer";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";

export async function executeWorkflowAction(nodes: AppNode[], edges: Edge[]) {
  const browser = await puppeteer.launch({ headless: "new" });
  const nodeOutputs = new Map<string, any>();
  
  try {
    const sortedNodes = topologicalSort(nodes, edges);
    
    for (const node of sortedNodes) {
      const task = TaskRegistry[node.data.type];
      const inputs = await resolveInputs(node, nodeOutputs);
      
      const outputs = await executeTask(task, inputs, browser);
      nodeOutputs.set(node.id, outputs);
    }

    return { success: true, outputs: Object.fromEntries(nodeOutputs) };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  } finally {
    await browser.close();
  }
}

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

// Helper to resolve input values for a node
async function resolveInputs(node: AppNode, nodeOutputs: Map<string, any>) {
  const inputs: Record<string, any> = {};
  
  // Get input connections from edges
  Object.entries(node.data.inputs || {}).forEach(([inputId, value]) => {
    if (value.sourceNodeId) {
      const sourceOutput = nodeOutputs.get(value.sourceNodeId);
      inputs[inputId] = sourceOutput?.[value.sourceOutputId];
    } else {
      inputs[inputId] = value.value;
    }
  });

  return inputs;
}

async function executeTask(task: any, inputs: any, browser: any) {
  switch (task.type) {
    case TaskType.LAUNCH_BROWSER:
      const page = await browser.newPage();
      await page.goto(inputs.websiteUrl);
      return { page };
      
    case TaskType.PAGE_TO_HTML:
      const html = await inputs.page.content();
      return { html, page: inputs.page };
      
    case TaskType.EXTRACT_TEXT:
      const elements = await inputs.page.$$(inputs.cssSelector);
      const texts = await Promise.all(
        elements.map((el: any) => el.evaluate((node: any) => node.textContent))
      );
      return { texts, page: inputs.page };
      
    case TaskType.EXTRACT_TABLE:
      const tableData = await inputs.page.evaluate((selector: string) => {
        const table = document.querySelector(selector);
        if (!table) return [];
        
        const rows = Array.from(table.querySelectorAll('tr'));
        return rows.map(row => {
          const cells = Array.from(row.querySelectorAll('td, th'));
          return cells.map(cell => cell.textContent?.trim() || '');
        });
      }, inputs.tableSelector);
      
      return { tableData, page: inputs.page };
      
    case TaskType.CLICK_ELEMENT:
      await inputs.page.click(inputs.elementSelector);
      await inputs.page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
      return { page: inputs.page };
      
    case TaskType.SCROLL_PAGE:
      if (inputs.scrollAmount) {
        await inputs.page.evaluate((amount: number) => {
          window.scrollBy(0, amount);
        }, inputs.scrollAmount);
      } else {
        await inputs.page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
      }
      return { page: inputs.page };
      
    case TaskType.WAIT_FOR_ELEMENT:
      await inputs.page.waitForSelector(inputs.elementSelector, { 
        timeout: inputs.timeout || 30000 
      });
      return { page: inputs.page };
      
    case TaskType.PAGINATION:
      let currentPage = 1;
      const maxPages = inputs.maxPages || 5;
      
      while (currentPage < maxPages) {
        const nextButton = await inputs.page.$(inputs.nextButtonSelector);
        if (!nextButton) break;
        
        await nextButton.click();
        await inputs.page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
        currentPage++;
      }
      
      return { page: inputs.page };
      
    case TaskType.FILTER_DATA:
      // Simple filtering using Function constructor (be careful with this in production)
      const filterFn = new Function('item', `return ${inputs.filterCondition}`);
      const filteredData = inputs.data.filter(filterFn);
      return { filteredData };

    case TaskType.DELAY:
      await new Promise(resolve => setTimeout(resolve, inputs.duration));
      return {};

    case TaskType.SAVE_TO_JSON:
      // In a real implementation, this would save to a file
      console.log('Saving to JSON:', inputs.filename, inputs.data);
      return {};

    case TaskType.SAVE_TO_CSV:
      // In a real implementation, this would save to a file
      console.log('Saving to CSV:', inputs.filename, inputs.data);
      return {};

    case TaskType.FORM_INPUT:
      const inputElement = await inputs.page.$(inputs.inputSelector);
      if (!inputElement) {
        throw new Error(`Input element not found: ${inputs.inputSelector}`);
      }
      await inputElement.type(inputs.textValue);
      return { page: inputs.page };
      
    case TaskType.SCREENSHOT:
      await inputs.page.screenshot({
        path: inputs.filename,
        fullPage: inputs.fullPage || false
      });
      return { page: inputs.page };

    default:
      throw new Error(`Task type ${task.type} not implemented`);
  }
} 