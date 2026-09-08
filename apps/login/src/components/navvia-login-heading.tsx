import { ReactNode } from "react";

export function NavviaLoginHeading({
  title,
  description,
  identity,
}: {
  title: ReactNode;
  description?: ReactNode;
  identity?: ReactNode;
}) {
  return (
    <div className="navvia-login-heading">
      {identity}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
