import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { Port } from '@/types/port';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

interface AddPortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPortModal({ isOpen, onClose, onSuccess }: AddPortModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: Omit<Port, 'id'>) => {
    try {
      setLoading(true);
      await api.createPort(values);
      toast.success('Port added successfully');
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to add port');
      console.error('Error adding port:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Port"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: '600px' }}
      className="top-[5vh] sm:top-[10vh]"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter port name' }]}
        >
          <Input placeholder="Enter port name" />
        </Form.Item>

        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: 'Please enter city' }]}
        >
          <Input placeholder="Enter city" />
        </Form.Item>

        <Form.Item
          name="country"
          label="Country"
          rules={[{ required: true, message: 'Please enter country' }]}
        >
          <Input placeholder="Enter country" />
        </Form.Item>

        <Form.Item
          name="province"
          label="Province"
          rules={[{ required: true, message: 'Please enter province' }]}
        >
          <Input placeholder="Enter province" />
        </Form.Item>

        <Form.Item
          name="timezone"
          label="Timezone"
          rules={[{ required: true, message: 'Please enter timezone' }]}
        >
          <Input placeholder="Enter timezone" />
        </Form.Item>

        <Form.Item className="mb-0 flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button 
            onClick={onClose} 
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            Add Port
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
