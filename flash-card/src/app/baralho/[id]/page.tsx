"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import type { Deck } from "@/components/Cards/deck-list"
import CardList from "@/components/Cards/card-list"

export default function BaralhoPage({ params }: { params: { id: string } }) {
  const [deck, setDeck] = useState<Deck | null>(null)
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    // Carregar informações do baralho
    const storedDecks = JSON.parse(localStorage.getItem("flashcards-decks") || "[]")
    const currentDeck = storedDecks.find((d: Deck) => d.id === id)

    if (!currentDeck) {
      alert({
        title: "Baralho não encontrado",
        description: "O baralho solicitado não existe.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    setDeck(currentDeck)
  }, [id, router, alert])

  if (!deck) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{deck.title}</h1>
          <p className="text-muted-foreground">{deck.cardCount} cards</p>
        </div>
        <div className="flex space-x-2">
          <Link href={`/baralho/${id}/adicionar`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Card
            </Button>
          </Link>
          {deck.cardCount > 0 && (
            <Link href={`/baralho/${id}/estudar`}>
              <Button variant="secondary">Estudar</Button>
            </Link>
          )}
        </div>
      </div>

      <CardList deckId={id} />
    </div>
  )
}
