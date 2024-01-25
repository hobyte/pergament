export interface StorageAdapter {
    save(content:string, id: string) : void;
}