/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllSubscriptionPurchasesQuery } from "@/redux/api/subscription/subscriptionApi";

interface ActiveSubscribePageProps {
  userId: string;
}

export default function ActiveSubscribePage({
  userId,
}: ActiveSubscribePageProps) {
  const {
    data: purchaseSubscripotion,
    isLoading,
    isError,
  } = useGetAllSubscriptionPurchasesQuery();

  const subscriptionData =
    purchaseSubscripotion?.Data?.filter(
      (sub: any) => sub.userId?._id === userId && sub.status === "active"
    ) || [];

  console.log("all the subscription", subscriptionData);

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold">Active Plan</h1>
          <p>Loading your plans...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold">Active Plan</h1>
          <p className="text-red-500">Failed to load your sub plans.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Active Membership Plans
          </h1>
          <p className="text-muted-foreground mt-2">
            Below are your currently active Membership packs.
          </p>
        </div>

        {/* List of Active sub Packs */}
        {subscriptionData.length === 0 ? (
          <div className="bg-white border border-gray-200 p-6 rounded-[15px] shadow-md text-center">
            <p className="text-card-foreground">No active sub packs found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptionData.map((sub: any) => {
              // const jetSkyModel = sub?.model || pack?.model || "Unknown Model";
              const startDate = new Date(sub?.startDate).toLocaleDateString();
              const expiryDate = new Date(sub?.expiryDate).toLocaleDateString();

              return (
                <div
                  key={sub?._id}
                  className="bg-white border border-white p-6 rounded-[15px] shadow-md"
                >
                  <div className="grid grid-cols-5 gap-6">
                    {/* sub Pack Name */}
                    <div className="space-y-2">
                      {/* <h3 className="text-sm font-medium text-muted-foreground">
                        sub Pack
                      </h3> */}
                      <p className="font-semibold text-card-foreground">
                        Membership Name
                      </p>
                      <p className="text-xs text-gray-500">
                        {sub?.membershipId?.description}
                      </p>
                    </div>

                    {/* Starting Date */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Start Date
                      </h3>
                      <p className="text-sm text-card-foreground">
                        {startDate}
                      </p>
                    </div>

                    {/* Expiry Date */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Expiry Date
                      </h3>
                      <p className="text-sm text-card-foreground">
                        {expiryDate}
                      </p>
                    </div>

                    {/* Rides Completed */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Rides Used
                      </h3>
                      <p className="text-sm font-semibold text-primary">
                        {sub?.purchesCredits - sub?.remainingCredits}
                      </p>
                    </div>

                    {/* Rides Remaining */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Rides Remaining
                      </h3>
                      <p className="text-sm font-semibold text-accent">
                        {sub?.remainingCredits}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
