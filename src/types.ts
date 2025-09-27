export interface Tip {
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
