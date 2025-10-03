import * as vscode from 'vscode';

export class TipState {
    private static readonly LAST_SHOWN_DATE_KEY = 'tipOfTheDay.lastShownDate';
    private static readonly DISABLED_KEY = 'tipOfTheDay.disabled';
    private static readonly LAST_TIP_INDEX_KEY = 'tipOfTheDay.lastTipIndex';
    private static readonly LANGUAGE_KEY = 'tipOfTheDay.language';
    private static readonly SHOWN_TIPS_KEY = 'tipOfTheDay.shownTips';

    constructor(private context: vscode.ExtensionContext) {}

    public async getLastShownDate(): Promise<string | undefined> {
        return this.context.globalState.get<string>(TipState.LAST_SHOWN_DATE_KEY);
    }

    public async setLastShownDate(date: string): Promise<void> {
        await this.context.globalState.update(TipState.LAST_SHOWN_DATE_KEY, date);
    }

    public async isDisabled(): Promise<boolean> {
        return this.context.globalState.get<boolean>(TipState.DISABLED_KEY, false);
    }

    public async setDisabled(disabled: boolean): Promise<void> {
        await this.context.globalState.update(TipState.DISABLED_KEY, disabled);
    }

    public async getLastTipIndex(): Promise<number> {
        return this.context.globalState.get<number>(TipState.LAST_TIP_INDEX_KEY, -1);
    }

    public async setLastTipIndex(index: number): Promise<void> {
        await this.context.globalState.update(TipState.LAST_TIP_INDEX_KEY, index);
    }

    public async getLanguage(): Promise<string> {
        // Check global state first, then configuration, then default to 'en'
        const stateLanguage = this.context.globalState.get<string>(TipState.LANGUAGE_KEY);
        if (stateLanguage) {
            return stateLanguage;
        }
        
        const config = vscode.workspace.getConfiguration('tipOfTheDay');
        return config.get<string>('language', 'en');
    }

    public async setLanguage(language: string): Promise<void> {
        await this.context.globalState.update(TipState.LANGUAGE_KEY, language);
        
        // Also update the configuration
        const config = vscode.workspace.getConfiguration('tipOfTheDay');
        await config.update('language', language, true);
    }

    public async getShownTips(): Promise<number[]> {
        return this.context.globalState.get<number[]>(TipState.SHOWN_TIPS_KEY, []);
    }

    public async setShownTips(shownTips: number[]): Promise<void> {
        await this.context.globalState.update(TipState.SHOWN_TIPS_KEY, shownTips);
    }

    public async clearState(): Promise<void> {
        await Promise.all([
            this.context.globalState.update(TipState.LAST_SHOWN_DATE_KEY, undefined),
            this.context.globalState.update(TipState.DISABLED_KEY, undefined),
            this.context.globalState.update(TipState.LAST_TIP_INDEX_KEY, undefined),
            this.context.globalState.update(TipState.LANGUAGE_KEY, undefined),
            this.context.globalState.update(TipState.SHOWN_TIPS_KEY, undefined)
        ]);
    }
}
