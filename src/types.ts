export interface Tip {
  /** Optional stable numeric id to map across locales */
  id?: number;
  title: string;
  content: string;
  shortcuts?: OSSpecificShortcuts;
  /** Optional GitHub username of the tip contributor */
  source?: string;
}

export interface TipsData {
  tips: Tip[];
}

export interface OSSpecificShortcuts {
  default: string;
  windows?: string;
  macOS?: string;
  linux?: string;
}
