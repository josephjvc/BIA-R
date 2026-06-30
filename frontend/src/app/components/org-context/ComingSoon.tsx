import { Construction } from "lucide-react";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <div className="size-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
        <Construction className="size-7 text-amber-500" strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#0A2540" }}>{title} coming soon</div>
      <div className="mt-2 max-w-sm" style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>
        {description}
      </div>
    </div>
  );
}