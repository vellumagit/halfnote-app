import { Suspense } from "react";
import { NewSessionForm } from "@/components/sessions/new-session-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewSessionPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full max-w-2xl" />}>
      <NewSessionForm />
    </Suspense>
  );
}
