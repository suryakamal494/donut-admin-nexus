import { Building2, Users, GraduationCap, IndianRupee, Plus, FileQuestion, ClipboardList, Building, CreditCard, FileText, Clipboard } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { PageHeader } from "@/components/ui/page-header";
import { mockDashboardStats, monthlyGrowthData, revenueByTierData, userDistributionData, recentActivities } from "@/data/mockData";
import { Link } from "react-router-dom";

const COLORS = ["hsl(175, 70%, 45%)", "hsl(24, 95%, 65%)", "hsl(0, 85%, 70%)"];
const USER_COLORS = ["hsl(0, 85%, 70%)", "hsl(24, 95%, 65%)", "hsl(175, 70%, 45%)", "hsl(270, 70%, 60%)"];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toString();
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "institute": return Building;
    case "user": return Users;
    case "payment": return CreditCard;
    case "content": return FileText;
    case "exam": return Clipboard;
    default: return Building;
  }
};

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with DonutAI."
        breadcrumbs={[{ label: "Dashboard" }]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Institutes"
          value={mockDashboardStats.totalInstitutes}
          change={mockDashboardStats.instituteGrowth}
          icon={Building2}
          className="animate-slide-up stagger-1"
        />
        <StatsCard
          title="Active Students"
          value={formatNumber(mockDashboardStats.activeStudents)}
          change={mockDashboardStats.studentGrowth}
          icon={GraduationCap}
          className="animate-slide-up stagger-2"
        />
        <StatsCard
          title="Active Teachers"
          value={formatNumber(mockDashboardStats.activeTeachers)}
          change={mockDashboardStats.teacherGrowth}
          icon={Users}
          className="animate-slide-up stagger-3"
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(mockDashboardStats.monthlyRevenue)}
          change={mockDashboardStats.revenueGrowth}
          icon={IndianRupee}
          className="animate-slide-up stagger-4"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-soft border border-border/50">
          <h3 className="text-lg font-semibold mb-4">Institute Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyGrowthData}>
              <defs>
                <linearGradient id="colorInstitutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 85%, 70%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 85%, 70%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 25%, 88%)" />
              <XAxis dataKey="name" stroke="hsl(20, 15%, 45%)" fontSize={12} />
              <YAxis stroke="hsl(20, 15%, 45%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(30, 25%, 88%)",
                  borderRadius: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="institutes"
                stroke="hsl(0, 85%, 70%)"
                strokeWidth={3}
                fill="url(#colorInstitutes)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Tier - Donut Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
          <h3 className="text-lg font-semibold mb-4">Revenue by Tier</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueByTierData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {revenueByTierData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {revenueByTierData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
          <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userDistributionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 25%, 88%)" />
              <XAxis type="number" stroke="hsl(20, 15%, 45%)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="hsl(20, 15%, 45%)" fontSize={12} width={70} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {userDistributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={USER_COLORS[index % USER_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/superadmin/institutes/create">
              <Button className="w-full justify-start gap-3 h-12 gradient-button">
                <Plus className="w-5 h-5" />
                Add New Institute
              </Button>
            </Link>
            <Link to="/superadmin/questions/create">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <FileQuestion className="w-5 h-5" />
                Create Question
              </Button>
            </Link>
            <Link to="/superadmin/exams/create">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <ClipboardList className="w-5 h-5" />
                Create Exam
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.slice(0, 4).map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;