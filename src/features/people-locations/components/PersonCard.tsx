import { debugLog } from "../../../shared/debug.js";
import type { Person } from "../../../types.js";

type PersonCardProps = Readonly<{
  person: Person;
}>;

export function PersonCard({ person }: PersonCardProps) {
  const avatarUrl = `${import.meta.env.BASE_URL}${person.avatar}`;

  debugLog("4.1", "PERSON CARD → component rendered", {
    personId: person.id,
    personName: person.name,
  });

  return (
    <article className="person-card">
      <div className="person-card-header">
        <img
          className="person-avatar"
          src={avatarUrl}
          alt={`Portrait of ${person.name}`}
        />

        <div>
          <h3>{person.name}</h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>

      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>

      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
    </article>
  );
}
