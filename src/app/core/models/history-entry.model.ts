export interface IHistoryEntry {
  id: string;
  fileName: string;
  originalDataUrl: string;
  resultDataUrl: string;
  processedAt: string; // ISO string for localStorage serialization
  fileSize: number;
}
