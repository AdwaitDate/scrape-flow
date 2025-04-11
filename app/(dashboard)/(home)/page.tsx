import { GetPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatsCardsValue } from "@/actions/analytics/getStatsCardsValue";
import StatsCard from "./_components/StatsCards";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import { getWorkflowExecutionsStats } from "@/actions/analytics/getWorkflowsExecutionStats";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";

export default function HomePage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const currentDate = new Date();
  const { month, year } = searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="width-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus period={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await GetPeriods();
  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />;
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await getStatsCardsValue(selectedPeriod);

  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow Executions"
        value={data.WorkflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase Executions"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credis Consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}
function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full min-h-[120px]" />
      ))}
    </div>
  );
}

async function StatsExecutionStatus({ period }: { period: Period }) {
  const data = await getWorkflowExecutionsStats(period);

  // return <ExecutionStatusChart data={data} />;
  return <ExecutionStatusChart data={data} />;
}
