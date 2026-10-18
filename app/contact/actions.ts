"use server";

import { contactSchema } from "@/lib/contact-schema";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitContact(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const result = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!result.success) {
    return {
      status: "error",
      message: "Vérifiez les champs du formulaire et réessayez.",
    };
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL || !process.env.CONTACT_FROM) {
    return {
      status: "error",
      message: "Le formulaire n’est pas encore activé. Les coordonnées de contact de l’association doivent être configurées.",
    };
  }

  const { name, email, subject, message } = result.data;
  let response: Response;

  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM,
        to: [process.env.CONTACT_EMAIL],
        reply_to: email,
        subject: `[Contact site] ${subject}`,
        text: `Message envoyé depuis le formulaire de contact.\n\nNom ou pseudonyme : ${name}\nAdresse e-mail : ${email}\nObjet : ${subject}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return {
      status: "error",
      message: "Le message n’a pas pu être envoyé pour le moment. Réessayez plus tard.",
    };
  }

  if (!response.ok) {
    return {
      status: "error",
      message: "Le message n’a pas pu être envoyé pour le moment. Réessayez plus tard.",
    };
  }

  return {
    status: "success",
    message: "Votre message a été envoyé. Merci d’avoir pris contact avec l’association.",
  };
}
