import Link from "next/link";

interface DashboardButtonProps {
  href: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}

export function DashboardButton({
  href,
  label,
  color,
  icon,
}: DashboardButtonProps) {
  return (
    <Link href={href} className="flex flex-col items-center group">
      <div
        className={`w-24 h-24 rounded-full ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all`}
      >
        {icon}
      </div>

      <span className="mt-3 text-lg font-semibold text-white">
        {label}
      </span>
    </Link>
  );
}
