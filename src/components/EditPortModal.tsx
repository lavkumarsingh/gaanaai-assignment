import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { Port } from '@/types/port';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

interface EditPortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  port: Port;
}

export default function EditPortModal({ isOpen, onClose, onSuccess, port }: EditPortModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (isOpen && port) {
      form.setFieldsValue(port);
    }
  }, [isOpen, port, form]);

  const handleSubmit = async (values: Partial<Port>) => {
    try {
      setLoading(true);
      await api.updatePort(port.id, values);
      toast.success('Port updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update port');
      console.error('Error updating port:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Port"
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
            Update Port
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
