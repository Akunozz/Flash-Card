"use client";

import { useState } from "react";
import { Baralho, deleteBaralho } from "@/services/reqBaralho";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
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
} from "@/components/ui/alert-dialog";

interface DeckListProps {
  data: Baralho[];
}

export default function DeckList({ data }: DeckListProps) {
  const [baralhos, setBaralhos] = useState<Baralho[]>(data);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBaralho(id);
      setBaralhos((prev) => prev.filter((deck) => deck.id !== id));
    } catch (error) {
      console.error("Erro ao deletar baralho:", error);
      alert("Não foi possível deletar o baralho. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!baralhos || baralhos.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Nenhum baralho encontrado</h3>
        <p className="text-muted-foreground mb-6">
          Crie seu primeiro baralho para começar a estudar
        </p>
        <Link href="/baralho/criar-baralho">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar Baralho
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {baralhos.map((deck) => (
        <Card key={deck.id}>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>{deck.name}</CardTitle>
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
                      Tem certeza que deseja excluir este baralho? Esta ação não
                      pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(deck.id)}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{deck.cartas.length} cards</p>
            <p className="text-xs text-muted-foreground mt-1">
              Início: {new Date(deck.startedAt).toLocaleString()}
              <br />
              Fim: {new Date(deck.finishedAt).toLocaleString()}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
