"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export interface FlashCard {
  id: string
  question: string
  answer: string
}

export default function CardList({ deckId }: { deckId: string }) {
  const [cards, setCards] = useState<FlashCard[]>([])
  
  useEffect(() => {
    // Carregar cards do localStorage
    const allCards = JSON.parse(localStorage.getItem("flashcards-cards") || "{}")
    const deckCards = allCards[deckId] || []
    setCards(deckCards)
  }, [deckId])

  const deleteCard = (cardId: string) => {
    // Remover card
    const updatedCards = cards.filter((card) => card.id !== cardId)
    setCards(updatedCards)

    // Atualizar localStorage
    const allCards = JSON.parse(localStorage.getItem("flashcards-cards") || "{}")
    allCards[deckId] = updatedCards
    localStorage.setItem("flashcards-cards", JSON.stringify(allCards))

    // Atualizar contagem de cards no baralho
    const decks = JSON.parse(localStorage.getItem("flashcards-decks") || "[]")
    const updatedDecks = decks.map((deck: any) => {
      if (deck.id === deckId) {
        return { ...deck, cardCount: updatedCards.length }
      }
      return deck
    })
    localStorage.setItem("flashcards-decks", JSON.stringify(updatedDecks))

    alert({
      title: "Card excluído",
      description: "O card foi removido com sucesso.",
    })
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Nenhum card encontrado</h3>
        <p className="text-muted-foreground">Adicione cards para começar a estudar</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.id} className="relative">
          <CardHeader className="pb-2">
            <div className="absolute top-2 right-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir card</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir este card? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteCard(card.id)}>Excluir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Pergunta:</h3>
              <p className="text-lg">{card.question}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Resposta:</h3>
              <p className="text-lg">{card.answer}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
