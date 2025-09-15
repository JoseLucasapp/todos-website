"use client";
import './globals.css'
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthModal from "./components/AuthModal";
import TodoList from "./components/TodoList";

const queryClient = new QueryClient();

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(
    typeof window !== "undefined" && !!localStorage.getItem("token")
  );

  return (
    <QueryClientProvider client={queryClient}>
      {!loggedIn && <AuthModal onLogin={() => setLoggedIn(true)} />}
      {loggedIn && <TodoList onLogout={() => setLoggedIn(false)} />}
    </QueryClientProvider>
  );
}
