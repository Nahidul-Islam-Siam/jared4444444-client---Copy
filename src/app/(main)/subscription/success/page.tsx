"use client";

import { Result, Button } from "antd";
import Link from "next/link";

export default function SubscriptionSuccessPage() {
  return (
    <Result
      className="flex flex-col justify-center items-center min-h-screen"
      status="success"
      title={
        <span className="text-green-600 text-2xl font-bold">
          Subscription Activated!
        </span>
      }
      subTitle={
        <span className="text-gray-600 text-base">
          Your subscription has been successfully activated. You can now enjoy
          all premium features.
        </span>
      }
      extra={[
        <Link key="dashboard" href="/profile">
          <Button type="primary">Go to Dashboard</Button>
        </Link>,
        <Link key="home" href="/">
          <Button>Back to Home</Button>
        </Link>,
      ]}
    />
  );
}
