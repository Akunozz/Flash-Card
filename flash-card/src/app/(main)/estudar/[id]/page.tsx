"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LoaderCircleIcon,
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowRight,
  Trophy,
} from "lucide-react";

interface CardEstudo {
  id: number;
  frente: string;
  tras: string;
  imagem: string | null;
  deck: number;
  tag: number;
}

export default function EstudarPage() {
  const params = useParams();
  const id = params?.id;
  const [cards, setCards] = useState<CardEstudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [wrongCardIds, setWrongCardIds] = useState<number[]>([]);
  const [correctCardIds, setCorrectCardIds] = useState<number[]>([]);

  useEffect(() => {
    async function fetchCards() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://flashcards-erbw.onrender.com/comecar_estudo/${id}`
        );
        if (!res.ok) throw new Error("Erro ao buscar cards para estudo");
        const data = await res.json();
        // Ajuste: se data for array, use diretamente, senão tente acessar data.cardsDoDeck
        if (Array.isArray(data)) {
          setCards(data);
        } else if (Array.isArray(data.cardsDoDeck)) {
          setCards(data.cardsDoDeck);
        } else {
          setCards([]);
        }
      } catch (err) {
        setError("Não foi possível carregar as cartas para estudo.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCards();
  }, [id]);

  const handleCorrect = () => {
    setCorrectAnswers((prev) => prev + 1);
    setCorrectCardIds((prev) => [...prev, card.id]);
    setCanProceed(true);
  };

  const handleWrong = () => {
    setWrongAnswers((prev) => prev + 1);
    setWrongCardIds((prev) => [...prev, card.id]);
    setCanProceed(true);
  };

  const handleNext = async () => {
    if (current + 1 >= cards.length) {
      // Finalizar estudo - enviar novaOrdem para API
      await finishStudy();
      setGameFinished(true);
    } else {
      setCurrent((prev) => prev + 1);
      setShowBack(false);
      setCanProceed(false);
    }
  };

  const finishStudy = async () => {
    try {
      // Cartas erradas primeiro, depois cartas corretas
      const novaOrdem = [...wrongCardIds, ...correctCardIds];
      
      const res = await fetch("https://flashcards-erbw.onrender.com/terminar_estudo/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckId: parseInt(id as string),
          novaOrdem: novaOrdem,
        }),
      });
      
      if (!res.ok) {
        console.error("Erro ao finalizar estudo");
      }
    } catch (error) {
      console.error("Erro ao finalizar estudo:", error);
    }
  };

  const resetGame = () => {
    setCurrent(0);
    setShowBack(false);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setCanProceed(false);
    setGameFinished(false);
    setWrongCardIds([]);
    setCorrectCardIds([]);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <LoaderCircleIcon className="animate-spin w-10 h-10 text-green-500 mb-2" />
        <span className="text-lg font-medium mt-2">Carregando...</span>
      </div>
    );

  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!cards.length)
    return <div className="text-center py-10">Nenhuma carta para estudar.</div>;

  if (gameFinished) {
    const totalCards = cards.length;
    const percentage = Math.round((correctAnswers / totalCards) * 100);

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Parabéns!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-lg">
              <p className="mb-2">Você completou o baralho!</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                  <span className="font-semibold">Acertos</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {correctAnswers}
                </div>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <XCircle className="w-5 h-5 text-red-600 mr-1" />
                  <span className="font-semibold">Erros</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {wrongAnswers}
                </div>
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <div className="text-sm font-semibold mb-1">Taxa de Acerto</div>
              <div className="text-3xl font-bold text-blue-600">
                {percentage}%
              </div>
            </div>
          </CardContent>
        </Card>
        <Button
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Jogar Novamente
        </Button>
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="text-sm">
          <ArrowRight className="w-4 h-4 mr-2" />
          Voltar para a tela inicial
          </Button>
      </div>
    );
  }

  const card = cards[current];
  const progress = ((current + 1) / cards.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      {/* Linha de Progresso */}
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Progresso</span>
          <span>
            {current + 1} de {cards.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Carta */}
      <div
        className="relative w-full max-w-md h-80"
        style={{ perspective: "1000px" }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            showBack ? "rotate-y-180" : ""
          }`}
        >
          {/* Frente da carta */}
          <Card
            className={`absolute inset-0 w-full h-full backface-hidden ${
              showBack ? "rotate-y-180" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="text-center text-lg">Pergunta</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="text-center text-lg font-medium p-4">
                {card.frente}
              </div>
              {card.imagem && (
                <img
                  src={card.imagem || "/placeholder.svg"}
                  alt="Imagem do card"
                  className="max-w-full max-h-32 object-contain rounded mt-4"
                />
              )}
            </CardContent>
          </Card>

          {/* Verso da carta */}
          <Card
            className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800`}
          >
            <CardHeader>
              <CardTitle className="text-center text-lg text-green-700 dark:text-green-300">
                Resposta
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="text-center text-lg font-medium p-4 text-green-800 dark:text-green-200">
                {card.tras}
              </div>
              {card.imagem && (
                <img
                  src={card.imagem || "/placeholder.svg"}
                  alt="Imagem do card"
                  className="max-w-full max-h-32 object-contain rounded mt-4"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botões */}
      <div className="flex flex-col items-center space-y-4">
        {!showBack ? (
          <Button
            onClick={() => setShowBack(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
          >
            Mostrar Resposta
          </Button>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {/* Botões de Acerto/Erro */}
            {!canProceed && (
              <div className="flex space-x-4">
                <Button
                  onClick={handleCorrect}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Acertei
                </Button>
                <Button
                  onClick={handleWrong}
                  variant="destructive"
                  className="px-6 py-2"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Errei
                </Button>
              </div>
            )}

            {/* Botão Próxima Carta */}
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              {current + 1 >= cards.length ? "Finalizar" : "Próxima Carta"}
            </Button>

            {/* Botão para voltar à pergunta */}
            <Button
              variant="outline"
              onClick={() => setShowBack(false)}
              className="text-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Ver Pergunta Novamente
            </Button>
          </div>
        )}
      </div>

      {/* Estatísticas atuais */}
      <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
          <span>Acertos: {correctAnswers}</span>
        </div>
        <div className="flex items-center">
          <XCircle className="w-4 h-4 text-red-500 mr-1" />
          <span>Erros: {wrongAnswers}</span>
        </div>
      </div>
    </div>
  );
}
