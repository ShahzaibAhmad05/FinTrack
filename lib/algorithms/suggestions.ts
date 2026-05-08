import type { Suggestion, Transaction, UserGoal } from "@/types";

import { buildFinancialSummary } from "./financialComposite";
import { getStateStrategy } from "./financialState";


export function generateSuggestions(
  transactions: Transaction[],
  goals: UserGoal[]
): Suggestion[] {
  const result: Suggestion[] = [];
  const summary = buildFinancialSummary(transactions);

  if (transactions.length === 0) {
    return [{
      id: "no-transactions",
      title: "Start tracking your cash flow",
      detail: "Add your first transaction so suggestions can react to your income, expenses, and goals."
    }];
  }

  const transactionSpend = transactions
    .filter((t) => t.category === "transaction")
    .reduce((acc, t) => acc + t.amount, 0);

  const investing = summary.investment;
  const saving = summary.saving;
  const balance = summary.income - summary.expense - investing - saving;

  const stateSuggestion = getStateStrategy(summary).getSuggestion(summary);
  if (stateSuggestion) {
    result.push(stateSuggestion);
  }

  if (summary.income === 0 && summary.expense > 0) {
    result.push({
      id: "no-income-high-expenses",
      title: "Income is zero but expenses are active",
      detail: "Record income first or reduce expenses. Without income, the balance will continue moving negative."
    });
  }

  if (summary.income === 0 && transactionSpend > 0) {
    result.push({
      id: "no-income-transaction-spend",
      title: "Transactions are active without income",
      detail: "You have transaction spending but no income. Add income or reduce general spending to avoid negative balance."
    });
  }

  if (summary.income > 0 && summary.expense > summary.income * 0.8) {
    result.push({
      id: "high-expense-ratio",
      title: "Expenses are near income",
      detail: "Your non-income spending is above 80% of income. Try reducing recurring expenses this week."
    });
  }

  if (summary.income > 0 && summary.expense >= summary.income) {
    result.push({
      id: "expenses-exceed-income",
      title: "Expenses are exceeding income",
      detail: "Your outflow is at or above inflow. Review subscriptions, one-off purchases, and unnecessary spending."
    });
  }

  if (summary.income > 0 && transactionSpend > summary.income * 0.6) {
    result.push({
      id: "transaction-spend-high",
      title: "General spending is high",
      detail: "Your transaction category spending is taking a large share of income. Consider moving some purchases into expense planning."
    });
  }

  if (summary.income > 0 && investing + saving < summary.income * 0.2) {
    result.push({
      id: "low-saving-investing",
      title: "Consider increasing saving/investing",
      detail: "Saving + investing is below 20% of income. Consider shifting part of transaction spending into these modes."
    });
  }

  const balancedGoals = goals.filter((goal) => goal.mode === "balanced");
  const investingGoals = goals.filter((goal) => goal.mode === "investing");
  const savingGoals = goals.filter((goal) => goal.mode === "saving");

  if (balancedGoals.length > 0 && balance < 0) {
    result.push({
      id: "balanced-goal-negative-balance",
      title: "Balanced goal needs a positive balance",
      detail: "Your balanced goal is easier to hit when income stays above expenses. Focus on closing the gap first."
    });
  }

  const goalTargets = goals.reduce((acc, g) => acc + g.target_amount, 0);
  if (goalTargets > 0 && investing + saving < goalTargets * 0.4) {
    result.push({
      id: "goal-progress-lagging",
      title: "Goal progress is lagging",
      detail: "Current saving/investing progress is still early versus your goal targets. Consider a fixed weekly contribution."
    });
  }

  if (investingGoals.length > 0 && investing === 0) {
    result.push({
      id: "missing-investing-progress",
      title: "Investing goal has no progress yet",
      detail: "You have an investing goal, but there are no investment transactions. Add one to start tracking progress."
    });
  }

  if (savingGoals.length > 0 && saving === 0) {
    result.push({
      id: "missing-saving-progress",
      title: "Saving goal has no progress yet",
      detail: "You have a saving goal, but there are no saving transactions. Add one to start tracking progress."
    });
  }

  if (result.length === 0) {
    result.push({
      id: "stable-pattern",
      title: "Spending pattern looks stable",
      detail: "Your current mode mix is balanced. Keep tracking consistently for better long-term recommendations."
    });
  }

  return result;
}
