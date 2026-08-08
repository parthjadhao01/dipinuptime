export function Stats() {
  const stats = [
    {
      label: "Uptime guaranteed",
      value: "99.9%",
      description: "SLA backed by our global network",
    },
    {
      label: "Incident detection",
      value: "<30s",
      description: "Average time to alert",
    },
    {
      label: "Monitoring locations",
      value: "150+",
      description: "Geographically distributed",
    },
    {
      label: "Companies trust us",
      value: "10k+",
      description: "Active monitoring services",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center md:text-left">
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {stat.value}
            </div>
            <div className="text-sm font-semibold text-muted-foreground mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-muted-foreground/70">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
