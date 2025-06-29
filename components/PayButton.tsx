"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";

export default function PaymentButton() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletClient) {
      setStatus("Wallet not connected");
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      setStatus("Enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      setStatus("Processing...");

      const txHash = await walletClient.sendTransaction({
        to: "0x3A301f6ceC11B413cE6AcDF0258Ba265a4A43aa4", // 🔁 Replace with receiver
        value: parseEther(amount),
        account: address,
      });

      setStatus(`Transaction sent: ${txHash}`);
    } catch (error: any) {
      setStatus(`Error: ${error.message || "Transaction failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <h2 className="text-xl">Stake Amount</h2>
      <p className="text-sm ">
        Enter how much ETH You want to stake for this session?
      </p>
      <div>
        <label
          htmlFor="amount"
          className="block font-medium text-sm text-gray-400"
        >
          Amount (ETH)
        </label>
        <div className="flex flex-row gap-4">
        <input
          type="number"
          id="amount"
          step="0.0001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          placeholder="0.01"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-1/4 bg-purple-600 text-white py-1 px-2 rounded hover:bg-purple-700"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        </div>
      </div>

      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </form>
  );
}
