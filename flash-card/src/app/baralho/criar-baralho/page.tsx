"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function CriarBaralho() {
  const [title, setTitle] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert({
        title: "Erro",
        description: "O título do baralho não pode estar vazio.",
        variant: "destructive",
      })
      return
    }

    // Gerar ID único
    const id = Date.now().toString()

    // Buscar baralhos existentes
    const existingDecks = JSON.parse(localStorage.getItem("flashcards-decks") || "[]")

    // Adicionar novo baralho
    const newDeck = { id, title, cardCount: 0 }
    const updatedDecks = [...existingDecks, newDeck]

    // Salvar no localStorage
    localStorage.setItem("flashcards-decks", JSON.stringify(updatedDecks))

    alert({
      title: "Baralho criado",
      description: "Seu novo baralho foi criado com sucesso.",
    })

    // Redirecionar para a página principal
    router.push("/")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Baralho</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Nome do Baralho</Label>
                <Input
                  id="title"
                  placeholder="Ex: Matemática, Inglês, História..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit">Criar Baralho</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
