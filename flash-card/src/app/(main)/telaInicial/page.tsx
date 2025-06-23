"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import DeckList from "@/components/Cards/deck-list"

interface DeckAPI {
  id: number
  nome: string
  numero_de_cards: number
  ordem_dos_cards: { ordem: number[] }
  criador: number
}

export default function Home() {
  const [decks, setDecks] = useState<DeckAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDecks() {
      try {
        const id = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        if (!id) throw new Error("Usuário não identificado");
        const resp = await axios.get<DeckAPI[]>(
          `https://flashcards-erbw.onrender.com/decks_usuario/${id}`
        );
        setDecks(resp.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    carregarDecks()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Aplicativo de Flash Cards</h1>
        <p className="text-muted-foreground">
          Crie e estude seus flash cards para memorizar melhor
        </p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Seus Baralhos</h2>
        <Link href="/baralho/criar">
          <Button className="bg-green-500 hover:bg-green-600 text-white dark:text-black">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Baralho
          </Button>
        </Link>
      </div>

      {loading && <p>Carregando baralhos...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <DeckList data={decks} showStudyButton />
      )}
    </div>
  )
}
