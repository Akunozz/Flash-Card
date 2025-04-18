"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Deck } from "@/components/Cards/deck-list"

export default function AdicionarCard({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim() || !answer.trim()) {
      alert({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    // Gerar ID único para o card
    const cardId = Date.now().toString()

    // Buscar cards existentes
    const allCards = JSON.parse(localStorage.getItem("flashcards-cards") || "{}")
    const deckCards = allCards[id] || []

    // Adicionar novo card
    const newCard = { id: cardId, question, answer }
    const updatedCards = [...deckCards, newCard]

    // Atualizar localStorage
    allCards[id] = updatedCards
    localStorage.setItem("flashcards-cards", JSON.stringify(allCards))

    // Atualizar contagem de cards no baralho
    const decks = JSON.parse(localStorage.getItem("flashcards-decks") || "[]")
    const updatedDecks = decks.map((deck: any) => {
      if (deck.id === id) {
        return { ...deck, cardCount: updatedCards.length }
      }
      return deck
    })
    localStorage.setItem("flashcards-decks", JSON.stringify(updatedDecks))

    alert({
      title: "Card adicionado",
      description: "Seu novo card foi adicionado com sucesso.",
    })

    // Limpar formulário
    setQuestion("")
    setAnswer("")

    // Redirecionar para a página do baralho
    router.push(`/baralho/${id}`)
  }

  if (!deck) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <div className="mb-6">
        <Link href={`/baralho/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o baralho
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Card ao Baralho: {deck.title}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="question">Pergunta</Label>
                <Textarea
                  id="question"
                  placeholder="Digite a pergunta do card..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="answer">Resposta</Label>
                <Textarea
                  id="answer"
                  placeholder="Digite a resposta do card..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/baralho/${id}`}>
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit">Adicionar Card</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
