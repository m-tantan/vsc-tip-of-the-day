import * as vscode from 'vscode';
import { TipManager } from '../tipManager';
import { TipState } from '../tipState';

export class TipPanel {
  private static currentInstance: TipPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly disposables: vscode.Disposable[] = [];

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

    this._panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case "next":
            await tipManager.randomTip();
            await this.updateContent();
            break;
          case "previous":
            await tipManager.previousTip();
            await this.updateContent();
            break;
          case "dismissToday":
            await state.setLastShownDate(new Date().toISOString().split("T")[0]);
            this.dispose();
            break;
          case "dismissForever":
            await state.setDisabled(true);
            const config = vscode.workspace.getConfiguration("tipOfTheDay");
            await config.update("enabled", false, true);
            this.dispose();
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
    const isFirstTip = this.tipManager.isFirstTip();

    const styleUri = this._panel.webview.asWebviewUri(
      vscode.Uri.file(vscode.Uri.joinPath(vscode.Uri.file(this.extensionPath), "media", "styles.css").fsPath)
    );

    this._panel.webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="${styleUri}">
            <title>Tip of the Day</title>
        </head>
        <body>
            <div class="container">
                <h1 class="title">💡 Tip Of The Day 💡</h1>
                <h2 class="title">${tip.title}</h2>
                <div class="content">${tip.content}</div>
                <div class="controls">
                    <div class="navigation-controls">
                        <button class="nav-button" onclick="sendMessage('previous')">Previous</button>
                        <button class="nav-button" onclick="sendMessage('next')">Next</button>
                    </div>
                    <div class="action-controls">
                        <div class="dismiss-controls">
                            <button class="action-button" onclick="sendMessage('dismissToday')">Dismiss Today</button>
                            <button class="action-button" onclick="sendMessage('dismissForever')">Dismiss Forever</button>
                        </div>
                    </div>
                </div>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                function sendMessage(command) {
                    vscode.postMessage({ command: command });
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
    TipPanel.currentInstance = undefined;
    this._panel.dispose();
  }
}
