"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Plus, Trash2, PlusCircle } from "lucide-react"
import Link from "next/link"
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

export interface Deck {
  id: string
  title: string
  cardCount: number
}

export default function DeckList() {
  const [decks, setDecks] = useState<Deck[]>([])

  useEffect(() => {
    // Carregar baralhos do localStorage
    const storedDecks = localStorage.getItem("flashcards-decks")
    if (storedDecks) {
      setDecks(JSON.parse(storedDecks))
    } else {
      // Dados de exemplo para primeira execução
      const exampleDecks = [
        { id: "1", title: "Matemática", cardCount: 10 },
        { id: "2", title: "Inglês", cardCount: 15 },
        { id: "3", title: "Ciências", cardCount: 8 },
      ]
      setDecks(exampleDecks)
      localStorage.setItem("flashcards-decks", JSON.stringify(exampleDecks))
    }
  }, [])

  const deleteDeck = (id: string) => {
    const updatedDecks = decks.filter((deck) => deck.id !== id)
    setDecks(updatedDecks)
    localStorage.setItem("flashcards-decks", JSON.stringify(updatedDecks))

    // Também remover os cards deste baralho
    const allCards = JSON.parse(localStorage.getItem("flashcards-cards") || "{}")
    delete allCards[id]
    localStorage.setItem("flashcards-cards", JSON.stringify(allCards))

    alert({
      title: "Baralho excluído",
      description: "O baralho foi removido com sucesso.",
    })
  }

  if (decks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Nenhum baralho encontrado</h3>
        <p className="text-muted-foreground mb-6">Crie seu primeiro baralho para começar a estudar</p>
        <Link href="/criar-baralho">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Baralho
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <Card key={deck.id}>
          <CardHeader>
            <CardTitle>{deck.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{deck.cardCount} cards</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Link href={`/baralho/${deck.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Cards
                </Button>
              </Link>
              <Link href={`/baralho/${deck.id}/adicionar`}>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Card
                </Button>
              </Link>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir baralho</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este baralho? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteDeck(deck.id)}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
