import type { LucideIcon } from "lucide-react";

interface TrustItemProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export function TrustItem({ icon: Icon, title, desc }: TrustItemProps) {
  return (
    <div className="pr-4 md:pr-6 text-paper">
      <Icon className="h-5 w-5 md:h-6 md:w-6" />
      <div className="font-semibold mt-3.5">{title}</div>
      <div className="text-[13px] text-mute-2 mt-1.5 leading-relaxed">{desc}</div>
    </div>
  );
}
