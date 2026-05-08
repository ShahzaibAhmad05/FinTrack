// types
import type { Transaction, UserGoal } from "@/types";

import { useMemo } from "react";

// modules
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

import { buildFinancialSummary } from "@/lib/algorithms/financialComposite";
import { getGoalProgress } from "@/lib/algorithms";


type ReportSectionProps = {
  transactions: Transaction[];
  goal: UserGoal | null;
};


export default function ReportSection({
  transactions,
  goal
}: ReportSectionProps) {
  const summary = buildFinancialSummary(transactions);

  const incomeData = {
    amount: summary.income,
    type: "income",
    fill: "rgb(0, 201, 80)"
  };

  const expenseData = {
    amount: summary.expense,
    type: "expense",
    fill: "rgb(254, 154, 0)"
  };

  const incomeExpenseData = [incomeData, expenseData];
  const totalBalance: number = summary.income - summary.expense - summary.investment - summary.saving;

  const investmentGrowthData = useMemo(() => {
    const sortedInvestments = transactions
      .filter((t) => t.category === "investment")
      .sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    if (sortedInvestments.length === 0) {
      return [];
    }

    let runningTotal = 0;
    const points = sortedInvestments.map((t) => {
      runningTotal += t.amount;

      return {
        timeline: new Date(t.created_at).toLocaleDateString(),
        total: runningTotal
      };
    });

    return [{ timeline: "Start", total: 0 }, ...points];
  }, [transactions]);

  const goalProgressData = useMemo(
    () => getGoalProgress(goal ? [goal] : [], transactions),
    [goal, transactions]
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row bg-white border-2 border-black px-6 sm:px-10 lg:px-18 py-6 rounded-3xl gap-8 lg:gap-18">
        <div className="flex flex-col lg:w-[40%] my-4 lg:my-12">
          <h3 className="text-4xl font-bold">Your current budget is:</h3>
          <div className="my-3 mx-auto">
            <span className={`text-5xl sm:text-6xl lg:text-8xl font-extrabold ${totalBalance < 0 ? "text-amber-500" : "text-green-500"}`}>
              {totalBalance.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="w-full lg:w-[56%] h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeExpenseData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="type" type="category" />
              <Tooltip
                cursor={{ fill: "#ffffff" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length && Number(payload[0].value) > 0) {
                    return (
                      <div className="rounded-lg border border-black bg-white px-2 py-0.5">
                        <span>{Number(payload[0].value).toLocaleString()}</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="amount"
                fill="#000000"
                radius={[0, 24, 24, 0]}
                barSize={85}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-black/50 px-6 sm:px-10 py-6 rounded-3xl">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">Investment growth</h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={investmentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeline" />
              <YAxis />
              <Tooltip />
              <Line type="linear" dataKey="total" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-black/50 px-6 sm:px-10 py-6 rounded-3xl">
        <div className="flex flex-col gap-4">
          {goalProgressData.length > 0 ? (
            goalProgressData.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center gap-4 text-left w-full rounded-2xl px-1 py-1"
              >
                <span className="mr-4 font-semibold text-lg truncate">{goal.title}</span>
                <div className="h-4 flex-1 border border-black rounded-full overflow-hidden bg-white">
                  <div
                    className="h-full bg-black"
                    style={{ width: `${goal.progressPct}%` }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right font-semibold">
                  {goal.progressPct.toFixed(0)}%
                </span>
              </div>
            ))
          ) : (
            <span className="text-gray-700">No goals yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}
