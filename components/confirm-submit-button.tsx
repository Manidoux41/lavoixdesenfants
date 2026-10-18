"use client";

export function ConfirmSubmitButton({
  children,
  confirmation,
  className,
}: {
  children: React.ReactNode;
  confirmation: string;
  className?: string;
}) {
  return (
    <button
      className={className}
      type="submit"
      onClick={(event) => {
        if (!window.confirm(confirmation)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
