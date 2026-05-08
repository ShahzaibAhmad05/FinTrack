"use client";

// react stuff
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

// hooks
import { useTransactions } from "@/hooks/transactions";

import type { GoalMode, TimelineOption, Transaction, TransactionInput } from "@/types";

import { filterTransactionsByTimeline, generateSuggestions } from "@/lib/algorithms";

// components
import AddTransactionModal from "@/components/addTransactionModal";
import AddGoalModal from "@/components/addGoalModal";
import ReportSection from "@/components/reportSection";
import TransactionsSection from "@/components/transactionsSection";
import LoadingModal from "@/components/loadingModal";


export default function Home() {
  // hooks
  const { 
    handleAddTransaction,
    handleEditTransaction,
    handleRemoveTransaction,
    handleAddGoal,
    handleEditGoal,
    goal,
    transactions,
    isLoading 
  } = useTransactions();

  // control vars
  const [isAddingTransaction, setIsAddingTransaction] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [goalModalMode, setGoalModalMode] = useState<"add" | "edit">("add");
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(false);
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineOption>("lifetime");
  const timelineOptions: TimelineOption[] = ["week", "month", "year", "lifetime"];

  const timelineTransactions = useMemo(
    () => filterTransactionsByTimeline(transactions, selectedTimeline),
    [transactions, selectedTimeline]
  );

  const suggestions = useMemo(
    () => generateSuggestions(transactions, goal ? [goal] : []),
    [transactions, goal]
  );

  const openGoalModal = () => {
    if (goal) {
      setGoalModalMode("edit");
    }

    else {
      setGoalModalMode("add");
    }

    setIsGoalModalOpen(true);
  };


  return (
    <main className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-8 lg:px-12 flex flex-col gap-10 py-8 sm:py-12">
        {/* top header */}
        <div className="flex flex-col sm:flex-row gap-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            Finance Tracker
          </h2>

          {/* Functional buttons */}
          <div className="flex flex-row gap-3 sm:gap-4 sm:ml-auto sm:mt-auto mr-1 sm:mr-5 relative">
            <button
              onClick={openGoalModal}
              className="border-2 rounded-2xl border-black px-4 py-2 bg-white hover:bg-gray-200 font-semibold transition-transform hover:-translate-y-px hover:shadow-[0_1px_0_black]"
              aria-label="Open goals"
            >
              Goal
            </button>
            <button
              onClick={() => setIsTimelineOpen((prev) => !prev)}
              className="border-2 rounded-2xl border-black px-4 py-2 bg-white hover:bg-gray-200 font-semibold transition-transform hover:-translate-y-px hover:shadow-[0_1px_0_black]"
              aria-label="Select timeline"
            >
              Timeline: {selectedTimeline}
            </button>
            <button
              onClick={() => setIsAddingTransaction(true)}
              className="border-2 rounded-full border-black p-3 mr-auto bg-white hover:bg-gray-200 font-semibold transition-transform hover:-translate-y-px hover:shadow-[0_1px_0_black]"
              aria-label="Add transaction"
            >
              <Plus size={18} />
            </button>

            {isTimelineOpen && (
              <div className="absolute top-13 right-14 sm:right-16 bg-white border border-black rounded-xl p-2 flex flex-col gap-1 z-10 min-w-36">
                {timelineOptions.map((timeline) => (
                  <button
                    key={timeline}
                    onClick={() => {
                      setSelectedTimeline(timeline);
                      setIsTimelineOpen(false);
                    }}
                    className={`text-left border border-transparent rounded-lg px-2 py-1 ${selectedTimeline === timeline ? "bg-gray-200" : "bg-white"}`}
                  >
                    {timeline}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Report section (with graphs) */}
        {transactions.length > 0 && (
          <ReportSection
            transactions={timelineTransactions}
            goal={goal}
          />
        )}

        {/* Suggestions section */}
        {transactions.length > 0 && (
          <div className="text-center flex flex-col gap-6">
            <h2 className="text-4xl font-extrabold mr-auto">
              Suggestions
            </h2>
            <div className="flex flex-col w-full">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="mr-auto text-left bg-white border-2 border-black/50 rounded-2xl px-4 py-3 mb-2 w-full"
                >
                  <h3 className="text-lg font-bold">{suggestion.title}</h3>
                  <span className="text-gray-700">{suggestion.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions list (will only show a few) */}
        {transactions.length > 0 && (
          <TransactionsSection 
            transactions={transactions} 
            handleRemoveTransaction={handleRemoveTransaction}
            handleEditTransaction={(transaction) => setEditingTransaction(transaction)}
          />
        )}
      </div>

      {isAddingTransaction && (
        <AddTransactionModal 
          onClose={() => setIsAddingTransaction(false)}
          handleSubmitTransaction={(input: TransactionInput) =>
            handleAddTransaction(input.category, input.amount, input.title, input.description)
          }
        />
      )}

      {editingTransaction && (
        <AddTransactionModal
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          mode="edit"
          handleSubmitTransaction={(input: TransactionInput) => {
            handleEditTransaction(editingTransaction.id, input);
            setEditingTransaction(null);
          }}
        />
      )}

      {isGoalModalOpen && (
        <AddGoalModal
          key={`${goalModalMode}-${goal?.id || "new"}`}
          onClose={() => setIsGoalModalOpen(false)}
          goal={goalModalMode === "edit" ? goal || undefined : undefined}
          mode={goalModalMode}
          handleSubmitGoal={(title: string, mode: GoalMode, targetAmount: string) => {
            if (goalModalMode === "edit" && goal) {
              handleEditGoal(goal.id, title, mode, targetAmount);
              return;
            }

            handleAddGoal(title, mode, targetAmount);
          }}
        />
      )}

      {isLoading && (
        <LoadingModal />
      )}
    </main>
  );
}
