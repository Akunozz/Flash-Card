"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CriarCard from "@/components/Cards/criar-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookCopy, CirclePlus, LoaderCircleIcon, Trash2 } from "lucide-react";

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

  const handleDeleteCard = async (cardId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar esta carta?")) return;
    try {
      const res = await fetch(`https://flashcards-erbw.onrender.com/deletar_card/${cardId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar carta");
      fetchDeck();
    } catch (err) {
      alert("Erro ao deletar carta. Tente novamente.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <LoaderCircleIcon className="animate-spin w-10 h-10 text-green-500 mb-2" />
        <span className="text-lg font-medium mt-2">Carregando...</span>
      </div>
    );
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!deckData) return null;

  const { deck, cardsDoDeck } = deckData;

  return (
    <div className="py-8">
      <ArrowLeft className="cursor-pointer mb-4 bg-green-500 rounded-full" onClick={() => window.history.back()} />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex text-2xl font-bold gap-2 items-center">
            <BookCopy /> {deck.nome}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <b>Número de cards:</b> {deck.numero_de_cards}
          </p>
        </CardContent>
      </Card>
      <div className="flex justify-end mb-4">
        <Button
          className="flex items-center w-full justify-center bg-green-500 hover:bg-green-600 text-white dark:text-black"
          onClick={() => setShowCreateCard((v) => !v)}
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          Adicionar mais Cartas
        </Button>
      </div>
      {showCreateCard && (
        <CriarCard
          deckId={deck.id}
          onCardCreated={() => {
            setShowCreateCard(false);
            fetchDeck();
          }}
        />
      )}
      <h2 className="text-xl font-semibold mb-4">Cards do Baralho</h2>
      <div className="flex flex-col gap-4">
        {cardsDoDeck.length === 0 && <div>Nenhum card neste baralho.</div>}
        {cardsDoDeck.map((card) => (
          <Card key={card.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">{card.frente}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                title="Deletar carta"
                onClick={() => handleDeleteCard(card.id)}
              >
                <Trash2 />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <b>Resposta:</b> {card.tras}
              </div>
              <div className="mb-2">
                <b>Tag:</b> {card.tag}
              </div>
              {card.imagem && (
                <img
                  src={card.imagem}
                  alt="Imagem do card"
                  className="max-w-xs rounded"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
