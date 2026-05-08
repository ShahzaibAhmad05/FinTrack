"use client";

import { useState } from "react";
import { X } from "lucide-react";

import type { GoalMode, UserGoal } from "@/types";


type AddGoalModalProps = {
  onClose: () => void;
  handleSubmitGoal: (title: string, mode: GoalMode, targetAmount: string) => void;
  goal?: UserGoal | null;
  mode?: "add" | "edit";
};


export default function AddGoalModal({
  onClose,
  handleSubmitGoal,
  goal,
  mode = "add"
}: AddGoalModalProps) {
  const [title, setTitle] = useState(goal?.title || "");
  const [goalMode, setGoalMode] = useState<GoalMode>(goal?.mode || "balanced");
  const [targetAmount, setTargetAmount] = useState(goal?.target_amount.toString() || "");

  const onSubmit = () => {
    handleSubmitGoal(title, goalMode, targetAmount);
    setTitle("");
    setGoalMode("balanced");
    setTargetAmount("");
    onClose();
  };

  return (
    <div className="border border-black fixed inset-0 backdrop-blur-md flex items-center justify-center px-3">
      <div className="flex flex-col w-full max-w-2xl bg-white border border-black rounded-4xl px-5 sm:px-8 py-6">
        <div className="ml-auto">
          <button
            onClick={onClose}
            className="hover:bg-red-500/85 border border-black rounded-full px-3 py-1 font-extrabold transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-5 my-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="goal-title" className="font-semibold">
              Goal title <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              placeholder="enter goal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-blue p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="goal-mode" className="font-semibold">
              Goal mode <span className="text-red-600 font-bold">*</span>
            </label>
            <select
              id="goal-mode"
              value={goalMode}
              onChange={(e) => setGoalMode(e.target.value as GoalMode)}
              className="border border-black p-2"
            >
              <option value="balanced">balanced</option>
              <option value="investing">investing</option>
              <option value="saving">saving</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="goal-target" className="font-semibold">
              Target amount <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              id="goal-target"
              type="text"
              placeholder="enter target amount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="border border-blue p-2"
            />
          </div>
        </div>

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
            {mode === "edit" ? "Save Goal" : "+ Add Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}
