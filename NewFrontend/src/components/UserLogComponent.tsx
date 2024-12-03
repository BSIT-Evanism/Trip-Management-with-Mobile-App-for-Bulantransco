import { useEffect, useState } from "react";
import { fetchClient } from "@/lib/client";

type Log = {
    id: number;
    locationId: string;
    logMessage: string;
    logTime: string;
    tripId: string;
}

export const UserLogComponent = ({ tripId, token }: { tripId: string, token: string }) => {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<Log[]>([]);

    const fetchLogs = async () => {
        const { data } = await fetchClient.get<Log[]>(`/userlogs/${tripId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setLogs(data);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    fetchLogs()
                    return 0
                }
                return Math.min(oldProgress + 2, 100)
            })
        }, 100)

        return () => {
            clearInterval(intervalId);
        };
    }, [tripId]);

    return (
        <div className="border-4 border-black bg-white p-4 md:p-6 relative">
            <div className="absolute top-2 right-2 w-8 h-1 bg-gray-200 rounded-full">
                <div
                    className="bg-blue-600 h-1 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <h2 className="scroll-m-20 text-2xl font-bold tracking-tight border-b-4 border-black pb-2">
                Trip Logs
            </h2>
            <div className="mt-4 overflow-x-auto">
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full border-4 border-black">
                        <thead className="sticky top-0 bg-white">
                            <tr>
                                <th className="border-2 border-black px-4 py-3 text-left font-mono bg-gray-100">
                                    Log ID
                                </th>
                                <th className="border-2 border-black px-4 py-3 text-left font-mono bg-gray-100">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="border-2 border-black px-4 py-8 text-center font-mono text-gray-500">
                                        No logs found
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="border-2 border-black px-4 py-3 font-mono">{log.id}</td>
                                        <td className="border-2 border-black px-4 py-3 font-mono">{log.logMessage}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};
