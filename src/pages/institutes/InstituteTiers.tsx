import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { instituteTiers } from "@/data/mockData";
import { cn } from "@/lib/utils";

const InstituteTiers = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Tier Management"
        description="Configure subscription tiers and features"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Institutes", href: "/superadmin/institutes" },
          { label: "Tiers" },
        ]}
        actions={<Button className="gradient-button">Create New Tier</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {instituteTiers.map((tier, index) => (
          <div
            key={tier.id}
            className={cn(
              "bg-card rounded-2xl p-6 shadow-soft border-2 transition-all hover-lift",
              index === 1 ? "border-primary scale-105" : "border-border/50"
            )}
          >
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-button rounded-full text-xs font-semibold">
                Most Popular
              </div>
            )}
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4", `bg-${tier.color}/10`)}>
              <span className={cn("text-2xl font-bold", `text-${tier.color}`)}>{tier.name[0]}</span>
            </div>
            <h3 className="text-2xl font-bold">{tier.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold gradient-text">₹{tier.price.toLocaleString()}</span>
              <span className="text-muted-foreground">/{tier.billingCycle}</span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Up to {tier.maxStudents === -1 ? "Unlimited" : tier.maxStudents.toLocaleString()} students</p>
              <p>Up to {tier.maxTeachers === -1 ? "Unlimited" : tier.maxTeachers} teachers</p>
            </div>
            <div className="mt-6 space-y-3">
              {tier.features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className={cn("text-sm", feature.included ? "text-foreground" : "text-muted-foreground")}>
                    {feature.name}
                    {feature.limit && ` (${feature.limit})`}
                  </span>
                </div>
              ))}
            </div>
            <Button variant={index === 1 ? "default" : "outline"} className={cn("w-full mt-6", index === 1 && "gradient-button")}>
              Edit Tier
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstituteTiers;