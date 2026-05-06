// object types
import type { Expense } from "@/types";

// react stuff
import { useState } from "react";

// custom modules
import { addExpense, removeExpense, getExpenses } from "@/lib/storage";


export function useExpenses() {
  const [nextId, setNextId] = useState<number>(1);
  const [expenses, setExpenses] = useState<Expense[]>(getExpenses());


  const handleAddExpense = (title: string, note: string, amount: number) => {
    const newExpense = {
      id: nextId,
      title: title,
      note: note,
      amount: amount
    } as Expense;

    try {
      addExpense(newExpense);
      setExpenses([...expenses, newExpense]);
      setNextId(nextId+1);
    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : error);
    }
  };


  const handleRemoveExpense = (expense: Expense) => {
    setExpenses(expenses.filter(exp => exp.id !== expense.id));
    removeExpense(expense);
  };


  return {
    handleAddExpense,
    handleRemoveExpense,
    expenses
  };
}

