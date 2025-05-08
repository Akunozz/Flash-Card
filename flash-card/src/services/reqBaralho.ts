// src/services/flashcard/reqBaralho.ts

import axios from 'axios';

export interface Carta {
  id: string;
  frente: string;
  verso: string;
}

export interface Baralho {
  id: string;
  cartas: Carta[];
  startedAt: string;
  finishedAt: string;
  name:string;
}

const BASE_URL = 'https://681bfe896ae7c794cf706137.mockapi.io/api/flashcard';

export async function fetchBaralhos(): Promise<Baralho[]> {
  try {
    const response = await axios.get<Baralho[]>(`${BASE_URL}/baralho`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Erro ao buscar baralhos: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Nenhuma resposta do servidor ao buscar baralhos');
    } else {
      throw new Error(`Erro inesperado: ${error.message}`);
    }
  }
}

/**
 * Cria um novo baralho no servidor.
 * @param baralho Objeto parcial sem ID
 */
export async function createBaralho(baralho: Omit<Baralho, 'id'>): Promise<Baralho> {
  try {
    const response = await axios.post<Baralho>(`${BASE_URL}/baralho`, baralho);
    return response.data;
  } catch (error: any) {
    throw new Error(`Erro ao criar baralho: ${error.message}`);
  }
}

/**
 * Deleta um baralho pelo ID.
 * @param id ID do baralho a ser removido
 */
export async function deleteBaralho(id: string): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/baralho/${id}`);
  } catch (error: any) {
    throw new Error(`Erro ao deletar baralho: ${error.message}`);
  }
}
