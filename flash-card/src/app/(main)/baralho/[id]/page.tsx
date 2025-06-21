"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateCardForm from "@/components/Cards/create-card-form";
import { Button } from "@/components/ui/button";

interface CardDoDeck {
  id: number;
  frente: string;
  tras: string;
  imagem: string | null;
  deck: number;
  tag: number;
}

interface DeckData {
  deck: {
    id: number;
    nome: string;
    numero_de_cards: number;
    ordem_dos_cards: { ordem: number[] };
    criador: number;
  };
  cardsDoDeck: CardDoDeck[];
}

export default function DeckPage() {
  const params = useParams();
  const id = params?.id;
  const [deckData, setDeckData] = useState<DeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateCard, setShowCreateCard] = useState(false);

  // Função para recarregar o baralho
  const fetchDeck = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://flashcards-erbw.onrender.com/get_deck/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar baralho");
      const data = await res.json();
      setDeckData(data);
    } catch (err) {
      setError("Não foi possível carregar o baralho.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDeck();
  }, [id]);

  if (loading) return <div className="text-center py-10">Carregando...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!deckData) return null;

  const { deck, cardsDoDeck } = deckData;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{deck.nome}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><b>ID:</b> {deck.id}</p>
          <p><b>Número de cards:</b> {deck.numero_de_cards}</p>
          <p><b>Criador:</b> {deck.criador}</p>
        </CardContent>
      </Card>
      <div className="flex justify-end mb-4">
        <Button
          className="flex items-center w-full justify-center"
          onClick={() => setShowCreateCard((v) => !v)}
        >
          + Adicionar mais Cartas
        </Button>
      </div>
      {showCreateCard && (
        <CreateCardForm deckId={deck.id} onCardCreated={() => {
          setShowCreateCard(false);
          fetchDeck();
        }} />
      )}
      <h2 className="text-xl font-semibold mb-4">Cards do Baralho</h2>
      <div className="flex flex-col gap-4">
        {cardsDoDeck.length === 0 && <div>Nenhum card neste baralho.</div>}
        {cardsDoDeck.map(card => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle>Card #{card.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2"><b>Pergunta:</b> {card.frente}</div>
              <div className="mb-2"><b>Resposta:</b> {card.tras}</div>
              {card.imagem && (
                <img src={card.imagem} alt="Imagem do card" className="max-w-xs rounded" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
