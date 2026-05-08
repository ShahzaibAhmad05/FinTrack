/**
 * category: income, expense, transaction, investment, saving
 * id will be a uuid generated unique string
 */
export type Transaction = {
  id: string,
  category: string,
  amount: number,
  title: string,
  description: string,
  created_at: string
}

export type TimelineOption = "week" | "month" | "year" | "lifetime";

export type GoalMode = "balanced" | "investing" | "saving";

export type TransactionInput = {
  category: string,
  amount: string,
  title: string,
  description: string
}

export type UserGoal = {
  id: string,
  title: string,
  mode: GoalMode,
  target_amount: number,
  created_at: string
}

export type Suggestion = {
  id: string,
  title: string,
  detail: string
}

