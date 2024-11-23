import { useState } from "react";



export const LoginComponent = () => {

    const [role, setRole] = useState<"conductor" | "admin">("conductor");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin() {
        try {
            console.log("username", username);
            console.log("password", password);
            const res = await fetch(`http://localhost:5001/auth/login`, {
                method: "POST",
                body: JSON.stringify({ username, password }),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log("res", res);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            }
            else {
                setError("");
                location.href = "/login/verify?token=" + data.token;
            }

        } catch (e) {
            console.log("error");
        }
    }

    return (
        <div className="w-[40vh] h-[50vh] border shadow-xl bg-zinc-100">
            <div className="flex min-w-full">
                <button className={`w-full h-20 ${role === "conductor" ? " bg-zinc-100" : "bg-zinc-200"}`} onClick={() => setRole("conductor")}>Conductor</button>
                <button className={`w-full h-20 ${role === "admin" ? "bg-zinc-100" : "bg-zinc-200"}`} onClick={() => setRole("admin")}>Admin</button>
            </div>
            <div className="flex flex-col h-[calc(100%-10rem)] justify-evenly items-stretch gap-4 p-4">
                <h1 className="text-2xl font-bold text-center">Login for {role}</h1>
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="p-2 rounded-md" type="text" placeholder="Username" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 rounded-md" type="password" placeholder="Password" />
                <button onClick={() => handleLogin()} className="bg-blue-500 text-white p-2 rounded-md">Login</button>
                {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
};
