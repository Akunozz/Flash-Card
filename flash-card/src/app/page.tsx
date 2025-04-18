import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import DeckList from "@/components/Cards/deck-list"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sistema de Flash Cards</h1>
        <p className="text-muted-foreground">Crie e estude seus flash cards para memorizar melhor</p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Seus Baralhos</h2>
        <Link href="/criar-baralho">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Baralho
          </Button>
        </Link>
      </div>

      <DeckList />
    </div>
  )
}
