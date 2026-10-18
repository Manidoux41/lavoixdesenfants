"use client";

import { UserPlus } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import {
  changeOwnPasswordAction,
  createUserAction,
  deleteUserAction,
  resetUserPasswordAction,
  updateUserAction,
} from "@/app/admin/users/actions";

const roles = ["USER", "CONTRIBUTOR", "ADMIN"] as const;
const roleLabels: Record<(typeof roles)[number], string> = {
  USER: "Utilisateur",
  CONTRIBUTOR: "Contributeur",
  ADMIN: "Administrateur",
};

type UserSummary = {
  id: string;
  name: string | null;
  email: string;
  role: (typeof roles)[number];
  createdAt: Date;
};

export function UserManager({ users, currentUserId }: { users: UserSummary[]; currentUserId: string }) {
  return (
    <>
      <section className="admin-panel user-create-panel">
        <div className="admin-panel-heading"><h2>Mon mot de passe administrateur</h2></div>
        <form className="admin-editor" action={changeOwnPasswordAction}>
          <div className="admin-field">
            <label htmlFor="current-admin-password">Mot de passe actuel</label>
            <input id="current-admin-password" name="currentPassword" type="password" required maxLength={256} autoComplete="current-password" />
          </div>
          <div className="admin-editor-row">
            <div className="admin-field">
              <label htmlFor="new-admin-password">Nouveau mot de passe</label>
              <input id="new-admin-password" name="password" type="password" required minLength={14} maxLength={256} autoComplete="new-password" />
            </div>
            <div className="admin-field">
              <label htmlFor="confirm-admin-password">Confirmer le nouveau mot de passe</label>
              <input id="confirm-admin-password" name="confirmation" type="password" required minLength={14} maxLength={256} autoComplete="new-password" />
            </div>
          </div>
          <button className="admin-primary" type="submit">Modifier mon mot de passe</button>
        </form>
      </section>

      <section className="admin-panel user-create-panel">
        <div className="admin-panel-heading"><h2>Créer un compte</h2></div>
        <form className="admin-editor" action={createUserAction}>
          <div className="admin-editor-row">
            <div className="admin-field">
              <label htmlFor="new-user-name">Nom</label>
              <input id="new-user-name" name="name" maxLength={100} autoComplete="name" />
            </div>
            <div className="admin-field">
              <label htmlFor="new-user-email">Adresse e-mail</label>
              <input id="new-user-email" name="email" type="email" required maxLength={254} autoComplete="email" />
            </div>
            <div className="admin-field">
              <label htmlFor="new-user-role">Rôle</label>
              <select id="new-user-role" name="role" defaultValue="USER">
                {roles.map((role) => <option value={role} key={role}>{roleLabels[role]}</option>)}
              </select>
            </div>
          </div>
          <div className="admin-field">
            <label htmlFor="new-user-password">Mot de passe initial</label>
            <input id="new-user-password" name="password" type="password" required minLength={14} maxLength={256} autoComplete="new-password" />
            <small>Au moins 14 caractères. Transmettez-le à la personne par un canal privé ; il n’est pas affiché ensuite.</small>
          </div>
          <button className="admin-primary" type="submit"><UserPlus size={16} aria-hidden="true" /> Créer le compte</button>
        </form>
      </section>

      <section className="admin-panel user-list-panel" aria-label="Comptes existants">
        {users.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th scope="col">Nom</th><th scope="col">Adresse e-mail</th><th scope="col">Rôle</th><th scope="col">Créé le</th><th scope="col">Actions / mot de passe</th></tr></thead>
              <tbody>
                {users.map((user) => {
                  const formId = `user-update-${user.id}`;
                  return (
                    <tr key={user.id}>
                      <th scope="row">
                        <input
                          aria-label={`Nom de ${user.email}`}
                          name="name"
                          form={formId}
                          defaultValue={user.name ?? ""}
                          maxLength={100}
                        />
                        {user.id === currentUserId && <small>Votre compte</small>}
                      </th>
                      <td><input aria-label={`E-mail de ${user.email}`} name="email" form={formId} type="email" defaultValue={user.email} required maxLength={254} /></td>
                      <td>
                        <select
                          aria-label={`Rôle de ${user.email}`}
                          name="role"
                          form={formId}
                          defaultValue={user.role}
                          disabled={user.id === currentUserId}
                        >
                          {roles.map((role) => <option value={role} key={role}>{roleLabels[role]}</option>)}
                        </select>
                        {user.id === currentUserId && <input type="hidden" name="role" value={user.role} form={formId} />}
                      </td>
                      <td>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(user.createdAt)}</td>
                      <td className="admin-row-actions">
                        <form id={formId} action={updateUserAction}><input type="hidden" name="id" value={user.id} /><button type="submit">Enregistrer</button></form>
                        {user.id !== currentUserId && (
                          <>
                            <form action={resetUserPasswordAction}>
                              <input type="hidden" name="id" value={user.id} />
                              <label className="sr-only" htmlFor={`reset-password-${user.id}`}>Nouveau mot de passe pour {user.email}</label>
                              <input id={`reset-password-${user.id}`} name="password" type="password" minLength={14} maxLength={256} required autoComplete="new-password" placeholder="Nouveau mot de passe" />
                              <label className="sr-only" htmlFor={`confirm-password-${user.id}`}>Confirmer le nouveau mot de passe pour {user.email}</label>
                              <input id={`confirm-password-${user.id}`} name="confirmation" type="password" minLength={14} maxLength={256} required autoComplete="new-password" placeholder="Confirmation" />
                              <button type="submit">Changer le mot de passe</button>
                            </form>
                            <form action={deleteUserAction}>
                              <input type="hidden" name="id" value={user.id} />
                              <ConfirmSubmitButton
                                className="admin-danger"
                                confirmation={`Supprimer le compte de ${user.email} ? Ses articles et images seront conservés et rattachés à votre compte.`}
                              >
                                Supprimer
                              </ConfirmSubmitButton>
                            </form>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty"><p>Aucun compte utilisateur.</p></div>
        )}
      </section>
      <p className="admin-callout">Les mots de passe doivent comporter au moins 14 caractères. Changer le mot de passe d’un autre compte révoque toutes ses sessions. Les utilisateurs simples n’ont pas accès à l’espace d’administration. Les changements de rôle révoquent leurs sessions ; le dernier administrateur et votre propre compte ne peuvent pas être supprimés.</p>
    </>
  );
}
