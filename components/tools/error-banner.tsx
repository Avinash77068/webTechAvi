import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorBanner({ title = "Something went wrong", messages }: { title?: string; messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {messages.length === 1 ? (
          <p>{messages[0]}</p>
        ) : (
          <ul className="list-inside list-disc">
            {messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
}
