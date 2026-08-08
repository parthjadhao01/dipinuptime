import { Clock, Bell, BarChart3, Globe, Zap, Lock } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description:
        "Check your sites every 30 seconds with millisecond accuracy. Know the instant something goes wrong.",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description:
        "Get notified via email, Slack, SMS, or webhooks. Configure exactly how and when you want to be alerted.",
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description:
        "Track performance metrics, response times, and uptime trends with beautiful visualizations.",
    },
    {
      icon: Globe,
      title: "Global Monitoring",
      description:
        "Monitor from 150+ locations worldwide to catch regional issues and ensure your CDN is working.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Sub-second incident detection ensures your team knows about problems before your users do.",
    },
    {
      icon: Lock,
      title: "Enterprise Grade",
      description:
        "SOC 2 compliant, encrypted data, role-based access control, and audit logs for compliance.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive uptime monitoring built for modern teams and
            enterprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
