'use client';

import { PropsWithChildren, useEffect } from "react";
import styles from "./Popup.module.css";

type PopupProps = PropsWithChildren<{
  isOpen: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
}>;

export default function Popup({
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  children,
}: PopupProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className={styles.overlay}
      onClick={() => {
        if (closeOnOverlayClick) {
          onClose?.();
        }
      }}
      role="dialog"
    >
      <div className={styles.card} onClick={(event) => event.stopPropagation()}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
