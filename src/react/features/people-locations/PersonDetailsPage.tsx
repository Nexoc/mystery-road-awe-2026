import { Link, useParams } from "react-router-dom";
import { debugLog } from "../../../shared/debug.js";
import type { Person } from "../../../types.js";
import { ContentPanel } from "./components/ContentPanel.js";

type PersonDetailsPageProps = Readonly<{
  people: readonly Person[];
}>;

export function PersonDetailsPage({ people }: PersonDetailsPageProps) {
  const { personId } = useParams<"personId">();

  debugLog("4.9", "ROUTE PARAM → personId read from URL", {
    personId,
  });

  if (personId === undefined) {
    debugLog("4.9", "PERSON DETAILS → route parameter is missing");

    return (
      <ContentPanel title="Person not found">
        <p>The URL does not contain a person ID.</p>
        <Link to="/team/people">Back to people</Link>
      </ContentPanel>
    );
  }

  const person = people.find((candidate) => candidate.id === personId);

  debugLog("4.9", "PERSON DETAILS → person lookup completed", {
    personId,
    personFound: person !== undefined,
  });

  if (person === undefined) {
    return (
      <ContentPanel title="Person not found">
        <p>
          No person exists with the ID <strong>{personId}</strong>.
        </p>
        <Link to="/team/people">Back to people</Link>
      </ContentPanel>
    );
  }

  const avatarUrl = `${import.meta.env.BASE_URL}${person.avatar}`;
  const hasResponsibilities = person.responsibilities.length > 0;

  return (
    <ContentPanel title={`Person details: ${person.name}`}>
      <div className="person-details-actions">
        <Link to="/team/people">&larr; Back to people</Link>
      </div>

      <article className="person-card person-details-card">
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

        <div className="person-details-background">
          <h4>Investigation background</h4>
          <p>{person.background}</p>
        </div>
      </article>
    </ContentPanel>
  );
}
