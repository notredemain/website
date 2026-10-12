const form = document.querySelector(".contact-form");
if (!form) throw new Error("contact form not found");

const rules = {
  name:    { required: true, label: "Le nom est requis." },
  email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: "Une adresse e-mail valide est requise." },
  message: { required: true, label: "Le message est requis." },
  consent: { required: true, label: "Vous devez accepter la politique de confidentialité." },
};

function getField(name) {
  return form.querySelector(`[name="${name}"]`);
}

function setError(name, msg) {
  const field = getField(name);
  if (!field) return;
  const wrap = field.closest(".form-field");
  wrap?.classList.add("form-field--error");
  let err = wrap?.querySelector(".form-field__error");
  if (!err) {
    err = document.createElement("p");
    err.className = "form-field__error";
    err.setAttribute("role", "alert");
    wrap?.append(err);
  }
  err.textContent = msg;
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", err.id || (err.id = `err-${name}`));
}

function clearError(name) {
  const field = getField(name);
  if (!field) return;
  const wrap = field.closest(".form-field");
  wrap?.classList.remove("form-field--error");
  wrap?.querySelector(".form-field__error")?.remove();
  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
}

function validate() {
  let firstInvalid = null;
  let valid = true;
  for (const [name, rule] of Object.entries(rules)) {
    const field = getField(name);
    const value = field?.type === "checkbox" ? field?.checked : field?.value?.trim();
    if (rule.required && !value) {
      setError(name, rule.label);
      if (!firstInvalid) firstInvalid = field;
      valid = false;
    } else if (rule.pattern && value && !rule.pattern.test(value)) {
      setError(name, rule.label);
      if (!firstInvalid) firstInvalid = field;
      valid = false;
    } else {
      clearError(name);
    }
  }
  firstInvalid?.focus();
  return valid;
}

// Live clearing of errors on input
for (const name of Object.keys(rules)) {
  getField(name)?.addEventListener("input", () => clearError(name));
  getField(name)?.addEventListener("change", () => clearError(name));
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const submit = form.querySelector("[type=submit]");
  submit.disabled = true;
  submit.textContent = "Envoi en cours…";

  try {
    const res = await fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    if (res.ok) {
      window.location.href = "/merci/";
    } else {
      throw new Error("server error");
    }
  } catch {
    form.querySelector(".form-error")?.removeAttribute("hidden");
    submit.disabled = false;
    submit.textContent = "Envoyer le message";
  }
});
