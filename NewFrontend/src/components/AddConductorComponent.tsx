import { actions } from "astro:actions"
import { useState } from "react"
import { createPortal } from "react-dom"

export const AddPersonelComponent = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [activeTab, setActiveTab] = useState<'conductor' | 'inspector'>('conductor')

    async function handleClick() {
        const { data, error } = await actions.addPersonel({
            email: email,
            password: password,
            role: activeTab
        })

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
                        <div className="flex gap-4 border-b border-black mb-4">
                            <button
                                onClick={() => setActiveTab('conductor')}
                                className={`pb-2 text-2xl font-semibold tracking-tight transition-colors ${activeTab === 'conductor' ? 'border-b-4 border-black' : 'text-gray-500 hover:text-black'}`}
                            >
                                Conductor
                            </button>
                            <button
                                onClick={() => setActiveTab('inspector')}
                                className={`pb-2 text-2xl font-semibold tracking-tight transition-colors ${activeTab === 'inspector' ? 'border-b-4 border-black' : 'text-gray-500 hover:text-black'}`}
                            >
                                Inspector
                            </button>
                        </div>
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
                                    placeholder="email@example.com"
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
                                Add {activeTab === 'conductor' ? 'Conductor' : 'Inspector'}
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
                ADD PERSONNEL
            </button>
        </div>
    )
}