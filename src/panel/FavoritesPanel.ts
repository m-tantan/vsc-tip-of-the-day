import * as vscode from "vscode";
import { TipManager } from "../tipManager";
import { TipState } from "../tipState";
import { OSUtils } from "../osUtils";
import { getLocalizedStrings } from "../localization";
import { Tip } from "../types";

export class FavoritesPanel {
  private static currentInstance: FavoritesPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly disposables: vscode.Disposable[] = [];
  private currentOSType: string = "";

  private constructor(
    private readonly extensionPath: string,
    private readonly tipManager: TipManager,
    private readonly state: TipState
  ) {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    this._panel = vscode.window.createWebviewPanel(
      "favoriteTips",
      "⭐ My Favorite Tips ⭐",
      columnToShowIn || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(vscode.Uri.joinPath(vscode.Uri.file(extensionPath), "media").fsPath),
        ],
      }
    );

    this._panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case "removeFavorite":
            if (message.data) {
              await state.removeFavorite(message.data);
              await this.updateContent();
            }
            break;
          case "openTip":
            if (message.data) {
              // Open the regular tip panel with the selected tip
              const { TipPanel } = await import("./TipPanel.js");
              // Find the tip index by ID
              const allTips = tipManager.getAllTips();
              const tipIndex = allTips.findIndex(t => t.id === message.data);
              if (tipIndex !== -1) {
                await state.setLastTipIndex(tipIndex);
                TipPanel.show(extensionPath, tipManager, state);
              } else {
                vscode.window.showWarningMessage("This tip is no longer available and has been removed from your favorites.");
                await state.removeFavorite(message.data);
                await this.updateContent();
              }
            }
            break;
        }
      },
      null,
      this.disposables
    );

    this.updateContent();
  }

  public static async show(extensionPath: string, tipManager: TipManager, state: TipState): Promise<void> {
    if (FavoritesPanel.currentInstance) {
      FavoritesPanel.currentInstance._panel.reveal();
      return;
    }

    try {
      FavoritesPanel.currentInstance = new FavoritesPanel(extensionPath, tipManager, state);
      await state.setHasOpenedFavorites(true);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to show favorites: ${error}`);
      if (FavoritesPanel.currentInstance) {
        FavoritesPanel.currentInstance.dispose();
      }
    }
  }

  private async updateContent() {
    this.currentOSType = await OSUtils.getOSType();
    const favoriteIds = await this.state.getFavorites();
    const currentLanguage = this.tipManager.getCurrentLanguage();
    const strings = getLocalizedStrings(currentLanguage);

    // Get favorite tips and track which ones are missing
    const favoriteTips: Array<{ tip: Tip; id: number }> = [];
    const missingIds: number[] = [];
    
    for (const id of favoriteIds) {
      const tip = this.tipManager.getTipById(id);
      if (tip) {
        favoriteTips.push({ tip, id });
      } else {
        missingIds.push(id);
      }
    }
    
    // Clean up missing favorites from storage
    if (missingIds.length > 0) {
      const cleanedFavorites = favoriteIds.filter(id => !missingIds.includes(id));
      await this.state.setFavorites(cleanedFavorites);
    }

    // Simple HTML escape function
    function escapeHtml(text: string): string {
      return text.replace(/[&<>"'`=\/]/g, function (s) {
        return (
          {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "`": "&#96;",
            "=": "&#61;",
            "/": "&#47;",
          } as { [key: string]: string }
        )[s];
      });
    }

    const styleUri = this._panel.webview.asWebviewUri(
      vscode.Uri.file(vscode.Uri.joinPath(vscode.Uri.file(this.extensionPath), "media", "styles.css").fsPath)
    );

    const tipsList = favoriteTips.length > 0
      ? favoriteTips.map(({ tip, id }) => `
          <div class="favorite-tip-item">
            <div class="tip-header">
              <h3 class="tip-title">${escapeHtml(tip.title)}</h3>
              <button class="remove-favorite-btn" onclick="removeFavorite(${id})" aria-label="${strings.unfavoriteButton}">
                ⭐
              </button>
            </div>
            <div class="tip-content">${escapeHtml(tip.content)}</div>
            <button class="view-tip-btn" onclick="openTip(${id})">View Full Tip</button>
          </div>
        `).join("")
      : `<div class="no-favorites">
          <p>${escapeHtml(strings.noFavoritesMessage)}</p>
        </div>`;

    const hasOpenedBefore = await this.state.hasOpenedFavorites();
    const instructionsHtml = favoriteTips.length > 0 && !hasOpenedBefore
      ? `<div class="instructions-banner">
          <p>${escapeHtml(strings.favoritesInstructions)}</p>
        </div>`
      : "";

    this._panel.webview.html = `<!DOCTYPE html>
        <html lang="${currentLanguage}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="${styleUri}">
            <title>${strings.myFavoritesTitle}</title>
            <style>
          body {
            margin: 0;
            padding: 0;
          }
          .container {
            border: 2px solid #FFD700;
            border-radius: 8px;
            margin: 16px;
            padding: 24px;
            box-sizing: border-box;
          }
          .header {
            margin-bottom: 16px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 8px 0;
          }
          .instructions-banner {
            background: var(--vscode-editorInfo-background);
            border-left: 3px solid var(--vscode-editorInfo-border);
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 3px;
          }
          .instructions-banner p {
            margin: 0;
            color: var(--vscode-editorInfo-foreground);
          }
          .favorite-tip-item {
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 16px;
            background: var(--vscode-editor-background);
          }
          .tip-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
          }
          .tip-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            flex: 1;
          }
          .remove-favorite-btn {
            background: transparent;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 3px;
            transition: background 0.2s ease;
          }
          .remove-favorite-btn:hover {
            background: var(--vscode-toolbar-hoverBackground);
          }
          .remove-favorite-btn:focus {
            outline: 1px solid var(--vscode-focusBorder);
            outline-offset: 2px;
          }
          .tip-content {
            margin-bottom: 12px;
            line-height: 1.6;
          }
          .view-tip-btn {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 6px 14px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 13px;
          }
          .view-tip-btn:hover {
            background: var(--vscode-button-hoverBackground);
          }
          .view-tip-btn:focus {
            outline: 1px solid var(--vscode-focusBorder);
            outline-offset: 2px;
          }
          .no-favorites {
            text-align: center;
            padding: 40px 20px;
            color: var(--vscode-descriptionForeground);
          }
        </style>
        </head>
        <body>
            <div class="container">
              <div class="header">
                <h1 class="title">${strings.myFavoritesTitle}</h1>
              </div>
              ${instructionsHtml}
              ${tipsList}
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                
                function removeFavorite(tipId) {
                    vscode.postMessage({ command: 'removeFavorite', data: tipId });
                }
                
                function openTip(tipId) {
                    vscode.postMessage({ command: 'openTip', data: tipId });
                }
            </script>
        </body>
        </html>`;
  }

  public dispose(): void {
    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
    FavoritesPanel.currentInstance = undefined;
    this._panel.dispose();
  }
}
