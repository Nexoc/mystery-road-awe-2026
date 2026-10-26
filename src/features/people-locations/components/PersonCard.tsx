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

  const hasResponsibilities = person.responsibilities.length > 0;
  debugLog("4.2", "CONDITIONAL → responsibilities evaluated", {
    personId: person.id,
    responsibilitiesCount: person.responsibilities.length,
    hasResponsibilities,
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

      {hasResponsibilities && (
        <div className="person-responsibilities">
          <strong>Responsibilities:</strong>

          <ul>
            {person.responsibilities.map((responsibility) => (
              <li key={responsibility}>{responsibility}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
    </article>
  );
}
