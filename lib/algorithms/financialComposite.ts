import type { Transaction } from "@/types";


export interface FinancialComponent {
  getTotal(): number;
}


class FinancialTransactionLeaf implements FinancialComponent {
  constructor(private readonly amount: number) {}

  getTotal(): number {
    return this.amount;
  }
}


class FinancialCategoryComposite implements FinancialComponent {
  private readonly children: FinancialComponent[] = [];

  add(component: FinancialComponent): void {
    this.children.push(component);
  }

  getTotal(): number {
    return this.children.reduce((acc, child) => acc + child.getTotal(), 0);
  }
}


export type FinancialSummary = {
  income: number;
  expense: number;
  investment: number;
  saving: number;
};


export function buildFinancialSummary(transactions: Transaction[]): FinancialSummary {
  const income = new FinancialCategoryComposite();
  const expense = new FinancialCategoryComposite();
  const investment = new FinancialCategoryComposite();
  const saving = new FinancialCategoryComposite();

  for (const transaction of transactions) {
    const leaf = new FinancialTransactionLeaf(transaction.amount);

    if (transaction.category === "income") {
      income.add(leaf);
    }

    else if (transaction.category === "investment") {
      investment.add(leaf);
    }

    else if (transaction.category === "saving") {
      saving.add(leaf);
    }

    else {
      expense.add(leaf);
    }
  }

  return {
    income: income.getTotal(),
    expense: expense.getTotal(),
    investment: investment.getTotal(),
    saving: saving.getTotal()
  };
}
