import type { Evidence, Person } from "../../../../types.js";

type HypothesisFormProps = Readonly<{
  people: readonly Person[];
  evidence: readonly Evidence[];
}>;

export function HypothesisForm({ people, evidence }: HypothesisFormProps) {
  return (
    <div className="hypothesis-card">
      <h3>Hypothesis Draft</h3>

      <form>
        <div className="form-row">
          <label htmlFor="hypSuspect">Suspected responsible person</label>
          <select id="hypSuspect" name="suspectId" defaultValue="">
            <option value="">Select a person…</option>
            {people.map((person) => (
              <option value={person.id} key={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypNature">Accidental or deliberate incident</label>
          <select id="hypNature" name="nature" defaultValue="">
            <option value="">Select…</option>
            <option value="accidental">Accidental</option>
            <option value="deliberate">Deliberate</option>
            <option value="unclear">Unclear</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypEvidence">Selected supporting evidence</label>
          <select id="hypEvidence" name="evidenceIds" multiple size={6}>
            {evidence.map((item) => (
              <option value={item.id} key={item.id}>
                {item.id} - {item.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypConfidence">Confidence (0–100)</label>
          <input
            type="range"
            id="hypConfidence"
            name="confidence"
            min={0}
            max={100}
            defaultValue={50}
          />
          <output htmlFor="hypConfidence">50</output>
        </div>

        <div className="form-row">
          <label htmlFor="hypExplanation">Written explanation</label>
          <textarea
            id="hypExplanation"
            name="explanation"
            rows={4}
            placeholder="Explain your reasoning…"
          />
        </div>

        <div className="form-row">
          <label htmlFor="hypAlternative">Alternative explanation</label>
          <textarea
            id="hypAlternative"
            name="alternative"
            rows={3}
            placeholder="What else could explain the evidence?"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-primary" disabled>
            Save hypothesis draft
          </button>
          <span className="hint-text">Enabled in Demo 2</span>
        </div>
      </form>
    </div>
  );
}
