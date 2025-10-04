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
  private currentLanguage: string = "en";

  constructor(private context: vscode.ExtensionContext, private state: TipState) {}

  public async initialize(): Promise<void> {
    try {
      // Get current language
      this.currentLanguage = await this.state.getLanguage();
      await this.loadTipsForLanguage(this.currentLanguage);
    } catch (error) {
      // Use a fallback tip if anything goes wrong
      this.tips = [
        {
          title: "Welcome to VS Code",
          content:
            "It seems we encountered an issue loading the tips. " +
            "Please check the extension documentation for troubleshooting steps.",
        },
      ];
      this.currentIndex = 0;
      vscode.window.showErrorMessage(`Tip of the Day: ${error}`);
    }
  }

  private async loadTipsForLanguage(languageCode: string): Promise<void> {
    // First try to load localized tips
    let tipsPath = path.join(this.context.extensionPath, "data", "locales", `${languageCode}.json`);

    // If localized tips don't exist, fall back to English
    if (!fs.existsSync(tipsPath)) {
      console.log(`Tips for language ${languageCode} not found, falling back to English`);
      tipsPath = path.join(this.context.extensionPath, "data", "locales", "en.json");
    }

    // If English localized tips don't exist, fall back to the main tips.json
    if (!fs.existsSync(tipsPath)) {
      console.log(`Localized tips not found, falling back to main tips.json`);
      tipsPath = path.join(this.context.extensionPath, "data", "tips.json");
    }

    // Check if any tips file exists
    if (!fs.existsSync(tipsPath)) {
      throw new Error("No tips files found");
    }

    const tipsContent = fs.readFileSync(tipsPath, "utf8");
    let tipsData: TipsData;

    try {
      tipsData = JSON.parse(tipsContent);
    } catch (e) {
      throw new Error("Invalid tips file format");
    }

    // Validate tips data structure
    if (!Array.isArray(tipsData.tips)) {
      throw new Error("Invalid tips data structure: tips must be an array");
    }

    // Validate each tip
    for (const tip of tipsData.tips) {
      if (!tip.title || typeof tip.title !== "string") {
        throw new Error("Invalid tip: missing or invalid title");
      }
      if (!tip.content || typeof tip.content !== "string") {
        throw new Error("Invalid tip: missing or invalid content");
      }
    }

    this.tips = tipsData.tips;

    // Check if it's a new day - if so, select a new random tip
    const lastShownDate = await this.state.getLastShownDate();
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = lastShownDate !== today;

    // Restore last index or select a random tip on new day
    this.currentIndex = await this.state.getLastTipIndex();
    if (this.currentIndex === -1 || this.currentIndex >= this.tips.length || isNewDay) {
      // Get shown tips history
      const shownTips = await this.state.getShownTips();

      // Select a random tip index avoiding recently shown tips
      this.currentIndex = await this.selectRandomTipAvoidingHistory(shownTips);
      await this.state.setLastTipIndex(this.currentIndex);

      // Update the shown tips history
      await this.updateShownTipsHistory(this.currentIndex);
    }
  }

  public async changeLanguage(languageCode: string): Promise<void> {
    // Validate language code
    const supportedLanguage = SUPPORTED_LANGUAGES.find((lang) => lang.code === languageCode);
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

  public getCurrentTip(): Tip {
    if (this.currentIndex === -1 || this.tips.length === 0) {
      throw new Error("Tips not initialized");
    }
    return this.getOSSpecificTip(this.tips[this.currentIndex]);
  }

  /**
   * Selects a random tip index while avoiding recently shown tips
   * @param shownTips Array of recently shown tip indices
   * @returns A random tip index that hasn't been shown recently (if possible)
   */
  private async selectRandomTipAvoidingHistory(shownTips: number[]): Promise<number> {
    const totalTips = this.tips.length;

    // If we have fewer tips than the history size, just pick randomly
    if (totalTips <= shownTips.length) {
      return Math.floor(Math.random() * totalTips);
    }

    // Get indices of tips that haven't been shown recently
    const availableTips: number[] = [];
    for (let i = 0; i < totalTips; i++) {
      if (!shownTips.includes(i)) {
        availableTips.push(i);
      }
    }

    // If all tips have been shown recently, clear history and start fresh
    if (availableTips.length === 0) {
      await this.state.setShownTips([]);
      return Math.floor(Math.random() * totalTips);
    }

    // Select randomly from available tips
    const randomIndex = Math.floor(Math.random() * availableTips.length);
    return availableTips[randomIndex];
  }

  /**
   * Updates the shown tips history by adding the current tip and maintaining max size
   * @param tipIndex The index of the tip to add to history
   */
  private async updateShownTipsHistory(tipIndex: number): Promise<void> {
    const shownTips = await this.state.getShownTips();

    // Add current tip to the beginning of the history
    const updatedHistory = [tipIndex, ...shownTips.filter((i) => i !== tipIndex)];

    await this.state.setShownTips(updatedHistory);
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

    // Cycle to first tip if at the end, otherwise move to next
    this.currentIndex = (this.currentIndex + 1) % this.tips.length;
    await this.state.setLastTipIndex(this.currentIndex);

    return this.getCurrentTip();
  }

  public async previousTip(): Promise<Tip> {
    if (this.tips.length === 0) {
      throw new Error("No tips available");
    }

    // Cycle to last tip if at the beginning, otherwise move to previous
    this.currentIndex = (this.currentIndex - 1 + this.tips.length) % this.tips.length;
    await this.state.setLastTipIndex(this.currentIndex);

    return this.getCurrentTip();
  }

  public async showRandomTip(): Promise<Tip> {
    if (this.tips.length === 0) {
      throw new Error("No tips available");
    }

    // Get shown tips history
    const shownTips = await this.state.getShownTips();

    // Select a random tip index avoiding recently shown tips
    this.currentIndex = await this.selectRandomTipAvoidingHistory(shownTips);
    await this.state.setLastTipIndex(this.currentIndex);

    // Update the shown tips history
    await this.updateShownTipsHistory(this.currentIndex);

    return this.getCurrentTip();
  }

  public isFirstTip(): boolean {
    return this.currentIndex === 0;
  }

  public isLastTip(): boolean {
    return this.currentIndex === this.tips.length - 1;
  }

  public hasTips(): boolean {
    return this.tips.length > 0;
  }
}
