export interface Pokemon {
    id: number;
    number: number;
    name: string;
    type_one: string;
    type_two: string;
    total: number;
    hit_points: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
    generation: number;
    legendary: boolean;
    captured: boolean;
    imageUrl: string;
}

export interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    capturedCount: number;
}

export interface FilterMetadata {
    sort: 'asc' | 'desc';
    type: string | null;
    search: string | null;
}

export interface PokemonResponse {
    success: boolean;
    data: Pokemon[];
    pagination: PaginationMetadata;
    filters: FilterMetadata;
    error?: string;
    maxPage?: number;
}

export interface TypesResponse {
    success: boolean;
    types: string[];
}

export type SortOrder = 'asc' | 'desc';
export type Theme = 'light' | 'dark' | 'system';
