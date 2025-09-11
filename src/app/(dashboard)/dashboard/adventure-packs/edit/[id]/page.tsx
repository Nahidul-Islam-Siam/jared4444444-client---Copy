/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/adventure-packs/edit/[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { Spin } from 'antd';
import { toast } from 'sonner';
import AdventurePackForm from '@/components/pages/dashboard/AdventurePackForm';
import {
  useGetAdventurePackByIdQuery,
  useUpdateAdventurePackMutation,
  TAdventurePackPayload,
} from '@/redux/api/adventurePack/adventurePackApi';
import { useGetAllJetSkisQuery } from '@/redux/api/jetSki/jetApi';

export default function EditAdventurePack() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  console.log(id, 'Adventure Pack ID');

  /* ---------- RTK Query hooks ---------- */
  const {
    data: packData,
    isLoading: packLoading,
    error: packError,
  } = useGetAdventurePackByIdQuery(id);

  const {
    data: jetData,
    isLoading: jetLoading,
    error: jetError,
  } = useGetAllJetSkisQuery({ page: 1, limit: 100 });

  const [updatePack, { isLoading: saving }] = useUpdateAdventurePackMutation();

  // Extract jet skis list
  const jetSkis = jetData?.Data ?? [];

  // Extract the actual adventure pack object from Data
  const pack = packData?.data; // ← Critical fix: was using packData directly

  /* ---------- Build initial values ---------- */
  const initialValues = pack
    ? {
        // Handle both string and object reference for jet_skyId
        jetSkiId:
          typeof pack.jet_skyId === 'string'
            ? pack.jet_skyId
            : pack.jet_skyId?._id,

        title: pack.title || '',
        discountPercentage: pack.discountPercentage ?? undefined,
        ridesPricing3: pack.ridesPricing3 ?? undefined,
        ridesPricing5: pack.ridesPricing5 ?? undefined,
        ridesPricing10: pack.ridesPricing10 ?? undefined, // Fixed key: was incorrectly named "ridesPricing8"
        refundAmount: pack.refundAmount ?? undefined,
      }
    : undefined;

  /* ---------- Submit handler ---------- */
  const handleSubmit = async (values: TAdventurePackPayload) => {
    try {
      await updatePack({ id, body: values }).unwrap();
      toast.success('Adventure pack updated successfully');
      router.push('/dashboard/adventure-packs');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update adventure pack');
    }
  };

  /* ---------- Loading state ---------- */
  if (packLoading || jetLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
        <span className="ml-4 text-gray-600">Loading adventure pack...</span>
      </div>
    );
  }

  /* ---------- Error handling ---------- */
  if (packError) {
    toast.error('Failed to load adventure pack');
    router.push('/dashboard/adventure-packs');
    return null;
  }

  if (jetError) {
    toast.error('Failed to load jet skis');
    return <p className="text-red-500">Error loading jet skis. Please try again later.</p>;
  }

  /* ---------- Render form ---------- */
  return (
<AdventurePackForm
  jetSkis={jetSkis}
  initial={initialValues}
  loading={saving}
  onSubmit={handleSubmit}
  onCancel={() => router.push('/dashboard/adventure-packs')}
/>
  );
}