import { actions } from "astro:actions";
import { AddPersonelComponent } from "./AddConductorComponent";

interface Personnel {
    id: string;
    name: string;
}

interface Location {
    id: string;
    name: string;
}

const PersonnelSelect = ({
    label,
    name,
    items
}: {
    label: string;
    name: string;
    items: Personnel[]
}) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={name} className="font-mono text-sm">
            {label}
            {items.length === 0 ? (
                <div className="border-2 border-black px-4 py-2 font-mono bg-gray-100 text-gray-500">
                    No {label.toLowerCase()} available
                </div>
            ) : (
                <select
                    name={name}
                    className="border-2 border-black px-4 py-2 font-mono w-full"
                >
                    {items.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            )}
        </label>
    </div>
);

export const AddTripsComponent = ({ locations, conductors, inspectors }: { locations: Location[], conductors: Personnel[], inspectors: Personnel[] }) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        console.log("submit", formData);

        try {
            const { data, error } = await actions.addTrips(formData);
            if (error) {
                console.error(error);
            }
            console.log("data", data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="border-4 border-black bg-white p-6">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Quick Actions
            </h2>

            <div className="my-4">
                <AddPersonelComponent />

                <form
                    onSubmit={handleSubmit}
                    method="post"
                    className="border-2 mt-2 border-black w-full p-4 flex flex-col gap-4"
                >
                    <PersonnelSelect label="Location" name="locationId" items={locations} />
                    <PersonnelSelect label="Conductor" name="conductorId" items={conductors} />
                    <PersonnelSelect label="Inspector" name="inspectorId" items={inspectors} />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="date" className="font-mono text-sm">
                            Date
                            <input
                                type="date"
                                name="date"
                                className="border-2 border-black px-4 py-2 font-mono w-full"
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="totalPassengers" className="font-mono text-sm">
                            Total Passengers
                            <input
                                type="number"
                                name="totalPassengers"
                                className="border-2 border-black px-4 py-2 font-mono w-full"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!locations.length || !conductors.length || !inspectors.length}
                        className="border-2 border-black px-4 py-2 font-mono hover:bg-black hover:text-white 
                     transition-colors mt-2 disabled:opacity-50 disabled:hover:bg-white 
                     disabled:hover:text-black"
                    >
                        ADD TRIPS
                    </button>
                </form>
            </div>
        </div>
    );
};