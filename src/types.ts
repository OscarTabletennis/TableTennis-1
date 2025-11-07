export type ID = string;
export interface Player { id: ID; name: string; createdAt: number; }
export interface Match { id: ID; date: string; aId: ID; bId: ID; aSets: number; bSets: number; note?: string; createdAt: number; }
export interface DB { players: Player[]; matches: Match[]; }
