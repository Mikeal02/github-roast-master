export function DeveloperArchetype({ archetype }) {
  return (
    <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/50 rounded-full px-3 py-1 text-sm">
      <span className="text-lg">{archetype.emoji}</span>
      <span className="font-semibold text-accent">{archetype.name}</span>
      <span className="text-muted-foreground text-xs">• {archetype.description}</span>
    </div>
  );
}
