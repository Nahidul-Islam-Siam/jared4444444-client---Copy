"use client";

import { Result, Button } from "antd";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <Result
      className="flex flex-col justify-center items-center min-h-screen"
      status="error"
      title={
        <span className="text-red-600 text-2xl font-bold">
          Payment Cancelled
        </span>
      }
      subTitle={
        <span className="text-gray-600 text-base">
          Your payment was not completed. If this was a mistake, please try
          again or choose a different payment method.
        </span>
      }
      extra={[
        <Link key="retry" href="/membership-plans">
          <Button type="primary">Try Again</Button>
        </Link>,
        <Link key="home" href="/">
          <Button>Back to Home</Button>
        </Link>,
      ]}
    />
  );
}
