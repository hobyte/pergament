// SPDX-FileCopyrightText: 2024 hobyte
//
// SPDX-License-Identifier: EPL-2.0

export interface StorageAdapter {
    save(content:string, id: string): void;
    saveSettings(): void;
    loadSettings(): void;
}