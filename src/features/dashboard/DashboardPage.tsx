import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RenderIf } from "@/components/ui/render-if";
import { useAuthStore } from "@/stores/auth.store";
import type { CompanyType } from "@/types/api";

import {
  GlobalRegionList,
  LatestTable,
  ReviewCard,
  ReviewsModal,
  StatCardItem,
  WorldMap,
  YearButton,
} from "./components";
import {
  chartConfig,
  globalRegions,
  resolveDashboardContent,
  revenueData,
  reviewModalSummary,
  reviewMetrics,
  reviewThreads,
  reviews,
  stats,
} from "./dashboard.data";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const companyType = user?.company?.type as CompanyType | undefined;
  const { companyLabel, companyUnit, latestTable } =
    resolveDashboardContent(companyType);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  return (
    <>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Control your {companyLabel.toLowerCase()} activity from one simple
            dashboard.
          </p>
        </div>

        <RenderIf condition={!companyType} fallback={null}>
          <div className="rounded-2xl border border-brand-100 bg-brand-25 px-4 py-3 text-sm text-brand-700">
            We could not detect a company type yet. Showing the default
            dashboard layout.
          </div>
        </RenderIf>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              title: "Global ranking",
              value: "4",
              context: `Of 340 ${companyUnit} in your city`,
            },
            {
              title: "Regional ranking",
              value: "626",
              context: `Of 9,046 ${companyUnit} in your region`,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-2xl bg-brand-600 text-white p-6"
            >
              <div className="absolute inset-0 opacity-20">
                <img
                  src="/images/backgrounds/topographic.png"
                  alt="background"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="relative z-10 space-y-2">
                <p className="text-sm font-medium text-brand-25">
                  {card.title}
                </p>
                <p className="text-3xl font-semibold">{card.value}</p>
                <p className="text-sm text-brand-50">{card.context}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCardItem key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Revenue over time
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Compare revenue vs. gross margin
                </p>
              </div>
              <YearButton />
            </div>
            <div className="mt-4">
              <ChartContainer config={chartConfig} className="h-[260px]">
                <BarChart data={revenueData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={[6, 6, 0, 0]}
                    barSize={10}
                  />
                  <Bar
                    dataKey="margin"
                    fill="var(--color-margin)"
                    radius={[6, 6, 0, 0]}
                    barSize={10}
                  />
                </BarChart>
              </ChartContainer>
              <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                  Revenue
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning-400" />
                  Gross margin
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Global</p>
              <YearButton />
            </div>
            <div className="mt-4">
              <WorldMap />
              <GlobalRegionList regions={globalRegions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Reviews</p>
              <YearButton />
            </div>
            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                variant="ghost"
                className="rounded-full border border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsReviewsOpen(true)}
              >
                See all reviews
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                {latestTable.title}
              </p>
              <div className="flex items-center gap-2">
                <YearButton />
                <Button variant="ghost" size="icon-sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <LatestTable config={latestTable} />
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                variant="ghost"
                className="rounded-full border border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100"
              >
                {latestTable.ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        summary={reviewModalSummary}
        metrics={reviewMetrics}
        reviews={reviewThreads}
      />
    </>
  );
}
