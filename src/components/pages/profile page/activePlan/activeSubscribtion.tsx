/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllSubscriptionPurchasesQuery } from "@/redux/api/subscription/subscriptionApi";
import { selectCurrentUser } from "@/redux/services/user/authSlice";
import { useSelector } from "react-redux";

export default function ActiveSubscribePage() {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?._id;

  const { data: purchaseSubscripotion, isLoading, isError } =
    useGetAllSubscriptionPurchasesQuery();






  // Filter adventures for current user and only 'active' ones
  const subscriptionData = purchaseSubscripotion?.Data?.filter(
    (ad: any) =>
      ad.userId?._id === userId && ad.status === "active"
  ) || [];

  console.log(subscriptionData)

  
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
          <p className="text-red-500">Failed to load your adventure plans.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Active Subscription Plans</h1>
          <p className="text-muted-foreground mt-2">
            Below are your currently active Subscription packs.
          </p>
        </div>

        {/* List of Active Adventure Packs */}
        {subscriptionData.length === 0 ? (
          <div className="bg-white border border-gray-200 p-6 rounded-[15px] shadow-md text-center">
            <p className="text-card-foreground">No active adventure packs found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptionData.map((adventure: any) => {
              const pack = adventure.adventurePackId;
              // const jetSkyModel = adventure.model || pack?.model || "Unknown Model";
              const startDate = new Date(adventure.startDate).toLocaleDateString();
              const expiryDate = new Date(adventure.expiryDate).toLocaleDateString();

              return (
                <div
                  key={adventure._id}
                  className="bg-white border border-white p-6 rounded-[15px] shadow-md"
                >
                  <div className="grid grid-cols-5 gap-6">
                    {/* Adventure Pack Name */}
                    <div className="space-y-2">
                      {/* <h3 className="text-sm font-medium text-muted-foreground">
                        Adventure Pack
                      </h3> */}
                      <p className="font-semibold text-card-foreground">
                        {pack?.title || "Subscription Id"}
                      </p>
                      <p className="text-xs text-gray-500">{adventure._id}</p>
                    </div>

                    {/* Starting Date */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Start Date
                      </h3>
                      <p className="text-sm text-card-foreground">{startDate}</p>
                    </div>

                    {/* Expiry Date */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Expiry Date
                      </h3>
                      <p className="text-sm text-card-foreground">{expiryDate}</p>
                    </div>

                    {/* Rides Completed */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Rides Used
                      </h3>
                      <p className="text-sm font-semibold text-primary">
                        {adventure.purchesCredits - adventure.remainingCredits}
                      </p>
                    </div>

                    {/* Rides Remaining */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Rides Remaining
                      </h3>
                      <p className="text-sm font-semibold text-accent">
                        {adventure.remainingCredits}
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