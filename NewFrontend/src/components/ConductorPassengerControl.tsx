import { useState, useMemo } from "react"


export const ConductorPassengerControl = ({ initialCount }: { initialCount: number }) => {

    const [passengerCount, setPassengerCount] = useState(initialCount)
    const [confirm, setConfirm] = useState<{ button: "add" | "subtract", state: false } | null>(null)
    const [input, setInput] = useState(0)

    // const handleSubtract = useMemo(() => {
    //     const newCount = passengerCount - input
    //     if (newCount < 0) {
    //         alert("Passenger count cannot be negative!")
    //         return passengerCount
    //     }
    //     return newCount
    // }, [passengerCount, input])


    return (
        <div className="border-4 flex-grow border-black bg-white p-6">
            <h2 className="text-3xl font-bold uppercase border-b-4 border-black pb-2">
                Current Passengers Control
            </h2>
            <div className="mt-4">
                <div className="border-2 border-black p-4 bg-gray-100">
                    <p className="font-mono">
                        Count: {passengerCount}
                    </p>
                    <input value={input} onChange={(e) => setInput(Number(e.target.value))} type="number" className="border-2 px-4 py-2 h-12" />
                    <div className="w-full flex gap-4">
                        <button
                            onClick={() => {
                                if (window.confirm(`Are you sure you want to add ${input} passengers?`)) {
                                    setPassengerCount(passengerCount + input);
                                }
                            }}
                            className="mt-2 border-2 flex-grow border-black px-4 py-2 font-mono hover:bg-black hover:text-white transition-colors"
                        >
                            + Add {input}
                        </button>
                        <button
                            onClick={() => {
                                const newCount = passengerCount - input;
                                if (newCount < 0) {
                                    alert("Passenger count cannot be negative!");
                                } else if (window.confirm(`Are you sure you want to subtract ${input} passengers?`)) {
                                    setPassengerCount(newCount);
                                }
                            }}
                            className="mt-2 border-2 flex-grow border-black px-4 py-2 font-mono hover:bg-black hover:text-white transition-colors"
                        >
                            - Subtract {input}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}