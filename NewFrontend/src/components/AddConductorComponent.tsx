import { actions } from "astro:actions"
import { useState } from "react"
import { createPortal } from "react-dom"

export const AddConductorComponent = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showModal, setShowModal] = useState(false)

    async function handleClick() {
        console.log(email, password);
        const { data, error } = await actions.addConductor({
            email: email,
            password: password
        })

        if (error) {
            console.log("error", error);
        }

        if (data) {
            setShowModal(false)
            setEmail("")
            setPassword("")
            location.reload()
        }
    }

    return (
        <div>
            {showModal && createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 border-4 border-black relative">
                        <button
                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors"
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
                            Add New Conductor
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-2 border-black p-2 w-full font-mono"
                                    placeholder="conductor@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-2 border-black p-2 w-full font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                onClick={handleClick}
                                className="w-full border-2 border-black px-4 py-2 font-mono hover:bg-black hover:text-white transition-colors"
                            >
                                Add Conductor
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            <button
                className="border-2 border-black px-4 py-2 w-full font-mono hover:bg-black hover:text-white transition-colors"
                onClick={() => setShowModal(!showModal)}
            >
                ADD CONDUCTOR
            </button>
        </div>
    )
}