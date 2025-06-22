"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CirclePlus, CircleX, X } from "lucide-react"
import { toast } from "sonner"

export default function CriarBaralho() {
  const [nome, setNome] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      toast.error("O nome do baralho não pode estar vazio.")
      return
    }

    setLoading(true)

    try {
      const payload = {
        nome,
        criadorId: typeof window !== "undefined" ? Number(localStorage.getItem("userId")) : undefined,
      }

      const res = await fetch(
        "https://flashcards-erbw.onrender.com/criar_deck/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Erro ao criar o baralho");

      router.push("/telaInicial")
    } catch (err) {
      toast.error(`Erro ao criar baralho: ${err instanceof Error ? err.message : String(err)}`)
      toast.error("Erro ao criar o baralho. Tente novamente.")
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
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="nome">Nome do Baralho</Label>
              <Input
                id="nome"
                placeholder="Ex: Matemática, Inglês, História..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <CircleX />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-500 text-white hover:bg-green-600 dark:text-black">
              <CirclePlus />
              {loading ? "Criando..." : "Criar Baralho"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
