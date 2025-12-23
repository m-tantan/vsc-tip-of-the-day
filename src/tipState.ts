import * as vscode from 'vscode';

export class TipState {
    private static readonly LAST_SHOWN_DATE_KEY = 'tipOfTheDay.lastShownDate';
    private static readonly LAST_SHOWN_TIMESTAMP_KEY = 'tipOfTheDay.lastShownTimestamp';
    private static readonly DISABLED_KEY = 'tipOfTheDay.disabled';
    private static readonly LAST_TIP_INDEX_KEY = 'tipOfTheDay.lastTipIndex';
    private static readonly LANGUAGE_KEY = 'tipOfTheDay.language';
    private static readonly SHOWN_TIPS_KEY = 'tipOfTheDay.shownTips';
    private static readonly FAVORITES_KEY = 'tipOfTheDay.favorites';
    private static readonly HAS_OPENED_FAVORITES_KEY = 'tipOfTheDay.hasOpenedFavorites';

    constructor(private context: vscode.ExtensionContext) {}

    public async getLastShownDate(): Promise<string | undefined> {
        return this.context.globalState.get<string>(TipState.LAST_SHOWN_DATE_KEY);
    }

    public async setLastShownDate(date: string): Promise<void> {
        await this.context.globalState.update(TipState.LAST_SHOWN_DATE_KEY, date);
    }

    public async getLastShownTimestamp(): Promise<number | undefined> {
        return this.context.globalState.get<number>(TipState.LAST_SHOWN_TIMESTAMP_KEY);
    }

    public async setLastShownTimestamp(timestamp: number): Promise<void> {
        await this.context.globalState.update(TipState.LAST_SHOWN_TIMESTAMP_KEY, timestamp);
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

    public async getFavorites(): Promise<number[]> {
        return this.context.globalState.get<number[]>(TipState.FAVORITES_KEY, []);
    }

    public async setFavorites(favorites: number[]): Promise<void> {
        await this.context.globalState.update(TipState.FAVORITES_KEY, favorites);
    }

    public async addFavorite(tipId: number): Promise<void> {
        const favorites = await this.getFavorites();
        if (!favorites.includes(tipId)) {
            favorites.push(tipId);
            await this.setFavorites(favorites);
        }
    }

    public async removeFavorite(tipId: number): Promise<void> {
        const favorites = await this.getFavorites();
        const filtered = favorites.filter(id => id !== tipId);
        await this.setFavorites(filtered);
    }

    public async isFavorite(tipId: number): Promise<boolean> {
        const favorites = await this.getFavorites();
        return favorites.includes(tipId);
    }

    public async hasOpenedFavorites(): Promise<boolean> {
        return this.context.globalState.get<boolean>(TipState.HAS_OPENED_FAVORITES_KEY, false);
    }

    public async setHasOpenedFavorites(hasOpened: boolean): Promise<void> {
        await this.context.globalState.update(TipState.HAS_OPENED_FAVORITES_KEY, hasOpened);
    }

    public async clearState(): Promise<void> {
        await Promise.all([
            this.context.globalState.update(TipState.LAST_SHOWN_DATE_KEY, undefined),
            this.context.globalState.update(TipState.LAST_SHOWN_TIMESTAMP_KEY, undefined),
            this.context.globalState.update(TipState.DISABLED_KEY, undefined),
            this.context.globalState.update(TipState.LAST_TIP_INDEX_KEY, undefined),
            this.context.globalState.update(TipState.LANGUAGE_KEY, undefined),
            this.context.globalState.update(TipState.SHOWN_TIPS_KEY, undefined),
            this.context.globalState.update(TipState.FAVORITES_KEY, undefined),
            this.context.globalState.update(TipState.HAS_OPENED_FAVORITES_KEY, undefined)
        ]);
    }
}
