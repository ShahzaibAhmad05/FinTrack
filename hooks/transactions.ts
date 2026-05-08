// object types
import type { GoalMode, Transaction, TransactionInput, UserGoal } from "@/types";

// react stuff
import { useState } from "react";

// custom modules
import {
  getTransactions as getTransactionsLocalStorage, 
  setTransactions as setTransactionsLocalStorage,
  getGoals as getGoalsLocalStorage,
  setGoals as setGoalsLocalStorage
} from "@/lib/storage";


export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(
    () => getTransactionsLocalStorage()
  );
  const [goal, setGoal] = useState<UserGoal | null>(
    () => getGoalsLocalStorage()[0] || null
  );
  const [isLoading] = useState<boolean>(false);


  /**
   * throws an Error if amount is not number convertible or missing
   */
  const handleAddTransaction = (
    category: string, amount: string,
    title: string, description: string
  ) => {
    const amountNum = Number(amount);

    if (Number.isNaN(amountNum)) {
      console.error(`Cannot add transaction: invalid number input.`);
      return;
    }

    else if (!title || !amount || !description || !category) {
      console.error(`Cannot add transaction: missing transaction attribute(s).`);
      return;
    }


    if (category === "auto-select") {
      // TODO: implement categorization algo here
      category = "expense";
    }


    const newT = {
      id: crypto.randomUUID(),
      category: category,
      amount: amountNum,
      title: title,
      description: description,
      created_at: new Date().toISOString()
    } as Transaction;


    const updatedTransactions = [...transactions, newT];
    setTransactions(updatedTransactions);
    setTransactionsLocalStorage(updatedTransactions);
  };


  const handleEditTransaction = (
    transactionId: string,
    input: TransactionInput
  ) => {
    const amountNum = Number(input.amount);

    if (Number.isNaN(amountNum)) {
      console.error("Cannot edit transaction: invalid number input.");
      return;
    }

    if (!input.title || !input.amount || !input.description || !input.category) {
      console.error("Cannot edit transaction: missing transaction attribute(s).");
      return;
    }

    const updatedTransactions = transactions.map((transaction) => {
      if (transaction.id !== transactionId) {
        return transaction;
      }

      return {
        ...transaction,
        category: input.category === "auto-select" ? "expense" : input.category,
        amount: amountNum,
        title: input.title,
        description: input.description
      };
    });

    setTransactions(updatedTransactions);
    setTransactionsLocalStorage(updatedTransactions);
  };


  const handleRemoveTransaction = (transaction: Transaction) => {
    const filteredTransactions = transactions.filter(exp => exp.id !== transaction.id);
    setTransactions(filteredTransactions);
    setTransactionsLocalStorage(filteredTransactions);
  };


  const handleAddGoal = (
    title: string,
    mode: GoalMode,
    targetAmountInput: string
  ) => {
    const targetAmount = Number(targetAmountInput);

    if (!title || !mode || Number.isNaN(targetAmount) || targetAmount <= 0) {
      console.error("Cannot add goal: invalid or missing goal attribute(s).");
      return;
    }

    const newGoal = {
      id: crypto.randomUUID(),
      title,
      mode,
      target_amount: targetAmount,
      created_at: new Date().toISOString()
    } as UserGoal;

    setGoal(newGoal);
    setGoalsLocalStorage([newGoal]);
  };


  const handleEditGoal = (
    goalId: string,
    title: string,
    mode: GoalMode,
    targetAmountInput: string
  ) => {
    const targetAmount = Number(targetAmountInput);

    if (!title || !mode || Number.isNaN(targetAmount) || targetAmount <= 0) {
      console.error("Cannot edit goal: invalid or missing goal attribute(s).");
      return;
    }

    if (!goal || goal.id !== goalId) {
      return;
    }

    const updatedGoal = {
      ...goal,
      title,
      mode,
      target_amount: targetAmount
    };

    setGoal(updatedGoal);
    setGoalsLocalStorage([updatedGoal]);
  };


  const handleRemoveGoal = (goalToRemove: UserGoal) => {
    if (!goal || goalToRemove.id !== goal.id) {
      return;
    }

    setGoal(null);
    setGoalsLocalStorage([]);
  };


  return {
    handleAddTransaction,
    handleEditTransaction,
    handleRemoveTransaction,
    handleAddGoal,
    handleEditGoal,
    handleRemoveGoal,
    transactions,
    goal,
    isLoading
  };
}

