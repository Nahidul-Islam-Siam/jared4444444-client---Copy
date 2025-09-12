"use client";

import { Result, Button } from "antd";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <Result
      className="flex flex-col justify-center items-center min-h-screen"
      status="success"
      title={
        <span className="text-green-600 text-2xl font-bold">
          Payment Successful!
        </span>
      }
      subTitle={
        <span className="text-gray-600 text-base">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </span>
      }
      extra={[
        <Link key="home" href="/">
          <Button type="primary">Back to Home</Button>
        </Link>,
      ]}
    />
  );
}
