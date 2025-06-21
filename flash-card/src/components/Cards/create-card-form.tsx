"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateCardFormProps {
  deckId: number;
  onCardCreated?: () => void;
}

export default function CreateCardForm({ deckId, onCardCreated }: CreateCardFormProps) {
  const [frente, setFrente] = useState("");
  const [tras, setTras] = useState("");
  const [imagem, setImagem] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload: any = {
        frente,
        tras,
        deck: deckId,
        tag,
      };
      if (imagem) payload.imagem = imagem;
      const res = await fetch("https://flashcards-erbw.onrender.com/criar_card/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao criar carta");
      setSuccess("Carta criada com sucesso!");
      setFrente("");
      setTras("");
      setImagem("");
      setTag("");
      if (onCardCreated) onCardCreated();
    } catch (err) {
      setError("Erro ao criar carta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Adicionar Nova Carta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <div>
            <Label htmlFor="frente">Pergunta (Frente)</Label>
            <Input id="frente" value={frente} onChange={e => setFrente(e.target.value)} required disabled={loading} />
          </div>
          <div>
            <Label htmlFor="tras">Resposta (Verso)</Label>
            <Input id="tras" value={tras} onChange={e => setTras(e.target.value)} required disabled={loading} />
          </div>
          <div>
            <Label htmlFor="imagem">URL da Imagem (opcional)</Label>
            <Input id="imagem" value={imagem} onChange={e => setImagem(e.target.value)} disabled={loading} />
          </div>
          <div>
            <Label htmlFor="tag">Tag/Categoria</Label>
            <Input id="tag" value={tag} onChange={e => setTag(e.target.value)} required disabled={loading} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adicionando..." : "Adicionar Carta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
