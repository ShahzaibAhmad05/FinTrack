// types
import type { Transaction } from "@/types";

// modules
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";


type ReportSectionProps = {
  transactions: Transaction[];
};


export default function ReportSection({ transactions }: ReportSectionProps) {
  const incomeData = {
    amount: transactions
    .filter(t => t.category === "income")
    .map(t => t.amount)
    .reduce((acc, curr) => acc + curr, 0),
    type: "income",
    fill: "rgb(0, 201, 80)"
  };

  const expenseData = {
    amount: transactions
    .filter(t => t.category !== "income")
    .map(t => t.amount)
    .reduce((acc, curr) => acc + curr, 0),
    type: "expense",
    fill: "rgb(254, 154, 0)"
  };


  const incomeExpenseData = [ incomeData, expenseData ];
  const totalBalance: number = incomeData.amount - expenseData.amount;
  

  return (
    <div className="flex flex-col gap-10">
      <div 
        className="flex flex-row bg-white border border-black/50 px-18 py-6 rounded-3xl gap-18"
      >
        <div className="flex flex-col w-[40%] my-12">
          <h3 className="text-4xl font-bold">Your current budget is:</h3>
          <div className="my-3 ml-10">
            <span className={`text-8xl font-extrabold ${totalBalance < 0 ? "text-amber-500" : "text-green-500"}`}>
              {totalBalance.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="w-[56%]">
          <ResponsiveContainer>
            <BarChart data={ incomeExpenseData } layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="type" type="category" />
              <Tooltip 
                cursor={{ fill: "#ffffff"}} 
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length && payload[0].value > 0) 
                    return (
                      <div className="rounded-lg border border-black bg-white px-2 py-0.5">
                        <span>{payload[0].value.toLocaleString()}</span>
                      </div>
                    );
                  return null;
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="#000000" 
                radius={[0, 24, 24, 0]} 
                barSize={85} 
              >
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

