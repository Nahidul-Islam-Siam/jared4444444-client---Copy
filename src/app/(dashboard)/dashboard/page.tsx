"use client";

import { useGetAnalyticsQuery } from "@/redux/api/analytics/analyticsApi";
import Image from "next/image";

export default function Dashboard() {
  const { data, isLoading, isError } = useGetAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (isError || !data?.Data?.[0]) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-600">Failed to load analytics data.</p>
      </div>
    );
  }

  // Extract real analytics data
  const analytics = data.Data[0];

  // Format currency
  const formatUSD = (amount: number) => `$${amount.toLocaleString()}`;

  // Clean image URL helper
  const getAvatarSrc = (images: string[] | undefined): string | null => {
    if (!images || images.length === 0) return null;
    const url = images[0]?.trim(); // Trim whitespace (important!)
    return url && url.startsWith("http") ? url : null;
  };

  // Metrics Cards - Use Real Data
  const metrics = [
    {
      title: "Subscription Revenue",
      value: formatUSD(analytics.totalAmountInSubscriptionUSD),
      subtitle: `${analytics.totalSubscriptionPurchase} purchases`,
    },
    {
      title: "Total Rents",
      value: formatUSD(analytics.totalAmountInBookingUSD),
      subtitle: `${analytics.totalBooking} bookings`,
    },
    {
      title: "Adventure Packs Sold",
      value: analytics.totalAdventuresPurchase.toString(),
      subtitle: formatUSD(analytics.totalAmountInAdVenturePackUSD),
    },
    {
      title: "New Members",
      value: analytics.registeredUsersCount.toString(),
      subtitle: "Total registered users",
    },
  ];

  // Jet Ski Rents - Use modelData
  const jetSkiRants = analytics.modelData.map((model) => ({
    name: model.model,
    value: model.price,
    progress: Math.min(100, Math.round((model.price / 12000) * 100)), // Normalize to max 12k
  }));

  // Recent Activity - Last 4 users by createdAt
  const recentUsers = [...analytics.registeredUsers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map((user) => {
      const avatarUrl = getAvatarSrc(user.images);
      const action =
        user.adventurePurchaseId.length > 0
          ? "purchased an adventure pack"
          : user.subscriptionPurchaseId.length > 0
          ? "subscribed"
          : "joined";

      return {
        user: user.name || user.firstName || "Unknown",
        action,
        item: action.includes("adventure") ? "Adventure Pack" : action.includes("subscribe") ? "Subscription" : "—",
        time: formatRelativeTime(new Date(user.createdAt)),
        avatar: avatarUrl || "", // Will fall back to initials
      };
    });

  // Helper: Relative time (e.g., "2 min ago")
  function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard Overview</h1>
      </header>

      <main className=" mx-auto p-6 space-y-6">
        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-sm text-gray-500 font-medium mb-1">{metric.title}</div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-xs text-gray-400 mt-1">{metric.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Total Rents Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Top Jet Ski Models Rented</h2>
              <span className="text-2xl font-bold text-blue-600">{formatUSD(analytics.totalAmountInBookingUSD)}</span>
            </div>

            <div className="space-y-4">
              {jetSkiRants.length > 0 ? (
                jetSkiRants.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <span className="text-sm text-gray-500">{formatUSD(item.value)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No rental data available.</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <ul className="space-y-4">
              {recentUsers.map((activity, index) => (
                <li key={index} className="flex items-center space-x-3 group">
                  {/* Safe Avatar Rendering */}
                  {activity.avatar ? (
                    <Image
                      src={activity.avatar}
                      alt={activity.user}
                      width={36}
                      height={36}
                      className="rounded-full w-9 h-9 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {activity.user.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      <span>{activity.user}</span> {activity.action}{" "}
                      {activity.item !== "—" && (
                        <span className="font-normal text-gray-600">| {activity.item}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}