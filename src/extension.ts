import * as vscode from 'vscode';
import { TipState } from './tipState';
import { TipManager } from './tipManager';
import { TipPanel } from './panel/TipPanel';
import { OSUtils } from './osUtils';

export async function activate(context: vscode.ExtensionContext) {
  const state = new TipState(context);
  const tipManager = new TipManager(context, state);

  try {
    await tipManager.initialize();

    // Initialize OS settings (this will auto-detect and set if needed)
    await OSUtils.getOSType();
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to initialize Tip of the Day: ${error}`);
    return;
  }

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand("tipOfTheDay.show", () => showTip(context, tipManager, state)),
    vscode.commands.registerCommand("tipOfTheDay.next", () => showNextTip(tipManager)),
    vscode.commands.registerCommand("tipOfTheDay.previous", () => showPreviousTip(tipManager)),
    vscode.commands.registerCommand("tipOfTheDay.dismissToday", () => dismissForToday(state)),
    vscode.commands.registerCommand("tipOfTheDay.dismissPermanently", () => dismissPermanently(state)),
    vscode.commands.registerCommand("tipOfTheDay.viewFavorites", () => viewFavorites(context, tipManager, state))
  );

  // Check if we should show the tip on startup
  if (await shouldShowTipOnStartup(state)) {
    await showTip(context, tipManager, state);
  }
}

async function shouldShowTipOnStartup(state: TipState): Promise<boolean> {
  // Check if tips are enabled
  if (await state.isDisabled()) {
    return false;
  }

  // Check if show on startup is enabled
  const config = vscode.workspace.getConfiguration("tipOfTheDay");
  if (!config.get<boolean>("showOnStartup", true)) {
    return false;
  }

  // Check startup hour constraint
  const startupHour = config.get<number>("startupHourLocal");
  if (startupHour !== undefined) {
    const currentHour = new Date().getHours();
    if (currentHour < startupHour) {
      return false;
    }
  }

  // Check if we already showed a tip today
  const lastShownDate = await state.getLastShownDate();
  const today = new Date().toISOString().split("T")[0];
  return lastShownDate !== today;
}

async function showTip(context: vscode.ExtensionContext, tipManager: TipManager, state: TipState) {
  try {
    // Show a random tip when manually triggered
    await tipManager.showRandomTip();

    const extensionPath = context.extensionUri.fsPath;
    TipPanel.show(extensionPath, tipManager, state);

    // Update last shown date
    const today = new Date().toISOString().split("T")[0];
    await state.setLastShownDate(today);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to show tip: ${error}`);
  }
}

async function showNextTip(tipManager: TipManager) {
    try {
        const tip = await tipManager.nextTip();
        // TODO: Show tip in WebView
        console.log('Showing next tip:', tip);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to show next tip: ${error}`);
    }
}

async function showPreviousTip(tipManager: TipManager) {
    try {
        const tip = await tipManager.previousTip();
        // TODO: Show tip in WebView
        console.log('Showing previous tip:', tip);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to show previous tip: ${error}`);
    }
}

async function dismissForToday(state: TipState) {
    const today = new Date().toISOString().split('T')[0];
    await state.setLastShownDate(today);
}

async function dismissPermanently(state: TipState) {
    await state.setDisabled(true);
    
    // Update VS Code setting
    const config = vscode.workspace.getConfiguration('tipOfTheDay');
    await config.update('enabled', false, true);
}

async function viewFavorites(context: vscode.ExtensionContext, tipManager: TipManager, state: TipState) {
    try {
        const { FavoritesPanel } = await import('./panel/FavoritesPanel.js');
        await FavoritesPanel.show(context.extensionUri.fsPath, tipManager, state);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to show favorites: ${error}`);
    }
}

export function deactivate() {}
