"use client"

import * as React from "react"
import {
  File,
  Frame,
  House,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/Sidebar/nav-main"
import { NavMainSimple } from "@/components/Sidebar/nav-simple"
import { NavUser } from "@/components/Sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Breno",
    email: "breno@email.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navSimple: [
    {
      title: "Home",
      url: "/telaInicial",
      icon: House,
      isActive: false,
    },
  ],

  navMain: [
    {
      title: "Baralhos",
      url: "/",
      icon: File,
      isActive: false,
      items: [
        {
          title: "Criar Baralho",
          url: "/baralho/criar",
        },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Geral",
          url: "#",
        },
        {
          title: "Cards",
          url: "#",
        },
        {
          title: "Perfil",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center">
        Flash Card
      </SidebarHeader>
      <SidebarContent>
        <NavMainSimple items={data.navSimple} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
