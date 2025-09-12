/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { Modal, Button, Result, Spin, Alert } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useGetRentByIdQuery } from "@/redux/api/rent/rentApi";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useGetAllAvailableDatesQuery } from "@/redux/api/availableDate/availableDateApi";
import { useBookWithSubscriptionMutation } from "@/redux/api/bookings/bookApi";


interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  rentId: string; // This is jetSkyId
  jetName?: string;
  jetHp?: number;
  jetPrice?: number;
  model?: string;
  subscriptionPurchaseId: string; // Pass this from user's active subscription
}

export default function BookingModal({
  open,
  onClose,
  rentId,
  jetName,
  jetHp,
  jetPrice,
  model,
  subscriptionPurchaseId, // Comes from user's active subscription
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState("08:00 AM");
  const [drivingLicense, setDrivingLicense] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {  data:rentData, isLoading: rentLoading } = useGetRentByIdQuery(rentId);
  const rent = rentData?.Data?.[0];

  const { data: jetData, isLoading: availabilityLoading } = useGetAllAvailableDatesQuery(
    { model: model || "" },
    { skip: !open || !model }
  );

  const user = useSelector((state: any) => state.auth.user);
  const isLoggedIn = !!user;
  const userId = user?._id;

  // Use subscription-based booking mutation
  const [bookWithSubscription] = useBookWithSubscriptionMutation();

  // Extract available/booked dates
  const apiAvailableDates = useMemo(() => {
    return new Set(jetData?.Data?.availableDates || []);
  }, [jetData]);

  const bookedDates = useMemo(() => {
    return new Set(jetData?.Data?.bookedDates || []);
  }, [jetData]);

  // Calendar setup
  const [currentViewMonth, setCurrentViewMonth] = useState(dayjs());
  const startOfMonth = currentViewMonth.startOf("month");
  const endOfMonth = currentViewMonth.endOf("month");
  const totalDays = endOfMonth.date();
  const firstDayIndex = startOfMonth.day();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) days.push(null);
    for (let day = 1; day <= totalDays; day++) {
      const date = startOfMonth.add(day - 1, "day");
      const formatted = date.format("YYYY-MM-DD");
      const isAvailable = apiAvailableDates.has(formatted) && !bookedDates.has(formatted);
      days.push({ day, dateStr: formatted, available: isAvailable, booked: bookedDates.has(formatted) });
    }
    return days;
  }, [startOfMonth, totalDays, firstDayIndex, apiAvailableDates, bookedDates]);

  // Time slots
  const timeSlots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  // ✅ Handle Confirm Booking via Subscription
  const handleConfirm = async () => {
    if (!isLoggedIn) return alert("Please log in.");
    if (!selectedDate) return alert("Please select a date.");
    if (!subscriptionPurchaseId)
      return alert("No active subscription found. Please purchase a package.");

    setError(null);
    setSubmitting(true);

    const payload = {
      userId,
      jetSkyId: rentId,
      subscriptionPurchaseId,
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      drivingLicense: drivingLicense.trim() || undefined,
    };

    try {
      const response = await bookWithSubscription(payload).unwrap();
      console.log("Booking successful:", response.bookingDone);
      setConfirmed(true);
    } catch (err: any) {
      const message =
        err.data?.message ||
        err.response?.data?.message ||
        "Failed to book using subscription.";
      setError(message);
      console.error("Booking failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (rentLoading || availabilityLoading) {
    return (
      <Modal open={open} footer={null} onCancel={onClose} centered>
        <div className="flex justify-center p-8">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  if (!rent || !jetData) {
    return (
      <Modal open={open} footer={null} onCancel={onClose}>
        <div className="p-8 text-center text-red-600">Failed to load jet or availability.</div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      className="!rounded-2xl"
      title={
        <div className="flex items-center gap-3 text-2xl font-bold">
          {confirmed ? (
            <>
              <span className="text-green-500">🎉</span> Booking Confirmed!
            </>
          ) : (
            "Select Date & Time"
          )}
        </div>
      }
    >
      {!isLoggedIn ? (
        <div className="text-center py-10">
          <h3 className="text-lg text-red-600 mb-4">🔒 Login Required</h3>
          <p className="text-gray-600 mb-6">Please log in to make a reservation.</p>
          <Link href="/login" passHref>
            <Button type="primary" size="large">
              Go to Login
            </Button>
          </Link>
        </div>
      ) : confirmed ? (
        <Result
          status="success"
          title="✅ Booking Successful!"
          subTitle={`Your ride is confirmed for ${dayjs(selectedDate).format("MMMM DD, YYYY")} at ${selectedTime}.`}
          extra={
            <Button type="primary" onClick={onClose} className="bg-blue-600">
              Done
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Jet Info */}
          <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-4 rounded-xl text-center font-semibold shadow-md">
            <p>JetSki: {jetName || rent.jetName}</p>
            <p>Horsepower: {jetHp || rent.jetHp} HP • Price: Free (via Subscription)</p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500 border-2 border-white rounded-full"></div>
              <span className="text-gray-700">Selected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 📅 Calendar */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentViewMonth(prev => prev.subtract(1, "month"))} className="p-2 hover:bg-gray-100 rounded-full">
                  <ChevronLeft className="w-5 h-5 text-cyan-500" />
                </button>
                <h3 className="text-lg font-medium text-gray-900">{currentViewMonth.format("MMMM YYYY")}</h3>
                <button onClick={() => setCurrentViewMonth(prev => prev.add(1, "month"))} className="p-2 hover:bg-gray-100 rounded-full">
                  <ChevronRight className="w-5 h-5 text-cyan-500" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="h-10 flex items-center justify-center text-xs text-gray-500">{day}</div>
                ))}
                {calendarDays.map((d, idx) =>
                  d ? (
                    <button
                      key={idx}
                      disabled={!d.available}
                      onClick={() => d.available && setSelectedDate(d.dateStr)}
                      className={`
                        h-10 w-10 flex items-center justify-center text-sm rounded-full
                        ${selectedDate === d.dateStr ? "bg-cyan-500 text-white" :
                          d.booked ? "text-red-400 line-through" :
                          d.available ? "text-gray-900 hover:bg-gray-100" : "text-gray-300"}
                      `}
                    >
                      {d.day}
                    </button>
                  ) : <div key={idx} className="h-10" />
                )}
              </div>
            </div>

            {/* Time & License */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Select Time</h3>
                {selectedDate ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          w-full py-2 px-4 text-left rounded-lg border capitalize
                          ${selectedTime === time
                            ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                            : "border-gray-200 hover:border-cyan-300"
                          }
                        `}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Select a date to choose time.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Driving License (Optional)
                </label>
                <textarea
                  value={drivingLicense}
                  onChange={(e) => setDrivingLicense(e.target.value)}
                  placeholder="License number or ID"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-cyan-200"
                />
              </div>
            </div>
          </div>

          {error && <Alert type="error" message="Error" description={error} showIcon closable onClose={() => setError(null)} />}

          {selectedDate && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
              <p className="text-gray-700 mb-4">
                Confirm booking on <strong>{dayjs(selectedDate).format("MMMM DD")}</strong> at <strong>{selectedTime}</strong>
              </p>
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-3 rounded-full hover:from-cyan-600 hover:to-blue-700"
                onClick={handleConfirm}
                loading={submitting}
                disabled={submitting}
              >
                Confirm with Subscription
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </Modal>
  );
}