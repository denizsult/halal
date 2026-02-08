import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Bell, Building, CreditCard, Shield, User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import {
  CompanyTab,
  DetailsTab,
  NotificationsTab,
  SecurityTab,
} from "./components";

const tabs = [
  { id: "details", label: "My Details", icon: User },
  { id: "company", label: "Company Details", icon: Building },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
] as const;

type TabId = (typeof tabs)[number]["id"];

const VALID_TABS = new Set<string>(tabs.map((t) => t.id));

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab") ?? "details";
  const activeTab: TabId = VALID_TABS.has(rawTab)
    ? (rawTab as TabId)
    : "details";

  const setActiveTab = useCallback(
    (tab: TabId) => {
      setSearchParams(tab === "details" ? {} : { tab }, { replace: true });
    },
    [setSearchParams]
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:w-64 shrink-0">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-brand-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "details" && <DetailsTab />}
          {activeTab === "company" && <CompanyTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "security" && <SecurityTab />}

          {activeTab === "billing" && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">This section is coming soon...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
