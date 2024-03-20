export interface StorageAdapter {
    save(content:string, id: string): void;
    saveSettings(): void;
    loadSettings(): void;
}