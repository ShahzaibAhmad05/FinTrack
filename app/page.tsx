"use client";

// react stuff
import { useState } from "react";

// object types
import type { Expense } from "@/types";


export default function Home() {
  // main expenses list
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // elements to be used within this
  const [id, setId] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [amount, setAmount] = useState<string>("");


  // functions to be used here
  const handleAddExpense = () => {
    if (!title || !amount) 
      return;


    const newExpense = {
      id: id,
      amount: Number(amount),
      title: title,
      note: note
    } as Expense;

    setExpenses([...expenses, newExpense]);


    // reset the stuff and increment id
    setId(id+1);
    setAmount("");
    setTitle("");
    setNote("");
  };

  const removeExpense = (expenseId: number) => {
    if (!expenseId) 
      return;

    setExpenses(expenses.filter(exp => exp.id !== expenseId));
  }


  return (
    <main className="min-h-screen my-12">
      <div className="flex flex-col gap-2 mb-10 mx-12 mt-12 border border-black p-8">
        <label 
          htmlFor="expense-title"
          className="font-semibold"
        >
          Title
        </label>
        <input
          id="expense-title"
          type="text"
          placeholder="What was the expense?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-blue p-2"
        />
        <label 
          htmlFor="expense-amount"
          className="font-semibold"
        >
          Amount
        </label>
        <input
          id="expense-amount"
          type="text"
          placeholder="Enter the amount here."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-blue p-2"
        />
        <label 
          htmlFor="expense-notes"
          className="font-semibold"
        >
          Additional Notes
        </label>
        <input
          id="expense-notes"
          type="text"
          placeholder="Any additional notes?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border border-blue p-2"
        />
        <button 
          onClick={handleAddExpense}
          className="border rounded-md border-black max-w-48 mt-4 py-2 bg-gray-50 hover:bg-gray-200 transition-colors"
        >
          Add this EXP!!
        </button>
      </div>

      {expenses.length > 0 && (
        <div className="flex flex-col gap-2 mx-12">
          The list of your crimes
          {expenses.map((expense) => (
            <div 
              className="flex flex-col border border-black p-6" 
              key={expense.id}
            >
              <span>title: {expense.title}</span>
              <span>note: {expense.note}</span>
              <span>amount: {expense.amount}</span>
              <button
                onClick={() => removeExpense(expense.id)}
                className="border border-black rounded-md max-w-48 mt-4 bg-gray-50 hover:bg-gray-200"
              >
                Remove this one
              </button>
            </div>
          ))}
        </div>
      )}

      {expenses.length > 0 && (
        <div className="my-12 text-center">
          <span className="text-4xl font-bold">
            Control your spending bro.
          </span>
        </div>
      )}
    </main>
  );
}
