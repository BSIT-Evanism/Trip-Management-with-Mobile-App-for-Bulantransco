import { actions } from "astro:actions"
import { useState } from "react"
import { createPortal } from "react-dom"


export const AddLocationsComponent = () => {
    const [showModal, setShowModal] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        try {
            const res = await actions.addLocation(formData)
            setShowModal(false)
            console.log(res)
            if (res.data?.success) {
                alert("Location added successfully")
                location.reload()
            } else {
                alert("Failed to add location")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <button
                className="mt-2 border-2 border-black px-4 py-2 font-mono hover:bg-black hover:text-white transition-colors"
                onClick={() => setShowModal(true)}
            >
                ADD NEW ROUTE
            </button>
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
                            Add New Location
                        </h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Location Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="border-2 border-black p-2 w-full font-mono"
                                    placeholder="Enter location name"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full border-2 border-black px-4 py-2 font-mono hover:bg-black hover:text-white transition-colors"
                            >
                                Add Location
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}