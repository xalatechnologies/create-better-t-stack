import { createFileRoute } from "@tanstack/react-router";
import AuthForms from "@/components/auth-forms";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthForms />);
}
