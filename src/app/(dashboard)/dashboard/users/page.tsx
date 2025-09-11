/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Dropdown,
  Button,
  Avatar,
  Pagination,
  Space,
  Tag,
  Alert,
  Modal,
} from "antd";
import {
  DownOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { TUser } from "@/type/type";
import { useRouter } from "next/navigation";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/redux/api/user/userAPi";
import { toast } from "sonner";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const router = useRouter();
  const limit = 10;

  // Modal states for delete confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Fetch users from API
  const {
    data: userDataResponse,
    isLoading,
    isError,
    error,
  } = useGetAllUsersQuery({
    page,
    limit,
    searchTerm: search || undefined,
  });

  const [deleteUser] = useDeleteUserMutation();

  // Extract user data and total count
  const userData = userDataResponse?.Data as TUser[] | undefined;
  const total = userDataResponse?.meta?.total ?? userData?.length ?? 0;

  // Normalize data for table display
  const items = (userData || [])
    .filter((u) => (filter ? u.role === filter : true))
    .map((u) => ({
      id: u._id,
      name: u.name || "N/A",
      email: u.email || "N/A",
      phone: u.phone || "N/A",
      country: u.country || "N/A",
      avatar: u.images?.[0] || null,
      role: u.role,
    }));

  // Open modal and set user to delete
  const handleDelete = (id: string, name: string) => {
    setDeletingUser({ id, name });
    setIsModalOpen(true);
  };

  // Confirm deletion (replace console.log with actual API call)
  const confirmDelete = async () => {
    if (!deletingUser) return;



    try {
      const response = await deleteUser(deletingUser.id).unwrap(); // call delete mutation
      if (response?.success) {
        toast.success(response?.message || "User deleted successfully!"); // success toast
      } else {
        toast.error(response?.message || "Failed to delete user"); // error toast
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user"); // error toast
    }

    setIsModalOpen(false);
    setDeletingUser(null);

    // 💡 Tip: Add refetch or tag invalidation in RTK to update list automatically
  };

  // Cancel deletion
  const cancelDelete = () => {
    setIsModalOpen(false);
    setDeletingUser(null);
  };

  // Table columns definition
  const columns: ColumnsType<(typeof items)[number]> = [
    {
      title: "User Profile",
      dataIndex: "name",
      render: (_, record) => (
        <Space>
          <Avatar size={32} src={record.avatar}>
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <span>{record.name}</span>
        </Space>
      ),
    },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Country", dataIndex: "country" },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => (
        <Tag color={role.includes("Admin") ? "red" : "geekblue"}>
          {role.includes("Admin") ? "Administrator" : "User"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* View User */}
          <EyeOutlined
            className="cursor-pointer text-blue-500"
            onClick={() => router.push(`/dashboard/users/${record.id}`)}
            aria-label={`View details of ${record.name}`}
          />
          {/* Delete User */}
          <DeleteOutlined
            className="cursor-pointer text-red-500"
            onClick={() => handleDelete(record.id, record.name)}
            aria-label={`Delete user ${record.name}`}
          />
        </Space>
      ),
    },
  ];

  // Filter dropdown menu items
  const filterMenuItems = [
    { key: "All", label: "All Users" },
    { key: "User", label: "Customers" },
    { key: "Admin", label: "Administrators" },
  ];

  return (
    <div className="py-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-[#00AEEF] mb-6">All Users</h1>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name or email..."
          allowClear
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on new search
          }}
          className="md:w-64"
        />
        <Dropdown
          menu={{
            items: filterMenuItems,
            onClick: (e) => {
              setFilter(e.key === "All" ? null : e.key);
              setPage(1); // Reset to first page when filter changes
            },
            selectedKeys: [filter ?? "All"],
          }}
          trigger={["click"]}
        >
          <Button className="ml-auto md:ml-0">
            Filter Role <DownOutlined className="ml-1" />
          </Button>
        </Dropdown>
      </div>

      {/* Error Alert */}
      {isError && (
        <Alert
          type="error"
          message="Failed to load users"
          description={
            (error as any)?.statusText ||
            (error as any)?.message ||
            "Unknown error occurred."
          }
          showIcon
          className="mb-4"
        />
      )}

      {/* Data Table */}
      <Table
        columns={columns}
        dataSource={items}
        loading={isLoading}
        pagination={false}
        rowKey="id"
        size="middle"
        scroll={{ x: 800 }}
        className="[&_th]:!bg-[#00AEEF] [&_th]:!text-white"
      />

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination
          current={page}
          pageSize={limit}
          total={total}
          onChange={(newPage) => setPage(newPage)}
          showSizeChanger={false}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} users`
          }
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isModalOpen}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Yes, Delete"
        okType="danger"
        cancelText="Cancel"
        width={520}
      >
        <p>
          Are you sure you want to delete user{" "}
          <strong>{deletingUser?.name}</strong>?
        </p>
        <p className="text-red-500 mt-2">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
