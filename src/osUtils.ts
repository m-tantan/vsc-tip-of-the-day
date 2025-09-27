import * as os from "os";
import * as vscode from "vscode";
import { OSSpecificShortcuts } from "./types";

export enum OSType {
  Windows = "Windows",
  macOS = "macOS",
  Linux = "Linux",
  Other = "Other",
}

export class OSUtils {
  private static _osType: OSType | undefined;
  private static _hasInitializedSettings = false;

  /**
   * Auto-detect the operating system type
   */
  private static autoDetectOSType(): OSType {
    const platform = os.platform();

    switch (platform) {
      case "win32":
        return OSType.Windows;
      case "darwin":
        return OSType.macOS;
      case "linux":
        return OSType.Linux;
      default:
        return OSType.Other;
    }
  }

  /**
   * Initialize OS settings with auto-detection if needed
   */
  private static async initializeOSSettings(): Promise<void> {
    if (this._hasInitializedSettings) {
      return;
    }

    const config = vscode.workspace.getConfiguration("tipOfTheDay");
    const currentSetting = config.get<string>("operatingSystem", "auto");

    // If set to auto, just detect the OS type without updating the setting
    if (currentSetting === "auto") {
      // Optionally, you could prompt the user or handle initialization elsewhere
      // const detectedOS = this.autoDetectOSType();
      // No update to configuration here
    }

    this._hasInitializedSettings = true;
  }

  /**
   * Get the current operating system type from settings or auto-detect
   */
  public static async getOSType(): Promise<OSType> {
    await this.initializeOSSettings();

    const config = vscode.workspace.getConfiguration("tipOfTheDay");
    const osSetting = config.get<string>("operatingSystem", "auto");

    if (osSetting === "auto") {
      return this.autoDetectOSType();
    }

    // Parse the setting value
    switch (osSetting) {
      case "Windows":
        return OSType.Windows;
      case "macOS":
        return OSType.macOS;
      case "Linux":
        return OSType.Linux;
      default:
        return this.autoDetectOSType();
    }
  }

  /**
   * Get the current operating system type synchronously (for backward compatibility)
   * This will return the cached value or auto-detected value
   */
  public static getOSTypeSync(): OSType {
    if (this._osType) {
      return this._osType;
    }

    // Try to get from settings synchronously
    const config = vscode.workspace.getConfiguration("tipOfTheDay");
    const osSetting = config.get<string>("operatingSystem", "auto");

    if (osSetting !== "auto") {
      switch (osSetting) {
        case "Windows":
          this._osType = OSType.Windows;
          break;
        case "macOS":
          this._osType = OSType.macOS;
          break;
        case "Linux":
          this._osType = OSType.Linux;
          break;
        default:
          this._osType = this.autoDetectOSType();
          break;
      }
    } else {
      this._osType = this.autoDetectOSType();
    }

    return this._osType;
  }

  /**
   * Clear the cached OS type (useful when settings change)
   */
  public static clearCache(): void {
    this._osType = undefined;
  }

  /**
   * Check if the current OS is Windows
   */
  public static isWindows(): boolean {
    return this.getOSTypeSync() === OSType.Windows;
  }

  /**
   * Check if the current OS is macOS
   */
  public static isMacOS(): boolean {
    return this.getOSTypeSync() === OSType.macOS;
  }

  /**
   * Check if the current OS is Linux
   */
  public static isLinux(): boolean {
    return this.getOSTypeSync() === OSType.Linux;
  }

  /**
   * Get the appropriate modifier key for the current OS
   * Returns 'Cmd' for macOS, 'Ctrl' for others
   */
  public static getModifierKey(): string {
    return this.isMacOS() ? "Cmd" : "Ctrl";
  }

  /**
   * Get the appropriate alt key for the current OS
   * Returns 'Option' for macOS, 'Alt' for others
   */
  public static getAltKey(): string {
    return this.isMacOS() ? "Option" : "Alt";
  }

  /**
   * Format a keyboard shortcut based on the current OS
   */
  public static formatShortcut(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];

    if (shortcut.ctrl) {
      parts.push(this.getModifierKey());
    }

    if (shortcut.alt) {
      parts.push(this.getAltKey());
    }

    if (shortcut.shift) {
      parts.push("Shift");
    }

    if (shortcut.key) {
      parts.push(shortcut.key);
    }

    return parts.join("+");
  }

  /**
   * Get OS-specific keyboard shortcut
   */
  public static getOSSpecificShortcut(shortcuts: OSSpecificShortcuts): string {
    const osType = this.getOSTypeSync();

    switch (osType) {
      case OSType.macOS:
        return shortcuts.macOS || shortcuts.default;
      case OSType.Windows:
        return shortcuts.windows || shortcuts.default;
      case OSType.Linux:
        return shortcuts.linux || shortcuts.default;
      default:
        return shortcuts.default;
    }
  }
}

/**
 * Interface for defining keyboard shortcuts programmatically
 */
export interface KeyboardShortcut {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  key: string;
}
