import { useState } from "react";

type Conductor = {
    id: string;
    name: string;
    relatedTrips: { isCompleted: boolean }[];
};

type Inspector = {
    id: string;
    name: string;
    relatedTrips: { isCompleted: boolean }[];
};

export const ConductorsInspectorsComp = ({ conductors, inspectors }: { conductors: Conductor[], inspectors: Inspector[] }) => {
    const [activeTab, setActiveTab] = useState<'conductors' | 'inspectors'>('conductors');

    const TableHeader = () => (
        <tr>
            <th className="border-2 border-black px-4 py-2 text-left font-mono bg-gray-100">ID</th>
            <th className="border-2 border-black px-4 py-2 text-left font-mono bg-gray-100">NAME</th>
            <th className="border-2 border-black px-4 py-2 text-left font-mono bg-gray-100">STATUS</th>
            <th className="border-2 border-black px-4 py-2 text-left font-mono bg-gray-100">OPTIONS</th>
        </tr>
    );

    const TableRow = ({ id, name, relatedTrips }: { id: string, name: string, relatedTrips: { isCompleted: boolean }[] }) => (
        <tr>
            <td className="border-2 border-black px-4 py-2 font-mono">{id}</td>
            <td className="border-2 border-black px-4 py-2 font-mono">{name}</td>
            <td className="border-2 border-black px-4 py-2 font-mono">
                {relatedTrips.filter(trip => !trip.isCompleted).length ? "ACTIVE" : "INACTIVE"}
            </td>
            <td className="border-2 border-black px-4 py-2 font-mono">
                <button className="hover:underline">VIEW</button>
            </td>
        </tr>
    );

    const DataTable = ({ data }: { data: Array<Conductor | Inspector> }) => (
        <div className="max-h-[250px] overflow-y-auto">
            <table className="w-full border-4 border-black">
                <thead>
                    <TableHeader />
                </thead>
                <tbody>
                    {data.map(item => (
                        <TableRow key={item.id} {...item} />
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="border-4 border-black bg-white p-6">
            <div className="flex gap-4 border-b border-black">
                <button
                    onClick={() => setActiveTab('conductors')}
                    className={`pb-2 text-2xl font-semibold tracking-tight transition-colors ${activeTab === 'conductors'
                        ? 'border-b-4 border-black'
                        : 'text-gray-500 hover:text-black'
                        }`}
                >
                    Conductors
                </button>
                <button
                    onClick={() => setActiveTab('inspectors')}
                    className={`pb-2 text-2xl font-semibold tracking-tight transition-colors ${activeTab === 'inspectors'
                        ? 'border-b-4 border-black'
                        : 'text-gray-500 hover:text-black'
                        }`}
                >
                    Inspectors
                </button>
            </div>
            <div className="mt-4">
                {activeTab === 'conductors' ? (
                    <DataTable data={conductors} />
                ) : (
                    <DataTable data={inspectors} />
                )}
            </div>
        </div>
    );
};
