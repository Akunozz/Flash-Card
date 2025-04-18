"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"
import type { Deck } from "@/components/Cards/deck-list"
import type { FlashCard } from "@/components/Cards/card-list"
import { Progress } from "@/components/ui/progress"

export default function EstudarPage({ params }: { params: { id: string } }) {
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<FlashCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 })

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

    // Carregar cards
    const allCards = JSON.parse(localStorage.getItem("flashcards-cards") || "{}")
    const deckCards = allCards[id] || []

    if (deckCards.length === 0) {
      alert({
        title: "Sem cards",
        description: "Este baralho não possui cards para estudar.",
        variant: "destructive",
      })
      router.push(`/baralho/${id}`)
      return
    }

    // Embaralhar os cards
    const shuffledCards = [...deckCards].sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setProgress(0)
  }, [id, router, alert])

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleResponse = (correct: boolean) => {
    // Atualizar estatísticas
    if (correct) {
      setStats((prev) => ({ ...prev, correct: prev.correct + 1 }))
    } else {
      setStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }))
    }

    // Verificar se é o último card
    if (currentCardIndex === cards.length - 1) {
      setCompleted(true)
    } else {
      // Avançar para o próximo card
      setCurrentCardIndex((prev) => prev + 1)
      setShowAnswer(false)
    }

    // Atualizar progresso
    const newProgress = ((currentCardIndex + 1) / cards.length) * 100
    setProgress(newProgress)
  }

  const resetStudy = () => {
    // Embaralhar os cards novamente
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setCompleted(false)
    setProgress(0)
    setStats({ correct: 0, incorrect: 0 })
  }

  if (!deck || cards.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const currentCard = cards[currentCardIndex]

  return (
    <div className="container mx-auto py-8 px-4 max-w-lg">
      <div className="mb-6">
        <Link href={`/baralho/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o baralho
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Estudando: {deck.title}</h1>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="h-2" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {currentCardIndex + 1}/{cards.length}
          </span>
        </div>
      </div>

      {completed ? (
        <Card>
          <CardHeader>
            <CardTitle>Estudo Concluído!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-lg mb-4">Você completou todos os cards deste baralho.</p>
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">{stats.correct}</p>
                  <p className="text-sm text-muted-foreground">Acertos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-500">{stats.incorrect}</p>
                  <p className="text-sm text-muted-foreground">Erros</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/baralho/${id}`}>
              <Button variant="outline">Voltar</Button>
            </Link>
            <Button onClick={resetStudy}>Estudar Novamente</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pergunta:</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg py-4">{currentCard.question}</p>
          </CardContent>
          <CardFooter className="flex flex-col">
            {showAnswer ? (
              <>
                <div className="w-full mb-6">
                  <h3 className="font-medium mb-2">Resposta:</h3>
                  <p className="text-lg py-2 px-4 bg-muted rounded-md">{currentCard.answer}</p>
                </div>
                <div className="flex justify-center gap-4 w-full">
                  <Button
                    variant="outline"
                    className="border-red-500 hover:bg-red-50 hover:text-red-600 flex-1"
                    onClick={() => handleResponse(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Errei
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-500 hover:bg-green-50 hover:text-green-600 flex-1"
                    onClick={() => handleResponse(true)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Acertei
                  </Button>
                </div>
              </>
            ) : (
              <Button className="w-full" onClick={handleShowAnswer}>
                Ver Resposta
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
