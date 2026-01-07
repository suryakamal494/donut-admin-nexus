import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, User, CreditCard, Check, BookOpen, Globe, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { curriculums, courses } from "@/data/masterData";

const steps = [
  { id: 1, title: "Institute Details", icon: Building2 },
  { id: 2, title: "Admin Setup", icon: User },
  { id: 3, title: "Plan Selection", icon: CreditCard },
  { id: 4, title: "Curriculum & Courses", icon: BookOpen },
];

const plans = [
  { id: "basic", name: "Basic", price: "₹9,999/mo", students: 500, teachers: 25, color: "donut-teal" },
  { id: "pro", name: "Pro", price: "₹24,999/mo", students: 2000, teachers: 100, color: "donut-orange" },
  { id: "enterprise", name: "Enterprise", price: "₹49,999/mo", students: "Unlimited", teachers: "Unlimited", color: "donut-coral" },
];

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const boardAffiliations = [
  { id: "cbse", name: "CBSE" },
  { id: "icse", name: "ICSE" },
  { id: "state", name: "State Board" },
  { id: "ib", name: "IB" },
  { id: "igcse", name: "IGCSE" },
  { id: "other", name: "Other" },
];

const academicYearStarts = [
  { id: "april", name: "April" },
  { id: "june", name: "June" },
  { id: "july", name: "July" },
];

