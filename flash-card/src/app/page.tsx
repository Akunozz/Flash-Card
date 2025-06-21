import { CadastroForm } from "@/components/Login/cadastro-form"
import { LoginForm } from "@/components/Login/login-form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full bg-zinc-200 dark:bg-zinc-950 rounded-lg">
            <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
            <TabsTrigger value="cadastro" className="flex-1">Cadastro</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="cadastro">
            <CadastroForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
