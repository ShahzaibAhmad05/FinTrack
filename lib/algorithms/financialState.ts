import type { FinancialSummary } from "./financialComposite";
import { getBudgetingStrategy } from "./budgetingStrategy";


export type FinancialStateName = "budgeting" | "savings" | "investment";


export interface FinancialState {
  getName(): FinancialStateName;
  getFocusMode(): "balanced" | "saving" | "investing";
}


class BudgetingState implements FinancialState {
  getName(): FinancialStateName {
    return "budgeting";
  }

  getFocusMode() {
    return "balanced" as const;
  }
}


class SavingsState implements FinancialState {
  getName(): FinancialStateName {
    return "savings";
  }

  getFocusMode() {
    return "saving" as const;
  }
}


class InvestmentState implements FinancialState {
  getName(): FinancialStateName {
    return "investment";
  }

  getFocusMode() {
    return "investing" as const;
  }
}


export function resolveFinancialState(summary: FinancialSummary): FinancialState {
  if (summary.saving >= summary.investment && summary.saving >= summary.expense * 0.25) {
    return new SavingsState();
  }

  if (summary.investment > summary.saving && summary.investment > summary.expense * 0.2) {
    return new InvestmentState();
  }

  return new BudgetingState();
}


export function getStateStrategy(summary: FinancialSummary) {
  const state = resolveFinancialState(summary);
  return getBudgetingStrategy(state.getFocusMode());
}
