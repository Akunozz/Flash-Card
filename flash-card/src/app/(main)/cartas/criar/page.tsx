"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCarta } from "@/services/reqCartas"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function CriarCarta() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    imagem: "",
    resposta: "",
    avatar: ""
  })
  const [adicionarImagem, setAdicionarImagem] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.resposta) {
      alert("Preencha os campos obrigatórios.")
      return
    }

    try {
      setLoading(true)
      await createCarta(form)
      router.push("/cartas")
    } catch (err) {
      console.error(err)
      alert("Erro ao criar a carta.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Carta</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="toggle-image"
                checked={adicionarImagem}
                onCheckedChange={(checked) => setAdicionarImagem(!!checked)}
              />
              <Label htmlFor="toggle-image">Deseja adicionar uma imagem?</Label>
            </div>

            {adicionarImagem && (
              <div>
                <Label htmlFor="imagem">Imagem</Label>
                <Input
                  type="file"
                  id="imagem"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setForm((prev) => ({
                        ...prev,
                        avatar: URL.createObjectURL(file),
                      }))
                    }
                  }}
                />
              </div>
            )}

            <div>
              <Label htmlFor="resposta">Resposta</Label>
              <Input name="resposta" value={form.resposta} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Carta"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
