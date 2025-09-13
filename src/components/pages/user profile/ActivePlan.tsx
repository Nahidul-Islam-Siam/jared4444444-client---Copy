/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Plan {
  _id: number;
  model: string | undefined;
  expiryDate: any;
  purchesCredits: number | undefined;
  remainingCredits: number | undefined;
  id?: string | number;
  title?: string;
  stripePaymentIntentId?: string;
  adventurePurchaseId?: string;
  subscriptionPurchaseId?: string;
  type?: string;
  startDate?: string | Date | null;
  bookingDate?: string | Date | null;
  endDate?: string | Date | null;
  ridesCompleted?: number;
  ridesLeft?: number;
}



export default function ActivePlan({ allPlan }: { allPlan?: Plan[] }) {
  const columns: ColumnsType = [
    { title: "Plan Type", dataIndex: "planType" },
    { title: "Jetski model", dataIndex: "plan" },
    { title: "Starting Date", dataIndex: "start" },
    { title: "Expire Date", dataIndex: "start" },
  ];

  console.log("all plans for me", allPlan);

const rows = Array.isArray(allPlan)
  ? allPlan.map((s, i) => {
      // Determine planType based on `type` field
    let planType = "Rent"; // default

    if (s.subscriptionPurchaseId) {
      planType = "Membership Plan";
    } else if (s.adventurePurchaseId) {
      planType = "Adventure Pack";
    } else if (s.stripePaymentIntentId) {
      planType = "Rent";
    }


      return {
        key: s._id ?? i,
        planType,
        plan: s.title || s.model || "N/A",
        start: s.bookingDate
          ? new Date(s.bookingDate).toLocaleDateString("en-GB")
          : "--",
        end: s.endDate
          ? new Date(s.endDate).toLocaleDateString("en-GB")
          : s.expiryDate
          ? new Date(s.expiryDate).toLocaleDateString("en-GB")
          : "--",
        done: s.ridesCompleted ?? s.purchesCredits ?? 0,
        left: s.ridesLeft ?? s.remainingCredits ?? 0,
      };
    })
  : [];





  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Booking History</h2>
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="key"
        bordered
        className="[&_th]:!bg-[#00AEEF] [&_th]:!text-white rounded-xl overflow-hidden"
        scroll={{ x: 900 }}
      />
    </section>
  );
}
