import type { FinancialSummary } from "./financialComposite";
import type { Suggestion } from "@/types";


export interface BudgetingStrategy {
  getSuggestion(summary: FinancialSummary): Suggestion | null;
}


class BalancedBudgetingStrategy implements BudgetingStrategy {
  getSuggestion(summary: FinancialSummary): Suggestion | null {
    if (summary.income === 0) {
      return null;
    }

    if (summary.expense > summary.income * 0.6) {
      return {
        id: "balanced-budget-warning",
        title: "Balanced budget needs tightening",
        detail: "Your outflows are taking too much of income. Reduce discretionary spending before adding new goals."
      };
    }

    return {
      id: "balanced-budget-maintain",
      title: "Balanced budgeting looks steady",
      detail: "Keep tracking income and outflows so the budget stays stable across the month."
    };
  }
}


class SavingsBudgetingStrategy implements BudgetingStrategy {
  getSuggestion(summary: FinancialSummary): Suggestion | null {
    if (summary.income === 0) {
      return {
        id: "savings-no-income",
        title: "Savings mode needs income",
        detail: "Add income first so savings can grow without forcing your balance negative."
      };
    }

    if (summary.saving < summary.income * 0.2) {
      return {
        id: "savings-low-rate",
        title: "Increase savings rate",
        detail: "Move a fixed share of income into savings to keep the target on track."
      };
    }

    return {
      id: "savings-mode-ok",
      title: "Savings mode is on track",
      detail: "Your savings flow is consistent. Keep the same contribution rhythm."
    };
  }
}


class InvestingBudgetingStrategy implements BudgetingStrategy {
  getSuggestion(summary: FinancialSummary): Suggestion | null {
    if (summary.income === 0) {
      return {
        id: "investing-no-income",
        title: "Investing mode needs income",
        detail: "Build a positive cash flow first, then redirect part of it into investments."
      };
    }

    if (summary.investment < summary.income * 0.15) {
      return {
        id: "investing-low-share",
        title: "Raise your investment share",
        detail: "Your investment activity is low compared to income. Consider a recurring allocation."
      };
    }

    return {
      id: "investing-mode-ok",
      title: "Investment allocation looks healthy",
      detail: "You are building assets consistently. Keep tracking for portfolio balance."
    };
  }
}


export function getBudgetingStrategy(mode: "balanced" | "saving" | "investing"): BudgetingStrategy {
  if (mode === "saving") {
    return new SavingsBudgetingStrategy();
  }

  if (mode === "investing") {
    return new InvestingBudgetingStrategy();
  }

  return new BalancedBudgetingStrategy();
}
