// types
import type { Transaction } from "@/types";


type TransactionsSectionProps = {
  transactions: Transaction[];
  handleRemoveTransaction: (transaction: Transaction) => void;
}


export default function TransactionsSection(
  { transactions, handleRemoveTransaction }: TransactionsSectionProps
) {
  const categoryBgColorMap: Record<string, string> = {
    income: "bg-green-500",
    transaction: "bg-cyan-500",
    investment: "bg-pink-500",
    expense: "bg-amber-500"
  };

  const categoryTextColorMap: Record<string, string> = {
    income: "text-green-500",
    transaction: "text-cyan-500",
    investment: "text-pink-500",
    expense: "text-amber-500"
  };


  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-extrabold">
        Transactions
      </h2>
      <div className="flex flex-col gap-6 mx-1">
        {transactions.map((transaction) => (
          <div 
            className="flex flex-row bg-white border border-black rounded-2xl px-6 py-2 shadow-[4px_4px_0_black]" 
            key={transaction.id}
          >
            <div className="flex flex-col my-2 w-[30%]">
              <h3 className="text-xl font-bold uppercase">{transaction.title}</h3>
              <div className="my-2">
                <span 
                  className={`${categoryBgColorMap[transaction.category]} px-2 py-0.5 rounded-xl border-2 border-black/40 text-sm font-semibold text-black/80`}
                >
                  {transaction.category}
                </span>
              </div>
              <div className="">
                <span 
                  className={`${categoryTextColorMap[transaction.category]} text-4xl font-bold font-mono`}
                >
                  {transaction.category === "income" ? "+": "-"}
                  {transaction.amount.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="my-2 mx-12">
              <span className="text-gray-700">
                {transaction.description}
              </span>
            </div>
            <div className="flex flex-col gap-2 my-2 ml-auto">
              <button
                onClick={() => handleRemoveTransaction(transaction)}
                className="border rounded-xl border-black py-1.5 px-3 bg-gray-300 hover:bg-gray-200 transition-transform hover:-translate-y-px hover:shadow-[0_1px_0_black] font-semibold"
              >
                edit
              </button>
              <button
                onClick={() => handleRemoveTransaction(transaction)}
                className="border rounded-xl border-black py-1.5 px-3 bg-red-300 hover:bg-red-200 transition-transform hover:-translate-y-px hover:shadow-[0_1px_0_black] font-semibold"
              >
                remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

