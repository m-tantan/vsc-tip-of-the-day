import * as vscode from 'vscode';
import { TipManager } from '../tipManager';
import { TipState } from '../tipState';

export class TipPanel {
    private static currentInstance: TipPanel | undefined;
    private readonly disposables: vscode.Disposable[] = [];

    private constructor(
        private readonly tipManager: TipManager,
        private readonly state: TipState
    ) {}

    public static async show(
        extensionPath: string,
        tipManager: TipManager,
        state: TipState
    ): Promise<void> {
        // Create or get instance
        if (!TipPanel.currentInstance) {
            TipPanel.currentInstance = new TipPanel(tipManager, state);
        }

        try {
            const tip = tipManager.getCurrentTip();
            const isFirstTip = tipManager.isFirstTip();

            const nextButton: vscode.MessageItem = { title: 'Next' };
            const previousButton: vscode.MessageItem = { title: 'Previous' };
            const randomButton: vscode.MessageItem = { title: 'Random' };
            const dismissTodayButton: vscode.MessageItem = { title: 'Dismiss Today' };
            const dismissForeverButton: vscode.MessageItem = { title: 'Dismiss Forever' };

            const buttons = isFirstTip ? 
                [nextButton, randomButton, dismissTodayButton, dismissForeverButton] :
                [previousButton, nextButton, randomButton, dismissTodayButton, dismissForeverButton];

            const selection = await vscode.window.showInformationMessage(
              `💡 Tip Of The Day 💡\r\n\r\n${tip.title}\r\n\r\n${tip.content}`,
              { modal: true },
              ...buttons
            );

            if (selection) {
                switch (selection) {
                    case nextButton:
                        await tipManager.nextTip();
                        await TipPanel.show(extensionPath, tipManager, state);
                        break;
                    case previousButton:
                        await tipManager.previousTip();
                        await TipPanel.show(extensionPath, tipManager, state);
                        break;
                    case randomButton:
                        await tipManager.randomTip();
                        await TipPanel.show(extensionPath, tipManager, state);
                        break;
                    case dismissTodayButton:
                        await state.setLastShownDate(new Date().toISOString().split('T')[0]);
                        TipPanel.currentInstance.dispose();
                        break;
                    case dismissForeverButton:
                        await state.setDisabled(true);
                        const config = vscode.workspace.getConfiguration('tipOfTheDay');
                        await config.update('enabled', false, true);
                        TipPanel.currentInstance.dispose();
                        break;
                }
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to show tip: ${error}`);
            if (TipPanel.currentInstance) {
                TipPanel.currentInstance.dispose();
            }
        }
    }

    public dispose(): void {
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
        TipPanel.currentInstance = undefined;
    }
}
