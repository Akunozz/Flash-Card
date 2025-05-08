"use client"

import { useEffect, useState } from "react"
import { fetchCartas, deleteCarta, Carta } from "@/services/reqCartas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default function VisualizarCartas() {
    const [cartas, setCartas] = useState<Carta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const data = await fetchCartas()
        setCartas(data)
      } catch (err) {
        console.error("Erro ao carregar cartas:", err)
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  const removerCarta = async (id: string) => {
    try {
      await deleteCarta(id)
      setCartas((prev) => prev.filter((carta) => carta.id !== id))
    } catch (err) {
      console.error("Erro ao deletar carta:", err)
      alert("Erro ao deletar carta")
    }
  }

  if (loading) return <p className="text-center mt-6">Carregando cartas...</p>

  if (cartas.length === 0) {
    return <p className="text-center mt-6">Nenhuma carta encontrada.</p>
  }

  return (
    <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cartas.map((carta) => (
        <Card key={carta.id}>
          <CardHeader>
            <CardTitle>{carta.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={carta.avatar}
              alt={carta.name}
              className="w-16 h-16 rounded-full mb-2"
            />
            <p><strong>Imagem:</strong> {carta.imagem}</p>
            <p><strong>Resposta:</strong> {carta.resposta}</p>
          </CardContent>
          <div className="p-4">
            <Button variant="destructive" onClick={() => removerCarta(carta.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Excluir
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
