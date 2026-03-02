import React, { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

let openModalCount = 0;
let previousBodyOverflow = "";

const lockBodyScroll = () => {
  if (typeof document === "undefined") return;

  openModalCount += 1;

  if (openModalCount === 1) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
};

const unlockBodyScroll = () => {
  if (typeof document === "undefined") return;

  openModalCount = Math.max(0, openModalCount - 1);

  if (openModalCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
};

const getFocusableElements = (container) => {
  if (!container) return [];

  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
    if (!(element instanceof HTMLElement)) return false;
    if (element.hasAttribute("disabled") || element.getAttribute("aria-hidden") === "true") {
      return false;
    }
    return true;
  });
};

export default function AccessibleModal({
  isOpen,
  onClose,
  children,
  className = "modal-content",
  overlayClassName = "modal-overlay",
  closeOnEscape = true,
  closeOnOverlayClick = true,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaLabel,
  initialFocusRef,
}) {
  const dialogRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    lockBodyScroll();

    const focusTarget =
      initialFocusRef?.current || getFocusableElements(dialogRef.current)[0] || dialogRef.current;
    focusTarget?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(dialogRef.current);

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      unlockBodyScroll();

      const previousActive = previousActiveElementRef.current;
      if (previousActive && typeof previousActive.focus === "function") {
        previousActive.focus();
      }
    };
  }, [closeOnEscape, initialFocusRef, isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (!closeOnOverlayClick) return;
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className={overlayClassName} onClick={handleOverlayClick} role="presentation">
      <div
        ref={dialogRef}
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
