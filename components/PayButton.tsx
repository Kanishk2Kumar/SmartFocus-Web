"use client";

import React from "react";
import { usePay, useAvailableExchanges } from "@reown/appkit-pay/react";
import { baseSepoliaETH } from "@reown/appkit-pay";
import { Button } from "@/components/ui/button";

interface PayButtonProps {
  amount: number; // amount in ETH
  recipient: string;
  onSuccess?: () => void;
}

export const PayButton: React.FC<PayButtonProps> = ({
  amount,
  recipient,
  onSuccess,
}) => {
  const { open, isPending, isSuccess } = usePay({ onSuccess });

  const { data: exchanges, isLoading } = useAvailableExchanges({
    network: "eip155:11155111", // Sepolia CAIP namespace
    asset: "native",
    amount: amount.toString(),
  });

  const disabled = isPending || isLoading || !exchanges?.length;

  return (
    <Button
      onClick={() =>
        open({
          recipient,
          amount,
          paymentAsset: baseSepoliaETH,
        })
      }
    >
      {isPending
        ? "Processing..."
        : !exchanges?.length
        ? "No payment options"
        : isSuccess
        ? "Paid!"
        : `Pay ${amount} Sepolia ETH`}
    </Button>
  );
};
