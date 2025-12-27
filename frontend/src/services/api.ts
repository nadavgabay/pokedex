import axios from 'axios';
import type { PokemonResponse, TypesResponse, SortOrder } from '../types/pokemon';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface GetPokemonParams {
    page?: number;
    limit?: number;
    sort?: SortOrder;
    type?: string;
    search?: string;
}

export const getPokemon = async (params: GetPokemonParams = {}): Promise<PokemonResponse> => {
    try {
        const response = await api.get<PokemonResponse>('/pokemon', { params });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw error;
    }
};

export const getTypes = async (): Promise<TypesResponse> => {
    const response = await api.get<TypesResponse>('/pokemon/types');
    return response.data;
};

export const capturePokemon = async (id: number): Promise<{ success: boolean; message: string; captured: boolean }> => {
    const response = await api.post(`/pokemon/${id}/capture`);
    return response.data;
};

export const releasePokemon = async (id: number): Promise<{ success: boolean; message: string; captured: boolean }> => {
    const response = await api.post(`/pokemon/${id}/release`);
    return response.data;
};

export default api;
