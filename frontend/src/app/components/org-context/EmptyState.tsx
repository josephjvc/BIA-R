import { Inbox } from "lucide-react";
import { PrimaryButton } from "../shared";

export function EmptyState({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="py-16 flex flex-col items-center text-center">
      <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
        <Inbox className="size-7 text-slate-400" strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#0A2540" }}>No processes registered yet</div>
      <div className="mt-2 max-w-sm" style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>
        Register your first business process to start building the continuity analysis context.
      </div>
      <div className="mt-6">
        <PrimaryButton onClick={onRegister}>Register Process</PrimaryButton>
      </div>
    </div>
  );
}