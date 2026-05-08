import { clientStorage } from "./clientStorage";

export {
  clientStorage,
} from "./clientStorage";

export const getTransactions = () => clientStorage.getTransactions();
export const setTransactions = (transactions: import("@/types").Transaction[]) =>
  clientStorage.setTransactions(transactions);
export const getGoals = () => clientStorage.getGoals();
export const setGoals = (goals: import("@/types").UserGoal[]) => clientStorage.setGoals(goals);

