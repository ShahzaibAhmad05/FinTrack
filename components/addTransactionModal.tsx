"use client";

// react stuff
import { useState } from "react";
import { X } from "lucide-react";

// types
import type { Transaction, TransactionInput } from "@/types";


type AddTransactionModalProps = {
  onClose: () => void;
  handleSubmitTransaction: (transaction: TransactionInput) => void;
  transaction?: Transaction;
  mode?: "add" | "edit";
}


export default function AddTransactionModal(
  { onClose, handleSubmitTransaction, transaction, mode = "add" }: AddTransactionModalProps
) {
  // control vars
  const [category, setCategory] = useState<string>(transaction?.category || "auto-select");
  const [amount, setAmount] = useState<string>(transaction?.amount.toString() || "");
  const [title, setTitle] = useState<string>(transaction?.title || "");
  const [description, setDescription] = useState<string>(transaction?.description || "");


  // utils
  const onSubmit = () => {
    handleSubmitTransaction({ category, amount, title, description });
    setCategory("auto-select");
    setAmount("");
    setTitle("");
    setDescription("");
    onClose();
  };


  return (
    <div className="border border-black fixed inset-0 backdrop-blur-md flex items-center justify-center px-3">
      {/* Container */}
      <div className="flex flex-col w-full max-w-2xl bg-white border border-black rounded-4xl px-5 sm:px-8 py-6">
        {/* top buttons */}
        <div className="ml-auto">
          <button 
            onClick={onClose}
            className="hover:bg-red-500/85 border border-black rounded-full px-3 py-1 font-extrabold transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* input area */}
        <div className="flex flex-col gap-5 my-2">
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="transaction-amount"
              className="font-semibold"
            >
              How much?{' '}
              <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              id="transaction-amount"
              type="text"
              placeholder="enter the amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-blue p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="transaction-category"
              className="font-semibold"
            >
              Select Category (optional)
            </label>
            <select
              id="transaction-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-black p-2"
            >
            <option value="auto-select">auto-select</option>
            <option value="income">income</option>
            <option value="transaction">transaction</option>
            <option value="expense">expense</option>
            <option value="investment">investment</option>
            <option value="saving">saving</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="transaction-title"
              className="font-semibold"
            >
              What did you do?{' '}
              <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              id="transaction-title"
              type="text"
              placeholder="enter a short title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-blue p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="transaction-notes"
              className="font-semibold"
            >
              Full Description{' '}
              <span className="text-red-600 font-bold">*</span>
            </label>
            <textarea
              id="transaction-notes"
              placeholder="enter the details here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-blue p-2"
            />
          </div>
        </div>

        {/* buttons area */}
        <div className="flex flex-row gap-3 ml-auto mt-3 flex-wrap justify-end">
          <button 
            onClick={onClose}
            className="border rounded-2xl border-black py-1.5 px-6 bg-red-500 hover:bg-red-200 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button 
            onClick={onSubmit}
            className="border rounded-2xl border-black py-1.5 px-6 bg-blue-500 hover:bg-blue-200 transition-colors font-semibold"
          >
            {mode === "edit" ? "Save" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

