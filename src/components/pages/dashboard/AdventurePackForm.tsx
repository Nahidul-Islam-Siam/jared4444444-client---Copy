// components/pages/dashboard/AdventurePackForm.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
} from 'antd';
import { TJetSki } from '@/type/type';
import { TAdventurePackPayload } from '@/redux/api/adventurePack/adventurePackApi';
import { useCreatePackageMutation } from '@/redux/api/createPakage/createpackageApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

interface Props {
  jetSkis: TJetSki[];
  initial?: TAdventurePackPayload & { jetSkiId?: string };
  loading?: boolean;
  onSubmit: (v: TAdventurePackPayload) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function AdventurePackForm({
  jetSkis,
  initial,
  loading = false,
  onSubmit,
  onCancel,
  isEdit = false,
}: Props) {
  const [form] = Form.useForm();
  const [selectedJetSki, setSelectedJetSki] = useState<TJetSki | null>(null);

  const userId = useSelector((state: RootState) => state.auth.user?._id);

  console.log(userId, "user id");
  
const [createPackage] = useCreatePackageMutation()


  /* ---- init: set selected jet ski if editing ---- */
  useEffect(() => {
    if (initial?.jetSkiId) {
      const found = jetSkis.find((j) => j._id === initial.jetSkiId);
      setSelectedJetSki(found || null);
    }
    if (initial) {
      form.setFieldsValue(initial);
    }
  }, [initial, jetSkis, form]);

  /* ---- jet ski selection ---- */
  const handleJetSkiSelect = (id: string) => {
    const jet = jetSkis.find((js) => js._id === id) || null;
    setSelectedJetSki(jet);
    form.setFieldValue('jetSkiId', id);
  };

  const getBrandFromModel = (name: string) => {
    if (name.includes('Sea-Doo')) return 'SEADOO';
    if (name.includes('Yamaha')) return 'YAMAHA';
    if (name.includes('Kawasaki')) return 'KAWASAKI';
    return 'SEADOO';
  };

  /* ---- submit: include jet_skyId ---- */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      jet_skyId: values.jetSkiId, // map to API field name
    });
  };

  return (
    <div className="py-6">
      <h2 className="text-[#00AEEF] text-xl font-bold mb-8">
        {isEdit ? 'Edit Adventure Pack' : 'Create Adventure Pack'}
      </h2>

      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false} className="!space-y-6">
        {/* Hidden Field */}
        <Form.Item name="jetSkiId" style={{ display: 'none' }}>
          <Input />
        </Form.Item>

        {/* Jet-Ski Selection */}
        <Form.Item
          label={
            <span className="text-sm font-medium text-gray-700">
              Select Jet Ski Model
            </span>
          }
          extra="Pricing and discounts apply only to the selected jet ski."
          rules={[{ required: true, message: 'Please select a jet ski model' }]}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {jetSkis.map((js) => (
              <Button
                key={js._id}
                onClick={() => handleJetSkiSelect(js._id)}
                className={`h-12 rounded-lg font-medium ${
                  selectedJetSki?._id === js._id
                    ? '!bg-cyan-500 !text-white !border-cyan-500'
                    : '!bg-white !text-gray-700 !border-gray-300 hover:!border-cyan-400'
                }`}
              >
                {getBrandFromModel(js.name)} {js.model}
              </Button>
            ))}
          </div>
        </Form.Item>

        {/* Selected Specs */}
        {selectedJetSki && (
          <Card size="small" className="mb-6 bg-blue-50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Model:</strong> {selectedJetSki.model}
              </div>
              <div>
                <strong>Power:</strong> {selectedJetSki.hp} HP
              </div>
            </div>
          </Card>
        )}

        {/* Form Fields */}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Enter title' }]}
            >
              <Input placeholder="e.g., Ultimate Ride Bundle" className="h-12 rounded-lg" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Discount (%)"
              name="discountPercentage"
              rules={[{ required: true, message: 'Enter discount' }]}
            >
              <Input type="number" min={0} max={100} placeholder="e.g., 20" className="h-12 rounded-lg" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Price for 3 Rides"
              name="ridesPricing3"
              rules={[{ required: true, message: 'Enter price' }]}
            >
              <Input type="number" prefix="$" min={0} className="h-12 rounded-lg" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Price for 5 Rides"
              name="ridesPricing5"
              rules={[{ required: true, message: 'Enter price' }]}
            >
              <Input type="number" prefix="$" min={0} className="h-12 rounded-lg" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Price for 10 Rides"
              name="ridesPricing10"
              rules={[{ required: true, message: 'Enter price' }]}
            >
              <Input type="number" prefix="$" min={0} className="h-12 rounded-lg" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Refundable Amount"
              name="refundAmount"
              rules={[{ required: true, message: 'Enter refund amount' }]}
            >
              <Input type="number" prefix="$" min={0} className="h-12 rounded-lg" />
            </Form.Item>
          </Col>
        </Row>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={onCancel}
            className="px-8 py-2 h-auto font-medium rounded-lg"
            style={{
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              color: '#6b7280',
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="px-8 py-2 h-auto font-medium rounded-lg"
            style={{
              backgroundColor: '#0EA5E9',
              borderColor: '#0EA5E9',
            }}
          >
            {isEdit ? 'Update Pack' : 'Create Pack'}
          </Button>
        </div>
      </Form>
    </div>
  );
}