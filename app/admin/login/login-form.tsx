"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return (
    <form className="admin-login-form" action={action}>
      <div className="admin-field">
        <label htmlFor="admin-email">Adresse e-mail</label>
        <input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} />
      </div>
      <div className="admin-field">
        <label htmlFor="admin-password">Mot de passe</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={256} />
      </div>
      {state.error && <p className="admin-error" role="alert">{state.error}</p>}
      <button type="submit" className="admin-primary" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
