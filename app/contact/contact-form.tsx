"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { submitContact, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div className="form-success" role="status">
        <span className="form-success-mark" aria-hidden="true">✓</span>
        <h2>Message envoyé.</h2>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" action={action}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="contact-name">Nom ou pseudonyme <span aria-hidden="true">*</span></label>
          <input id="contact-name" name="name" autoComplete="name" maxLength={100} required />
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">Adresse e-mail <span aria-hidden="true">*</span></label>
          <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="contact-subject">Objet <span aria-hidden="true">*</span></label>
        <input id="contact-subject" name="subject" maxLength={120} required />
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">Votre message <span aria-hidden="true">*</span></label>
        <textarea id="contact-message" name="message" rows={6} minLength={10} maxLength={3000} required />
        <span className="field-hint">3 000 caractères maximum.</span>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Ne pas remplir</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state.status === "error" && <p className="form-error" role="alert">{state.message}</p>}
      <p className="form-privacy">
        N’envoyez pas de documents judiciaires ni de renseignements sensibles concernant un enfant. Votre message sera transmis à l’adresse de l’association via son prestataire d’envoi de courriels.
      </p>
      <button className="button button-red form-submit" type="submit" disabled={pending}>
        {pending ? "Envoi en cours…" : "Envoyer le message"} <Send size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
