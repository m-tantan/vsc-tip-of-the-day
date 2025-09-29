export interface Tip {
  /** Optional stable numeric id to map across locales */
  id?: number;
  title: string;
  content: string;
  shortcuts?: OSSpecificShortcuts;
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
