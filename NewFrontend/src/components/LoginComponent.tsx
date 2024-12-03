import { fetchClient } from "@/lib/client";
import { useState } from "react";

export const LoginComponent = () => {
    const [role, setRole] = useState<"conductor" | "manager" | "inspector">("conductor");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin() {
        try {
            const { data } = await fetchClient.post<{ error: string; token: string }>("/auth/login", {
                username,
                password,
                role
            });

            if (data.error) {
                setError(data.error);
            }
            else {
                setError("");
                location.href = "/login/verify?token=" + data.token;
            }

        } catch (e) {
            ("error");
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 rounded-lg bg-zinc-800/50 p-8 shadow-xl backdrop-blur">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Login
            </h1>

            <div className="space-y-4">
                <div className="rounded-md bg-zinc-900/50 p-4">
                    <p className="text-sm font-medium text-zinc-400">Role Selection</p>
                    <div className="mt-2 flex gap-2">
                        <button
                            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${role === "conductor"
                                ? "bg-zinc-800 text-zinc-100"
                                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                                }`}
                            onClick={() => setRole("conductor")}
                        >
                            Conductor
                        </button>
                        <button
                            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${role === "manager"
                                ? "bg-zinc-800 text-zinc-100"
                                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                                }`}
                            onClick={() => setRole("manager")}
                        >
                            Manager
                        </button>
                        <button
                            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${role === "inspector"
                                ? "bg-zinc-800 text-zinc-100"
                                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                                }`}
                            onClick={() => setRole("inspector")}
                        >
                            Inspector
                        </button>
                    </div>
                </div>

                <div className="rounded-md bg-zinc-900/50 p-4">
                    <p className="text-sm font-medium text-zinc-400">Credentials</p>
                    <div className="mt-2 space-y-2">
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600/50"
                            type="text"
                            placeholder="Username"
                        />
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600/50"
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <button
                    onClick={() => handleLogin()}
                    className="w-full rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
                >
                    Login
                </button>

                {error && (
                    <div className="rounded-md bg-red-500/10 p-4">
                        <p className="text-sm font-medium text-red-400">
                            {error}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
