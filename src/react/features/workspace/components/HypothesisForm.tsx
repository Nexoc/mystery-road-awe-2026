import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  readHypothesisDraft,
  writeHypothesisDraft,
  type HypothesisDraft,
} from "../../../../shared/persistence.js";
import type { Evidence, Person } from "../../../../types.js";

type HypothesisFormProps = Readonly<{
  people: readonly Person[];
  evidence: readonly Evidence[];
}>;

type SaveStatus =
  | Readonly<{ kind: "idle" }>
  | Readonly<{ kind: "saved"; savedAt: string }>
  | Readonly<{ kind: "error"; message: string }>;

export function HypothesisForm({ people, evidence }: HypothesisFormProps) {
  const [draft, setDraft] = useState<HypothesisDraft>(() =>
    readHypothesisDraft(),
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ kind: "idle" });

  const updateDraft = (changes: Partial<HypothesisDraft>) => {
    setDraft((currentDraft) => ({ ...currentDraft, ...changes }));
    setSaveStatus({ kind: "idle" });
  };

  const handleEvidenceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const evidenceIds = Array.from(
      event.currentTarget.selectedOptions,
      (option) => option.value,
    );

    updateDraft({ evidenceIds });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = writeHypothesisDraft(draft);

    setSaveStatus(
      result.ok
        ? { kind: "saved", savedAt: result.savedAt }
        : { kind: "error", message: result.message },
    );
  };

  return (
    <div className="hypothesis-card">
      <h3>Hypothesis Draft</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="hypSuspect">Suspected responsible person</label>
          <select
            id="hypSuspect"
            name="suspectId"
            value={draft.suspectId}
            onChange={(event) =>
              updateDraft({ suspectId: event.currentTarget.value })
            }
          >
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
          <select
            id="hypNature"
            name="nature"
            value={draft.nature}
            onChange={(event) =>
              updateDraft({ nature: event.currentTarget.value })
            }
          >
            <option value="">Select…</option>
            <option value="accidental">Accidental</option>
            <option value="deliberate">Deliberate</option>
            <option value="unclear">Unclear</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypEvidence">Selected supporting evidence</label>
          <select
            id="hypEvidence"
            name="evidenceIds"
            multiple
            size={6}
            value={draft.evidenceIds}
            onChange={handleEvidenceChange}
          >
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
            value={draft.confidence}
            onChange={(event) =>
              updateDraft({ confidence: Number(event.currentTarget.value) })
            }
          />
          <output htmlFor="hypConfidence">{draft.confidence}</output>
        </div>

        <div className="form-row">
          <label htmlFor="hypExplanation">Written explanation</label>
          <textarea
            id="hypExplanation"
            name="explanation"
            rows={4}
            value={draft.explanation}
            onChange={(event) =>
              updateDraft({ explanation: event.currentTarget.value })
            }
            placeholder="Explain your reasoning…"
          />
        </div>

        <div className="form-row">
          <label htmlFor="hypAlternative">Alternative explanation</label>
          <textarea
            id="hypAlternative"
            name="alternative"
            rows={3}
            value={draft.alternative}
            onChange={(event) =>
              updateDraft({ alternative: event.currentTarget.value })
            }
            placeholder="What else could explain the evidence?"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save hypothesis draft
          </button>

          <span aria-live="polite">
            {saveStatus.kind === "saved" && (
              <span
                className="saved-msg"
                title={`Saved at ${saveStatus.savedAt}`}
              >
                Saved
              </span>
            )}

            {saveStatus.kind === "error" && (
              <span className="hint-text" role="alert">
                {saveStatus.message}
              </span>
            )}
          </span>
        </div>
      </form>
    </div>
  );
}