const CreateInstitute = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Institute Details
    name: "", 
    code: "", 
    address: "", 
    city: "", 
    state: "",
    // New fields
    contactPerson: "",
    contactDesignation: "",
    phone: "",
    website: "",
    boardAffiliation: "",
    udiseCode: "",
    academicYearStart: "april",
    // Step 2: Admin Setup
    adminName: "", 
    adminEmail: "", 
    adminMobile: "", 
    adminPassword: "",
    // Step 3: Plan
    plan: "pro",
    // Step 4: Curriculum & Courses
    assignedCurriculums: [] as string[],
    assignedCourses: [] as string[],
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCurriculum = (curriculumId: string) => {
    const current = formData.assignedCurriculums;
    if (current.includes(curriculumId)) {
      updateFormData("assignedCurriculums", current.filter(c => c !== curriculumId));
    } else {
      updateFormData("assignedCurriculums", [...current, curriculumId]);
    }
  };

  const toggleCourse = (courseId: string) => {
    const current = formData.assignedCourses;
    if (current.includes(courseId)) {
      updateFormData("assignedCourses", current.filter(c => c !== courseId));
    } else {
      updateFormData("assignedCourses", [...current, courseId]);
    }
  };

  const handleSubmit = () => {
    toast({ title: "Institute Created!", description: `${formData.name} has been successfully registered.` });
    navigate("/superadmin/institutes");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.code;
      case 2:
        return formData.adminName && formData.adminEmail && formData.adminMobile && formData.adminPassword;
      case 3:
        return formData.plan;
      case 4:
        return true; // Optional step
      default:
        return true;
    }
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
      <div className="bg-card rounded-2xl p-4 md:p-6 shadow-soft border border-border/50 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px]">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-2 md:gap-3">
                <div className={cn(
                  "w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                  currentStep >= step.id ? "gradient-button" : "bg-muted text-muted-foreground"
                )}>
                  {currentStep > step.id ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <step.icon className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
                <div className="hidden lg:block">
                  <p className={cn("text-xs md:text-sm font-medium whitespace-nowrap", currentStep >= step.id ? "text-foreground" : "text-muted-foreground")}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-2 md:mx-4", currentStep > step.id ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-2xl p-4 md:p-6 shadow-soft border border-border/50">
        {/* Step 1: Institute Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Institute Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label>Institute Name *</Label>
                <Input placeholder="Enter institute name" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Institute Code *</Label>
                <Input placeholder="e.g., DPS001" value={formData.code} onChange={(e) => updateFormData("code", e.target.value)} />
              </div>
              
              {/* Contact Person */}
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input placeholder="Full name" value={formData.contactPerson} onChange={(e) => updateFormData("contactPerson", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input placeholder="e.g., Principal, Manager" value={formData.contactDesignation} onChange={(e) => updateFormData("contactDesignation", e.target.value)} />
              </div>

              {/* Phone & Website */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone Number</Label>
                <Input placeholder="Landline or mobile" value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Website</Label>
                <Input placeholder="https://www.example.edu" value={formData.website} onChange={(e) => updateFormData("website", e.target.value)} />
              </div>

              {/* Address */}
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
                    {states.map(state => (
                      <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Board & UDISE */}
              <div className="space-y-2">
                <Label>Board Affiliation</Label>
                <Select value={formData.boardAffiliation} onValueChange={(v) => updateFormData("boardAffiliation", v)}>
                  <SelectTrigger><SelectValue placeholder="Select board" /></SelectTrigger>
                  <SelectContent>
                    {boardAffiliations.map(board => (
                      <SelectItem key={board.id} value={board.id}>{board.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>UDISE Code</Label>
                <Input placeholder="11-digit UDISE code" value={formData.udiseCode} onChange={(e) => updateFormData("udiseCode", e.target.value)} />
              </div>

              {/* Academic Year */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Academic Year Starts</Label>
                <Select value={formData.academicYearStart} onValueChange={(v) => updateFormData("academicYearStart", v)}>
                  <SelectTrigger><SelectValue placeholder="Select month" /></SelectTrigger>
                  <SelectContent>
                    {academicYearStarts.map(month => (
                      <SelectItem key={month.id} value={month.id}>{month.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Admin Setup */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Admin Setup</h3>
            <p className="text-sm text-muted-foreground">Set up the primary administrator account for this institute.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

        {/* Step 3: Plan Selection */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Select Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => updateFormData("plan", plan.id)}
                  className={cn(
                    "p-4 md:p-6 rounded-2xl border-2 cursor-pointer transition-all hover-lift",
                    formData.plan === plan.id ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4", `bg-${plan.color}/10`)}>
                    <CreditCard className={cn("w-5 h-5 md:w-6 md:h-6", `text-${plan.color}`)} />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold">{plan.name}</h4>
                  <p className="text-xl md:text-2xl font-bold gradient-text mt-2">{plan.price}</p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>Up to {plan.students} students</p>
                    <p>Up to {plan.teachers} teachers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Curriculum & Courses */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Assign Curriculums & Courses</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Select the curriculums and courses this institute will have access to. You can also do this later.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Curriculums */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Curriculums
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {curriculums.filter(c => c.isActive).map((curriculum) => (
                    <div
                      key={curriculum.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        formData.assignedCurriculums.includes(curriculum.id) 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => toggleCurriculum(curriculum.id)}
                    >
                      <Checkbox 
                        checked={formData.assignedCurriculums.includes(curriculum.id)}
                        onCheckedChange={() => toggleCurriculum(curriculum.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{curriculum.name}</p>
                        <p className="text-xs text-muted-foreground">{curriculum.description}</p>
                      </div>
                      <Badge variant="outline">{curriculum.code}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Competitive Courses
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {courses.filter(c => c.isActive && c.status === "published").map((course) => (
                    <div
                      key={course.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        formData.assignedCourses.includes(course.id) 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => toggleCourse(course.id)}
                    >
                      <Checkbox 
                        checked={formData.assignedCourses.includes(course.id)}
                        onCheckedChange={() => toggleCourse(course.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{course.name}</p>
                        <p className="text-xs text-muted-foreground">{course.description}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">{course.courseType}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/superadmin/institutes/custom-course")}>
                  + Create Custom Course for this Institute
                </Button>
              </div>
            </div>

            {/* Summary */}
            {(formData.assignedCurriculums.length > 0 || formData.assignedCourses.length > 0) && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="text-sm font-medium">Selected:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.assignedCurriculums.map(id => {
                    const curr = curriculums.find(c => c.id === id);
                    return curr && <Badge key={id} variant="default">{curr.name}</Badge>;
                  })}
                  {formData.assignedCourses.map(id => {
                    const course = courses.find(c => c.id === id);
                    return course && <Badge key={id} variant="secondary">{course.name}</Badge>;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)} disabled={currentStep === 1}>
            Previous
          </Button>
          <div className="flex gap-2">
            {currentStep === 4 && (
              <Button variant="outline" onClick={handleSubmit}>
                Skip & Create
              </Button>
            )}
            {currentStep < 4 ? (
              <Button className="gradient-button" onClick={() => setCurrentStep((s) => s + 1)} disabled={!canProceed()}>
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
    </div>
  );
};

export default CreateInstitute;
