export function safeResetForm(form: HTMLFormElement | null | undefined) {
  if (!form || typeof form.reset !== "function") {
    return;
  }

  try {
    form.reset();
  } catch {
    // A successful submit should still complete if the browser cannot reset the fields.
  }
}

export function getTravelDateError(from: string, to: string, minDate: string) {
  if (from && from < minDate) {
    return "Travel from cannot be a past date.";
  }
  if (to && to < minDate) {
    return "Travel to cannot be a past date.";
  }
  if (from && to && to < from) {
    return "Travel to must be on or after the start date.";
  }
  return null;
}

