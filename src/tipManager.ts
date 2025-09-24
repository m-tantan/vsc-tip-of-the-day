import * as vscode from 'vscode';
import { TipState } from './tipState';
import { Tip, TipsData } from './types';
import { OSUtils } from "./osUtils";
import * as fs from "fs";
import * as path from "path";

export class TipManager {
  private tips: Tip[] = [];
  private currentIndex: number = -1;

  constructor(private context: vscode.ExtensionContext, private state: TipState) {}

  public async initialize(): Promise<void> {
    try {
      const tipsPath = path.join(this.context.extensionPath, "data", "tips.json");

      // Check if tips.json exists
      if (!fs.existsSync(tipsPath)) {
        throw new Error("tips.json not found");
      }

      const tipsContent = fs.readFileSync(tipsPath, "utf8");
      let tipsData: TipsData;

      try {
        tipsData = JSON.parse(tipsContent);
      } catch (e) {
        throw new Error("Invalid tips.json format");
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

      // Restore last index or calculate today's index
      this.currentIndex = await this.state.getLastTipIndex();
      if (this.currentIndex === -1 || this.currentIndex >= this.tips.length) {
        this.currentIndex = this.calculateTipIndex();
      }
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

  private calculateTipIndex(): number {
    const hoursIndex = Math.floor(Date.now() / (1000 * 60 * 60));
    return hoursIndex % this.tips.length;
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

    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * this.tips.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
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
