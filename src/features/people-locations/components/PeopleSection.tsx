import { debugLog } from "../../../shared/debug.js";
import type { Person } from "../../../types.js";
import { ContentPanel } from "./ContentPanel.js";
import { PersonCard } from "./PersonCard.js";

type PeopleSectionProps = Readonly<{
    people: readonly Person[];
}>;

export function PeopleSection({
    people,
}: PeopleSectionProps) {
    const hasPeople = people.length > 0;

    debugLog(
        ["4.2", "4.5"],
        "PEOPLE SECTION → presentational component rendered",
        {
            peopleCount: people.length,
            hasPeople,
        },
    );

    return (
        <ContentPanel title={`People (${people.length})`}>
            {hasPeople ? (
            <div className="people-grid">
                {people.map((person) => (
                <PersonCard
                    key={person.id}
                    person={person}
                />
                ))}
            </div>
            ) : (
            <p>No people available.</p>
            )}
        </ContentPanel>
    );
}