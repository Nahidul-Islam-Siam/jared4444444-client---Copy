
"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import UserCard from "@/components/cards/UserCard";
import ActivePlan from "@/components/pages/user profile/ActivePlan";
import { Container } from "@/components/shared/Container/Container";
import { Button, Card, Form, Input, Typography, Spin, Alert } from "antd";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks/hooks";
import {
  useGetUserByIdQuery,
  useChangePasswordMutation,
} from "@/redux/api/auth/authApi";
import { useGetBookingByIdQuery } from "@/redux/api/bookings/bookings";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/services/user/authSlice";

const { Title } = Typography;

// JWT Payload interface
interface JWTPayload {
  id: string;
  userEmail: string;
  role: "User" | "Administrator" | "Admin";
  iat: number;
  exp: number;
}

export default function ProfileSection() {
  const [passwordForm] = Form.useForm();
  const [userId, setUserId] = useState<string | null>(null);

  // Get token from Redux state or fallback to cookies
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  // Fetch user data by ID - only run when userId is available
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  // ✅ Add change password mutation hook
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const user = useSelector(selectCurrentUser);

  const bookingId = user?._id as string;
  console.log(bookingId, "all the data is here");

  const { data } = useGetBookingByIdQuery(bookingId);

  

  const allPlan = [
    ...(data?.Data?.booking || []),
    ...(data?.Data?.subscription || []),
    ...(data?.Data?.adventure || []),
  ];

  console.log(allPlan, "all the data is here");

  useEffect(() => {
    const getUserIdFromToken = () => {
      try {
        // Try to get token from Redux first, then fallback to cookies
        let token = accessToken;

        if (!token) {
          token = Cookies.get("access-token") || null;
        }

        if (token) {
          // Decode the JWT token
          const decoded = jwtDecode<JWTPayload>(token);
          console.log("Decoded token:", decoded);

          // Extract user ID from the decoded token
          setUserId(decoded.id);
        } else {
          console.warn("No access token found");
          toast.error("Please login to view your profile");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Invalid token. Please login again.");
      }
    };

    getUserIdFromToken();
  }, [accessToken]);

  interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  // ✅ Updated handlePasswordFormSubmit with API integration
  const handlePasswordFormSubmit = async (values: PasswordFormValues) => {
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    try {
      const response = await changePassword({
        userId,
        passwordData: {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
      }).unwrap();

      if (response.success) {
        toast.success("Password updated successfully!");
        passwordForm.resetFields();
      } else {
        toast.error(response.message || "Failed to update password");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Change password error:", error);

      // Handle different error scenarios
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.status === 400) {
        toast.error("Invalid current password or new password format");
      } else if (error?.status === 401) {
        toast.error("Current password is incorrect");
      } else if (error?.status === 404) {
        toast.error("User not found");
      } else if (error?.status === 500) {
        toast.error("Server error. Please try again later");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    }
  };

  // Loading state while fetching user data
  if (userLoading) {
    return (
      <section className="bg-white">
        <Container className="!space-y-12">
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </Container>
      </section>
    );
  }

  // Error state when user fetch fails
  if (userError) {
    return (
      <section className="bg-white">
        <Container className="!space-y-12">
          <Alert
            message="Error Loading Profile"
            description="Unable to load user profile data. Please try again."
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => refetchUser()}>
                Retry
              </Button>
            }
          />
        </Container>
      </section>
    );
  }

  // Extract user data from API response
  const currentUser = userData?.Data;

  const images = currentUser?.images?.[0];

  console.log(images, "all fake users");

  return (
    <section className="bg-white">
      <Container className="!space-y-12">
        {/* User Card - Pass userId and fetched user data */}
        <UserCard
          userId={userId}
          name={currentUser?.name || ""}
          firstName={currentUser?.firstName || ""}
          lastName={currentUser?.lastName || ""}
          avatar={images || "/images/user-avatar.jpg"}
          phone={currentUser?.phone || ""}
          email={currentUser?.email || ""}
          country={currentUser?.country || ""}
          editable={true}
        />

        {/* Change Password Form */}
        <Card className="shadow-sm">
          <Title level={5} className="!text-gray-700 !mb-6 !text-xl">
            Change Password
          </Title>

          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordFormSubmit}
            requiredMark={false}
          >
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  Current Password
                </span>
              }
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter Current Password"
                className="!py-3 !px-4 !border-gray-300 !rounded-lg"
                disabled={isChangingPassword}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">New Password</span>
              }
              name="newPassword"
              rules={[
                { required: true, message: "Please enter your new password" },
                { min: 8, message: "Password must be at least 8 characters" },
                {
                  pattern:
                    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d).{8,}$/,
                  message:
                    "Password must contain at least one uppercase letter, one number, and one special character",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter New Password"
                className="!py-3 !px-4 !border-gray-300 !rounded-lg"
                disabled={isChangingPassword}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  Confirm New Password
                </span>
              }
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm New Password"
                className="!py-3 !px-4 !border-gray-300 !rounded-lg"
                disabled={isChangingPassword}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isChangingPassword}
                disabled={isChangingPassword}
                className="!bg-[#0EA5E9] !border-none hover:!bg-[#0EA5E9]/80 !h-12 !px-8 !rounded-lg !font-medium"
              >
                {isChangingPassword
                  ? "Updating Password..."
                  : "Update Password"}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Active Plan Section - Using static data as requested */}
        <ActivePlan allPlan={allPlan} />
      </Container>
    </section>
  );
}
