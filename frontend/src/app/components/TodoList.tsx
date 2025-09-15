"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useEffect, useRef, useState } from "react";

type Todo = {
    _id: string;
    description: string;
    completed: boolean;
    createdAt: string;
};

export default function TodoList({ onLogout }: { onLogout: () => void }) {
    const queryClient = useQueryClient();
    const loader = useRef(null);
    const [newTodo, setNewTodo] = useState("");

    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["todos"],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await api.get(`/notes?page=${pageParam}&limit=5`);
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.page < lastPage.pagination.totalPages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        const currentLoader = loader.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );
        if (currentLoader) observer.observe(currentLoader);
        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [hasNextPage, fetchNextPage]);


    const createTodo = useMutation({
        mutationFn: (description: string) => api.post("/notes", { description }),
        onSuccess: () => {
            setNewTodo("");
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
        onError: () => alert("Failed to create todo"),
    });

    const toggleDone = useMutation({
        mutationFn: (todo: Todo) =>
            api.put(`/notes/${todo._id}`, { completed: !todo.completed }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });

    const deleteTodo = useMutation({
        mutationFn: (id: string) => api.delete(`/notes/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });

    return (
        <div className="p-6 max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Todos</h1>
                <button
                    onClick={() => { localStorage.removeItem("token"); onLogout(); }}
                    className="text-red-600 font-semibold cursor-pointer"
                >
                    Logout
                </button>
            </div>

            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="New task"
                    className="flex-1 border border-black p-2 rounded mr-2"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button
                    onClick={() => createTodo.mutate(newTodo)}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
                >
                    Add
                </button>
            </div>

            {data?.pages.flatMap((page) =>
                page.data.map((todo: Todo) => (
                    <div key={todo._id} className="flex justify-between items-center border-b py-2">
                        <div>
                            <p className={`${todo.completed ? "line-through text-gray-500" : ""}`}>
                                {todo.description}
                            </p>
                            <span className="text-xs text-gray-400">
                                {new Date(todo.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => toggleDone.mutate(todo)}
                                className="px-2 py-1 text-sm bg-green-500 text-white rounded cursor-pointer"
                            >
                                {todo.completed ? "Undo" : "Done"}
                            </button>
                            <button
                                onClick={() => deleteTodo.mutate(todo._id)}
                                className="px-2 py-1 text-sm bg-red-500 text-white rounded cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}

            <div ref={loader} className="h-10" />
        </div>
    );
}
