import * as vscode from 'vscode';
import { TipState } from './tipState';
import { Tip, TipsData } from './types';
import { OSUtils } from "./osUtils";
import { SUPPORTED_LANGUAGES } from './localization';
import * as fs from "fs";
import * as path from "path";

export class TipManager {
    private tips: Tip[] = [];
    private currentIndex: number = -1;
    private currentLanguage: string = 'en';

  constructor(private context: vscode.ExtensionContext, private state: TipState) {}

    public async initialize(): Promise<void> {
        try {
            // Get current language
            this.currentLanguage = await this.state.getLanguage();
            await this.loadTipsForLanguage(this.currentLanguage);
        } catch (error) {
            // Use a fallback tip if anything goes wrong
            this.tips = [{
                title: 'Welcome to VS Code',
                content: 'It seems we encountered an issue loading the tips. ' +
                        'Please check the extension documentation for troubleshooting steps.'
            }];
            this.currentIndex = 0;
            vscode.window.showErrorMessage(`Tip of the Day: ${error}`);
        }
    }

    private async loadTipsForLanguage(languageCode: string): Promise<void> {
        // First try to load localized tips
        let tipsPath = path.join(this.context.extensionPath, 'data', 'locales', `${languageCode}.json`);
        
        // If localized tips don't exist, fall back to English
        if (!fs.existsSync(tipsPath)) {
            console.log(`Tips for language ${languageCode} not found, falling back to English`);
            tipsPath = path.join(this.context.extensionPath, 'data', 'locales', 'en.json');
        }

        // If English localized tips don't exist, fall back to the main tips.json
        if (!fs.existsSync(tipsPath)) {
            console.log(`Localized tips not found, falling back to main tips.json`);
            tipsPath = path.join(this.context.extensionPath, 'data', 'tips.json');
        }

        // Check if any tips file exists
        if (!fs.existsSync(tipsPath)) {
            throw new Error('No tips files found');
        }

        const tipsContent = fs.readFileSync(tipsPath, 'utf8');
        let tipsData: TipsData;

        try {
            tipsData = JSON.parse(tipsContent);
        } catch (e) {
            throw new Error('Invalid tips file format');
        }

        // Validate tips data structure
        if (!Array.isArray(tipsData.tips)) {
            throw new Error('Invalid tips data structure: tips must be an array');
        }

        // Validate each tip
        for (const tip of tipsData.tips) {
            if (!tip.title || typeof tip.title !== 'string') {
                throw new Error('Invalid tip: missing or invalid title');
            }
            if (!tip.content || typeof tip.content !== 'string') {
                throw new Error('Invalid tip: missing or invalid content');
            }
        }

        this.tips = tipsData.tips;
        
        // Check if it's a new day - if so, select a new random tip
        const lastShownDate = await this.state.getLastShownDate();
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = lastShownDate !== today;
        
        // Restore last index or select a random unshown tip
        this.currentIndex = await this.state.getLastTipIndex();
        if (this.currentIndex === -1 || this.currentIndex >= this.tips.length || isNewDay) {
            this.currentIndex = await this.selectRandomUnshownTip();
        }
    }

    public async changeLanguage(languageCode: string): Promise<void> {
        // Validate language code
        const supportedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
        if (!supportedLanguage) {
            throw new Error(`Unsupported language: ${languageCode}`);
        }

        this.currentLanguage = languageCode;
        await this.state.setLanguage(languageCode);
        await this.loadTipsForLanguage(languageCode);
    }

    public getCurrentLanguage(): string {
        return this.currentLanguage;
    }

    private async selectRandomUnshownTip(): Promise<number> {
        const shownTips = await this.state.getShownTips();
        
        // Get list of unshown tips
        const unshownTips: number[] = [];
        for (let i = 0; i < this.tips.length; i++) {
            if (!shownTips.includes(i)) {
                unshownTips.push(i);
            }
        }
        
        // If all tips have been shown, reset the shown tips list
        if (unshownTips.length === 0) {
            await this.state.setShownTips([]);
            // All tips are now unshown again
            for (let i = 0; i < this.tips.length; i++) {
                unshownTips.push(i);
            }
        }
        
        // Select a random tip from unshown tips
        const randomIndex = Math.floor(Math.random() * unshownTips.length);
        const selectedTipIndex = unshownTips[randomIndex];
        
        // Mark this tip as shown
        const updatedShownTips = await this.state.getShownTips();
        updatedShownTips.push(selectedTipIndex);
        await this.state.setShownTips(updatedShownTips);
        
        return selectedTipIndex;
    }

    public getCurrentTip(): Tip {
        if (this.currentIndex === -1 || this.tips.length === 0) {
            throw new Error("Tips not initialized");
        }
        return this.getOSSpecificTip(this.tips[this.currentIndex]);
    }

  private getOSSpecificTip(tip: Tip): Tip {
    // If the tip has OS-specific shortcuts, use them
    if (tip.shortcuts) {
      const osSpecificShortcut = OSUtils.getOSSpecificShortcut(tip.shortcuts);
      return {
        ...tip,
        content: tip.content.replace(/\{shortcut\}/g, osSpecificShortcut),
      };
    }

    // Otherwise, replace common shortcuts with OS-specific ones
    let content = tip.content;

    // Replace Ctrl with Cmd on macOS
    if (OSUtils.isMacOS()) {
      content = content.replace(/\bCtrl\+/g, "Cmd+");
      content = content.replace(/\bAlt\b/g, "Option");
    }

    return {
      ...tip,
      content,
    };
  }

  public async nextTip(): Promise<Tip> {
    if (this.tips.length === 0) {
      throw new Error("No tips available");
    }
    this.currentIndex = (this.currentIndex + 1) % this.tips.length;
    await this.state.setLastTipIndex(this.currentIndex);
    return this.getCurrentTip();
  }

  public async previousTip(): Promise<Tip> {
    if (this.tips.length === 0) {
      throw new Error("No tips available");
    }
    this.currentIndex = (this.currentIndex - 1 + this.tips.length) % this.tips.length;
    await this.state.setLastTipIndex(this.currentIndex);
    return this.getCurrentTip();
  }

  public async randomTip(): Promise<Tip> {
    if (this.tips.length === 0) {
      throw new Error("No tips available");
    }

    if (this.tips.length === 1) {
      return this.getCurrentTip();
    }

    // Select a random unshown tip
    this.currentIndex = await this.selectRandomUnshownTip();
    await this.state.setLastTipIndex(this.currentIndex);
    return this.getCurrentTip();
  }

  public isFirstTip(): boolean {
    return this.currentIndex === 0;
  }

  public hasTips(): boolean {
    return this.tips.length > 0;
  }
}
