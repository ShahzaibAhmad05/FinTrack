"use client";

// react stuff
import { useState } from "react";

// hooks
import { useTransactions } from "@/hooks/transactions";

// components
import AddTransactionModal from "@/components/addTransactionModal";
import ReportSection from "@/components/reportSection";
import TransactionsSection from "@/components/transactionsSection";
import LoadingModal from "@/components/loadingModal";


export default function Home() {
  // hooks
  const { 
    handleAddTransaction, handleRemoveTransaction, 
    transactions, isLoading 
  } = useTransactions();

  // control vars
  const [isAddingTransaction, setIsAddingTransaction] = useState<boolean>(false);


  return (
    <main className="min-h-screen bg-gray-50">
      <div className="px-12 flex flex-col gap-10 py-12">
        {/* top header */}
        <div className="flex flex-row">
          <h2 className="text-6xl font-extrabold [text-shadow:1px_1px_1px_rgb(0_0_0/0.5)]">
            Finance Tracker
          </h2>

          {/* Functional buttons */}
          <div className="flex flex-row gap-4 ml-auto my-auto mr-5">
            <button
              onClick={() => setIsAddingTransaction(true)}
              className="border-2 rounded-full border-black py-2.5 px-4.5 mr-auto bg-white hover:bg-gray-200 font-semibold transition-transform"
            >
              +
            </button>
          </div>
        </div>

        {/* Report section (with graphs) */}
        {transactions.length > 0 && (
          <ReportSection transactions={transactions} />
        )}

        {/* Suggestions section */}
        {transactions.length > 0 && (
          <div className="text-center flex flex-col gap-8">
            <h2 className="text-4xl font-extrabold mr-auto">
              Suggestions
            </h2>
            <div className="flex flex-col w-full">
              <span className="ml-3 mr-auto text-lg">
                No suggestions yet.
              </span>
            </div>
          </div>
        )}

        {/* Transactions list (will only show a few) */}
        {transactions.length > 0 && (
          <TransactionsSection 
            transactions={transactions} 
            handleRemoveTransaction={handleRemoveTransaction} 
          />
        )}
      </div>

      {isAddingTransaction && (
        <AddTransactionModal 
          onClose={() => setIsAddingTransaction(false)}
          handleAddTransaction={handleAddTransaction}
        />
      )}

      {isLoading && (
        <LoadingModal />
      )}
    </main>
  );
}
