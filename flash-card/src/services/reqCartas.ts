// src/services/flashcard/reqCartas.ts

import axios from "axios"

export interface Carta {
  id: string
  name: string
  imagem: string
  avatar: string
  resposta: string
}

const BASE_URL = "https://681bfe896ae7c794cf706137.mockapi.io/api/flashcard/cartas"

// GET - Buscar todas as cartas
export async function fetchCartas(): Promise<Carta[]> {
  try {
    const response = await axios.get<Carta[]>(BASE_URL)
    return response.data
  } catch (error: any) {
    throw new Error(`Erro ao buscar cartas: ${error.message}`)
  }
}

// POST - Criar nova carta
export async function createCarta(carta: Omit<Carta, "id">): Promise<Carta> {
  try {
    const response = await axios.post<Carta>(BASE_URL, carta)
    return response.data
  } catch (error: any) {
    throw new Error(`Erro ao criar carta: ${error.message}`)
  }
}

// PUT - Atualizar uma carta
export async function updateCarta(id: string, carta: Partial<Carta>): Promise<Carta> {
  try {
    const response = await axios.put<Carta>(`${BASE_URL}/${id}`, carta)
    return response.data
  } catch (error: any) {
    throw new Error(`Erro ao atualizar carta: ${error.message}`)
  }
}

// DELETE - Remover uma carta
export async function deleteCarta(id: string): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/${id}`)
  } catch (error: any) {
    throw new Error(`Erro ao deletar carta: ${error.message}`)
  }
}
