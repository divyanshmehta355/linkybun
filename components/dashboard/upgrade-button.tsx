"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function UpgradeButton({ isPro }: { isPro: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (isPro) {
    return (
      <Button disabled variant="outline" className="w-full">
        Pro Plan Active
      </Button>
    );
  }

  const handleUpgrade = async () => {
    setIsLoading(true);

    try {
      // 1. Create order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
      });
      const orderData = await orderRes.json();
      
      if (!orderData.orderId) {
        throw new Error("Failed to create order");
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: "49900", // Amount is in currency subunits. Default currency is INR.
        currency: "INR",
        name: "LinkyBun Pro",
        description: "One-time upgrade to LinkyBun Pro",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            router.refresh(); // Refresh page to reflect Pro status
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new window.Razorpay(options);
      
      rzp1.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Button 
        onClick={handleUpgrade} 
        disabled={isLoading} 
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition-opacity text-white border-0"
      >
        {isLoading ? "Loading..." : "Upgrade to Pro - ₹499"}
      </Button>
    </>
  );
}
