import * as vscode from "vscode";
import { TipManager } from "../tipManager";
import { TipState } from "../tipState";
import { OSUtils } from "../osUtils";
import { getLocalizedStrings, SUPPORTED_LANGUAGES } from "../localization";

export class TipPanel {
  private static currentInstance: TipPanel | undefined;
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
      "tipOfTheDay",
      "💡 Tip of the Day 💡",
      columnToShowIn || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(vscode.Uri.joinPath(vscode.Uri.file(extensionPath), "media").fsPath),
        ],
      }
    );

    const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("tipOfTheDay.operatingSystem")) {
        OSUtils.clearCache();
        this.updateContent();
      }
    });
    this.disposables.push(configListener);

    this._panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case "next":
            await tipManager.nextTip();
            await this.updateContent();
            break;
          case "previous":
            await tipManager.previousTip();
            await this.updateContent();
            break;
          case "dismissToday":
            await state.setLastShownDate(new Date().toISOString().split("T")[0]);
            await state.setLastShownTimestamp(Date.now());
            this.dispose();
            break;
          case "dismissForever":
            await state.setDisabled(true);
            const config = vscode.workspace.getConfiguration("tipOfTheDay");
            await config.update("enabled", false, true);
            this.dispose();
            break;
          case "changeLanguage":
            if (message.data) {
              try {
                await tipManager.changeLanguage(message.data);
                await this.updateContent();
              } catch (error) {
                vscode.window.showErrorMessage(`Failed to change language: ${error}`);
              }
            }
            break;
          case "openSettings":
            await vscode.commands.executeCommand(
              "workbench.action.openSettings",
              "@ext:WrecklessEngineer.tip-of-the-day"
            );
            break;
          case "toggleFavorite":
            const currentTipId = tipManager.getCurrentTipId();
            if (currentTipId !== undefined) {
              const isFavorite = await state.isFavorite(currentTipId);
              if (isFavorite) {
                await state.removeFavorite(currentTipId);
              } else {
                await state.addFavorite(currentTipId);
                // Auto-open favorites view on first bookmark
                const hasOpened = await state.hasOpenedFavorites();
                if (!hasOpened) {
                  const { FavoritesPanel } = await import("./FavoritesPanel.js");
                  await FavoritesPanel.show(this.extensionPath, tipManager, state);
                }
              }
              await this.updateContent();
            }
            break;
          case "copyToClipboard":
            if (message.data) {
              await vscode.env.clipboard.writeText(message.data);
              vscode.window.showInformationMessage(
                getLocalizedStrings(tipManager.getCurrentLanguage()).shareCopied
              );
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
    if (TipPanel.currentInstance) {
      TipPanel.currentInstance._panel.reveal();
      return;
    }

    try {
      TipPanel.currentInstance = new TipPanel(extensionPath, tipManager, state);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to show tip: ${error}`);
      if (TipPanel.currentInstance) {
        TipPanel.currentInstance.dispose();
      }
    }
  }

  private async updateContent() {
    const tip = this.tipManager.getCurrentTip();
    this.currentOSType = await OSUtils.getOSType();
    
    // Get favorite status
    const currentTipId = this.tipManager.getCurrentTipId();
    const isFavorite = currentTipId !== undefined ? await this.state.isFavorite(currentTipId) : false;

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
    const currentLanguage = this.tipManager.getCurrentLanguage();
    const strings = getLocalizedStrings(currentLanguage);

    const styleUri = this._panel.webview.asWebviewUri(
      vscode.Uri.file(vscode.Uri.joinPath(vscode.Uri.file(this.extensionPath), "media", "styles.css").fsPath)
    );

    // Generate language options for dropdown
    const languageOptions = SUPPORTED_LANGUAGES.map(
      (lang) =>
        `<option value="${lang.code}" ${lang.code === currentLanguage ? "selected" : ""}>${
          lang.nativeName
        }</option>`
    ).join("");

    this._panel.webview.html = `<!DOCTYPE html>
        <html lang="${currentLanguage}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="${styleUri}">
            <title>${strings.tipOfTheDayTitle}</title>
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
            min-height: 280px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .settings-icon {
            background: transparent;
            border: none;
            padding: 4px;
            cursor: pointer;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: var(--vscode-icon-foreground);
            opacity: 0.8;
            transition: all 0.2s ease;
          }
          .settings-icon:hover {
            opacity: 1;
            background: var(--vscode-toolbar-hoverBackground);
          }
          .settings-icon:focus {
            outline: 1px solid var(--vscode-focusBorder);
            outline-offset: 2px;
          }
          .settings-icon:focus:not(:focus-visible) {
            outline: 1px solid transparent;
          }
          .settings-icon:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 2px;
          }
          .favorite-button {
            background: transparent;
            border: none;
            padding: 4px;
            cursor: pointer;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.2s ease;
          }
          .favorite-button:hover {
            background: var(--vscode-toolbar-hoverBackground);
          }
          .favorite-button:focus {
            outline: 1px solid var(--vscode-focusBorder);
            outline-offset: 2px;
          }
          .favorite-button.is-favorite {
            color: #FFD700;
          }
          .favorite-button:not(.is-favorite) {
            color: var(--vscode-icon-foreground);
            opacity: 0.5;
          }
          .favorite-button:not(.is-favorite):hover {
            opacity: 0.8;
          }
          .share-button {
            background: transparent;
            border: none;
            padding: 4px;
            cursor: pointer;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: var(--vscode-icon-foreground);
            opacity: 0.8;
            transition: all 0.2s ease;
          }
          .share-button:hover {
            opacity: 1;
            background: var(--vscode-toolbar-hoverBackground);
          }
          .share-button:focus {
            outline: 1px solid var(--vscode-focusBorder);
            outline-offset: 2px;
          }
          .share-button:focus:not(:focus-visible) {
            outline: 1px solid transparent;
          }
          .share-button:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 2px;
          }
          .contributor-info {
            margin-top: 12px;
            padding: 8px 12px;
            background: var(--vscode-textBlockQuote-background);
            border-left: 3px solid var(--vscode-textBlockQuote-border);
            border-radius: 3px;
            font-size: 0.9em;
            color: var(--vscode-descriptionForeground);
          }
          .contributor-link {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
            font-weight: 500;
          }
          .contributor-link:hover {
            color: var(--vscode-textLink-activeForeground);
            text-decoration: underline;
          }
          .contributor-link:focus {
            outline: 1px solid var(--vscode-focusBorder);
            outline-offset: 2px;
          }
          .suggest-tip {
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid var(--vscode-panel-border);
            text-align: center;
            font-size: 0.9em;
          }
          .suggest-tip-text {
            color: var(--vscode-descriptionForeground);
            margin-right: 8px;
          }
          .suggest-tip-link {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
            font-weight: 500;
          }
          .suggest-tip-link:hover {
            color: var(--vscode-textLink-activeForeground);
            text-decoration: underline;
          }
          .suggest-tip-link:focus {
            outline: 1px solid var(--vscode-focusBorder);
            outline-offset: 2px;
          }
        </style>
        </head>
        <body>
            <div class="container">
              <div class="header">
                <h1 class="title">${strings.tipOfTheDayTitle}</h1>
                <div class="header-actions">
                  <button class="favorite-button ${isFavorite ? 'is-favorite' : ''}" onclick="sendMessage('toggleFavorite')" aria-label="${isFavorite ? strings.unfavoriteButton : strings.favoriteButton}" title="${isFavorite ? strings.unfavoriteButton : strings.favoriteButton}">⭐</button>
                  <button class="settings-icon" tabindex="-1" onclick="sendMessage('openSettings')" aria-label="Open Extension Settings" title="Open Extension Settings">⚙️</button>
                  <div class="language-selector">
                    <select id="languageSelect" onchange="handleLanguageChange(this)" aria-label="Select Language">
                        ${languageOptions}
                    </select>
                  </div>
                  <button class="share-button" onclick="handleShareClick()" aria-label="${strings.shareButton}" title="${strings.shareButton}">📋</button>
                </div>
              </div>                
              <h2 class="title tip-title">${escapeHtml(tip.title)}</h2>
              <div class="content">${escapeHtml(tip.content)}</div>
              ${
                tip.source
                  ? `<div class="contributor-info">
                  <span>${strings.contributedBy} <a href="https://github.com/${escapeHtml(
                      tip.source
                    )}" target="_blank" rel="noopener noreferrer" class="contributor-link">@${escapeHtml(
                      tip.source
                    )}</a></span>
                </div>`
                  : ""
              }
              <div class="controls">
                  <div class="navigation-controls">
                      <button class="nav-button" onclick="handleButtonClick('previous', this)" aria-label="${
                        strings.previousButton
                      }">${strings.previousButton}</button>
                      <button class="nav-button" onclick="handleButtonClick('next', this)" aria-label="${
                        strings.nextButton
                      }">${strings.nextButton}</button>
                  </div>
                  <div class="action-controls">
                      <div class="dismiss-controls">
                        <button class="action-button" onclick="handleButtonClick('dismissToday', this)" aria-label="${
                          strings.dismissTodayButton
                        }">${strings.dismissTodayButton}</button>
                        <button class="action-button" onclick="handleButtonClick('dismissForever', this)" aria-label="${
                          strings.dismissForeverButton
                        }">${strings.dismissForeverButton}</button>
                      </div>
                  </div>
                    <div class="os-info" role="status" aria-live="polite">Optimized for ${escapeHtml(
                      this.currentOSType
                    )}</div>
              </div>
              <div class="suggest-tip">
                <span class="suggest-tip-text">${strings.suggestTipText}</span>
                <a href="https://github.com/m-tantan/vsc-tip-of-the-day/issues/new?template=add-a-tip.md" target="_blank" rel="noopener noreferrer" class="suggest-tip-link">${
                  strings.suggestTipLink
                }</a>
              </div>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                
                function sendMessage(command, data) {
                    vscode.postMessage({ command: command, data: data });
                }
                
                // Store focus information before content updates
                function storeFocusInfo() {
                    const activeEl = document.activeElement;
                    if (!activeEl || activeEl === document.body) {
                        return null;
                    }
                    
                    // Determine what kind of element is focused and how to find it again
                    if (activeEl.classList.contains('nav-button')) {
                        const navButtons = Array.from(document.querySelectorAll('.nav-button'));
                        const index = navButtons.indexOf(activeEl);
                        return { type: 'nav-button', index };
                    } else if (activeEl.id === 'languageSelect') {
                        return { type: 'language-select' };
                    } else if (activeEl.classList.contains('settings-icon')) {
                        return { type: 'settings-icon' };
                    } else if (activeEl.classList.contains('action-button')) {
                        const actionButtons = Array.from(document.querySelectorAll('.action-button'));
                        const index = actionButtons.indexOf(activeEl);
                        return { type: 'action-button', index };
                    }
                    return null;
                }
                
                // Restore focus to the correct element
                function restoreFocus(focusInfo) {
                    if (!focusInfo) {
                        // Default to first nav button if no focus info
                        const firstButton = document.querySelector('.nav-button');
                        if (firstButton) {
                            firstButton.focus();
                        }
                        return;
                    }
                    
                    let elementToFocus = null;
                    
                    switch (focusInfo.type) {
                        case 'nav-button':
                            const navButtons = document.querySelectorAll('.nav-button');
                            elementToFocus = navButtons[focusInfo.index];
                            break;
                        case 'language-select':
                            elementToFocus = document.getElementById('languageSelect');
                            break;
                        case 'settings-icon':
                            elementToFocus = document.querySelector('.settings-icon');
                            break;
                        case 'action-button':
                            const actionButtons = document.querySelectorAll('.action-button');
                            elementToFocus = actionButtons[focusInfo.index];
                            break;
                    }
                    
                    if (elementToFocus) {
                        elementToFocus.focus();
                    }
                }
                
                function handleButtonClick(command, button) {
                    // Store focus information in VS Code state
                    const focusInfo = storeFocusInfo();
                    vscode.setState({ focusInfo });
                    sendMessage(command);
                }
                
                function handleLanguageChange(selectElement) {
                    // Store focus information in VS Code state
                    const focusInfo = storeFocusInfo();
                    vscode.setState({ focusInfo });
                    sendMessage('changeLanguage', selectElement.value);
                }
                
                function handleShareClick() {
                    // Store focus information in VS Code state
                    const focusInfo = storeFocusInfo();
                    vscode.setState({ focusInfo });
                    
                    const tipTitle = document.querySelector('.tip-title').textContent;
                    const tipContent = document.querySelector('.content').textContent;
                    const shareText = "Here's a VS Code TOTD for you: " + tipTitle + " - " + tipContent;
                    sendMessage('copyToClipboard', shareText);
                }
                
                // Restore focus immediately on DOM load, before browser can auto-focus
                document.addEventListener('DOMContentLoaded', () => {
                    const state = vscode.getState();
                    if (state && state.focusInfo) {
                        // Restore focus immediately
                        restoreFocus(state.focusInfo);
                    } else {
                        // First load - focus first nav button
                        const firstButton = document.querySelector('.nav-button');
                        if (firstButton) {
                            firstButton.focus();
                        }
                    }
                });
                
                // Handle keyboard navigation
                document.addEventListener('keydown', (e) => {
                    // Allow Tab navigation through all interactive elements
                    if (e.key === 'Tab') {
                        return; // Let default tab behavior work
                    }
                    
                    // Support arrow key navigation for previous/next
                    if (e.key === 'ArrowLeft') {
                        const prevButton = document.querySelector('.navigation-controls button:first-child');
                        if (prevButton) {
                            handleButtonClick('previous', prevButton);
                            e.preventDefault();
                        }
                    } else if (e.key === 'ArrowRight') {
                        const nextButton = document.querySelector('.navigation-controls button:last-child');
                        if (nextButton) {
                            handleButtonClick('next', nextButton);
                            e.preventDefault();
                        }
                    }
                });
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
    TipPanel.currentInstance = undefined;
    this._panel.dispose();
  }
}
