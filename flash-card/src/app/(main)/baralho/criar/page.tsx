"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { createBaralho } from "@/services/reqBaralho"

export default function CriarBaralho() {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("O título do baralho não pode estar vazio.")
      return
    }

    setLoading(true)

    try {
      const now = new Date().toISOString()

      await createBaralho({
        name: title,
        startedAt: now,
        finishedAt: now,
        cartas: []
      })

      router.push("/telaInicial")
    } catch (err: any) {
      console.error("Erro ao criar baralho:", err)
      alert("Erro ao criar baralho. Tente novamente.")
    } finally {
      setLoading(false)
    }
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
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Baralho"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
