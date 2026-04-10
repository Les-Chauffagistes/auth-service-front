'use client';

import { FormEvent, useState } from "react";
import Popup from "./Popup";
import styles from "./ChoosePseudoPopup.module.css";

type ChoosePseudoPopupProps = {
  isOpen: boolean;
  initialValue?: string;
  error?: string | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (pseudo: string) => Promise<void> | void;
};

export default function ChoosePseudoPopup({
  isOpen,
  initialValue = "",
  error = null,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ChoosePseudoPopupProps) {
  const [pseudo, setPseudo] = useState(initialValue);
  const [localError, setLocalError] = useState<string | null>(null);

  const normalizedPseudo = pseudo.trim();

  function getPseudoError(value: string) {
    if (value.length < 3) {
      return "Le pseudo doit contenir au moins 3 caractères.";
    }

    if (value.length > 30) {
      return "Le pseudo doit contenir au maximum 30 caractères.";
    }

    if (!/^[a-zA-Z0-9@_-]+$/.test(value)) {
      return "Utilisez uniquement des lettres, chiffres, tirets et underscores.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = getPseudoError(normalizedPseudo);

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    await onSubmit(normalizedPseudo);
  }

  return (
    <Popup isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isSubmitting}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Onboarding</span>
        <h2>Choisissez votre pseudo</h2>
        <p>
          Vous êtes en train de créer un compte Lightning. Choisissez un pseudo pour votre compte Chauffagistes.
        </p>
      </div>

      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pseudo">
            Pseudo
          </label>
          <input
            aria-invalid={Boolean(localError || error)}
            autoFocus
            className={styles.input}
            disabled={isSubmitting}
            id="pseudo"
            maxLength={30}
            onChange={(event) => {
              setPseudo(event.target.value);
              if (localError) {
                setLocalError(null);
              }
            }}
            placeholder="Heatman"
            value={pseudo}
          />
          <p className={styles.hint}>Entre 3 et 30 caractères.</p>
        </div>

        {localError && <p className={styles.error}>{localError}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className="tertiary" disabled={isSubmitting} onClick={onClose} type="button">
            Finalement, non
          </button>
          <button className="primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Validation..." : "Continuer"}
          </button>
        </div>
      </form>
    </Popup>
  );
}
