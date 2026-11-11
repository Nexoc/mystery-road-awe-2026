import type { Person } from "../../../../types.js";
import { ContentPanel } from "./ContentPanel.js";
import { PersonCard } from "./PersonCard.js";

type PeopleSectionProps = Readonly<{
  people: readonly Person[];
}>;

export function PeopleSection({ people }: PeopleSectionProps) {
  const hasPeople = people.length > 0;

  return (
    <ContentPanel title={`People (${people.length})`}>
      {hasPeople ? (
        <div className="people-grid">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <p>No people available.</p>
      )}
    </ContentPanel>
  );
}
