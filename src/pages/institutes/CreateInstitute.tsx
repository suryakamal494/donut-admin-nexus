import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, User, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Institute Details", icon: Building2 },
  { id: 2, title: "Admin Setup", icon: User },
  { id: 3, title: "Plan Selection", icon: CreditCard },
];

const plans = [
  { id: "basic", name: "Basic", price: "₹9,999/mo", students: 500, teachers: 25, color: "donut-teal" },
  { id: "pro", name: "Pro", price: "₹24,999/mo", students: 2000, teachers: 100, color: "donut-orange" },
  { id: "enterprise", name: "Enterprise", price: "₹49,999/mo", students: "Unlimited", teachers: "Unlimited", color: "donut-coral" },
];

const CreateInstitute = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", code: "", address: "", city: "", state: "",
    adminName: "", adminEmail: "", adminMobile: "", adminPassword: "",
    plan: "pro",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    toast({ title: "Institute Created!", description: `${formData.name} has been successfully registered.` });
    navigate("/superadmin/institutes");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Institute"
        description="Register a new institute on the platform"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Institutes", href: "/superadmin/institutes" },
          { label: "Create" },
        ]}
      />

      {/* Stepper */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  currentStep >= step.id ? "gradient-button" : "bg-muted text-muted-foreground"
                )}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <div className="hidden md:block">
                  <p className={cn("text-sm font-medium", currentStep >= step.id ? "text-foreground" : "text-muted-foreground")}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-4", currentStep > step.id ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Institute Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Institute Name *</Label>
                <Input placeholder="Enter institute name" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Institute Code *</Label>
                <Input placeholder="e.g., DPS001" value={formData.code} onChange={(e) => updateFormData("code", e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Address</Label>
                <Input placeholder="Full address" value={formData.address} onChange={(e) => updateFormData("address", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="City" value={formData.city} onChange={(e) => updateFormData("city", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={formData.state} onValueChange={(v) => updateFormData("state", v)}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Admin Setup</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Admin Name *</Label>
                <Input placeholder="Full name" value={formData.adminName} onChange={(e) => updateFormData("adminName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" placeholder="admin@institute.com" value={formData.adminEmail} onChange={(e) => updateFormData("adminEmail", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Mobile *</Label>
                <Input placeholder="10-digit mobile" value={formData.adminMobile} onChange={(e) => updateFormData("adminMobile", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input type="password" placeholder="Set password" value={formData.adminPassword} onChange={(e) => updateFormData("adminPassword", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Select Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => updateFormData("plan", plan.id)}
                  className={cn(
                    "p-6 rounded-2xl border-2 cursor-pointer transition-all hover-lift",
                    formData.plan === plan.id ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", `bg-${plan.color}/10`)}>
                    <CreditCard className={cn("w-6 h-6", `text-${plan.color}`)} />
                  </div>
                  <h4 className="text-xl font-bold">{plan.name}</h4>
                  <p className="text-2xl font-bold gradient-text mt-2">{plan.price}</p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>Up to {plan.students} students</p>
                    <p>Up to {plan.teachers} teachers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)} disabled={currentStep === 1}>
            Previous
          </Button>
          {currentStep < 3 ? (
            <Button className="gradient-button" onClick={() => setCurrentStep((s) => s + 1)}>
              Next
            </Button>
          ) : (
            <Button className="gradient-button" onClick={handleSubmit}>
              Create Institute
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateInstitute;