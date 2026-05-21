export function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-gray-200" />
      <span
        className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
        style={{ color: "#9aa0ad", letterSpacing: "0.12em" }}
      >
        {title}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}
