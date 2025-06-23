"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"
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
import { toast } from "sonner"
import { BookOpen } from "lucide-react"

// Tipo de acordo com o JSON de /todos_decks
export interface DeckAPI {
  id: number
  nome: string
  numero_de_cards: number
  ordem_dos_cards: { ordem: number[] }
  criador: number
}

interface DeckListProps {
  data: DeckAPI[]
  showStudyButton?: boolean
}

export default function DeckList({ data, showStudyButton }: DeckListProps) {
  const [decks, setDecks] = useState<DeckAPI[]>(data)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      const res = await fetch(
        `https://flashcards-erbw.onrender.com/deletar_deck/${id}`,
        {
          method: "DELETE",
        }
      )
      if (!res.ok) throw new Error("Erro ao deletar baralho")
      setDecks((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      console.error("Erro ao deletar baralho:", err)
      toast.error("Não foi possível deletar o baralho. Tente novamente.")
    } finally {
      setDeletingId(null)
    }
  }

  if (decks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Nenhum baralho encontrado</h3>
        <p className="text-muted-foreground mb-6">
          Crie seu primeiro baralho para começar a estudar
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <Card key={deck.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{deck.nome}</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === deck.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir baralho</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza? Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(deck.id)} className="bg-red-500 hover:bg-red-600 text-white dark:text-black">
                      {deletingId === deck.id ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>

          <CardContent>
            <p>
              {deck.numero_de_cards} card
              {deck.numero_de_cards !== 1 ? "s" : ""}
            </p>
          </CardContent>

          <CardFooter className="flex gap-2 justify-between">
            <Link href={`/baralho/${deck.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2"/>
                Visualizar
              </Button>
            </Link>
            {showStudyButton && (
              <Link href={`/estudar/${deck.id}`}>
                <Button variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white dark:text-black">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Estudar
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
