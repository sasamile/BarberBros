"use client";
import { menuItems } from "@/constant";
import {
  BadgeCheck,
  Bell,
  ChevronDown,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Menu,
  Scissors,
  Sparkles,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { getUserById } from "@/actions/user";

function DashLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession();
  const [hasReloaded, setHasReloaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!session?.user?.id) {
          setError("No estás autenticado. Por favor, inicia sesión.");
          return;
        }
        const userData = await getUserById(session.user.id);
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
        setError("Error al cargar los datos del usuario.");
      }
    };
    loadUser();
  }, [session]);


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-blue text-white">
      <div>
        <aside
          className={`fixed top-0 left-0 h-full bg-dark-blue/50 backdrop-blur-xl border-r border-white/10 
                        transition-all duration-300 z-20
                        ${sidebarOpen ? "w-64" : "w-20"}`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3">
              <Scissors className="w-8 h-8 text-accent" />
              {sidebarOpen && (
                <span className="text-xl font-bold">BARBERCROS</span>
              )}
            </div>
          </div>

          <nav className="mt-6">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-4 text-sm
                         transition-all duration-300
                         ${
                           pathname === item.href
                             ? "text-accent bg-accent/10 border-r-2 border-accent"
                             : "text-gray-400 hover:text-white hover:bg-white/5"
                         }`}
              >
                <item.icon />
                {sidebarOpen && <span>{item.label}</span>}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <header className="sticky top-0 z-10 bg-dark-blue/50 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                </button>

                <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className=" flex items-center gap-4  rounded-lg">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            className="object-cover"
                            src={editedUser?.image!}
                            alt={editedUser?.name!}
                          />
                          <AvatarFallback className="rounded-lg uppercase">
                            {editedUser?.name && editedUser?.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] text-white min-w-56 rounded-lg bg-dark-blue/50 backdrop-blur-xl border border-white/10"
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                              className="object-cover"
                              src={editedUser?.image!}
                              alt={editedUser?.name!}
                            />
                            <AvatarFallback className="rounded-lg uppercase">
                              {editedUser?.name && editedUser?.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {user?.name}
                            </span>
                            <span className="truncate text-xs">
                              {user?.email}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Sparkles />
                          Upgrade to Pro
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <BadgeCheck />
                          Account
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <Button onClick={() => signOut()} className="w-full ">
                        <LogOut />
                        Log out
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashLayout;
