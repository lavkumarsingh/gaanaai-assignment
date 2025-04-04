import React, { useState, useEffect } from 'react';
import { Table, Input, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import type { Key } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Port } from '@/types/port';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import AddPortModal from './AddPortModal';
import EditPortModal from './EditPortModal';

export default function PortTable(): React.ReactElement {
  const [data, setData] = useState<Port[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);

  const handleEdit = (record: Port) => {
    setSelectedPort(record);
    setIsEditModalOpen(true);
  };

  const handleAddSuccess = () => {
    fetchData({
      current: pagination.current,
      pageSize: pagination.pageSize,
      search: searchText
    });
  };

  const getColumns = (): ColumnsType<Port> => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    sorter: true,
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    sorter: true,
  },
  {
    title: 'Province',
    dataIndex: 'province',
    key: 'province',
    sorter: true,
  },
  {
    title: 'Timezone',
    dataIndex: 'timezone',
    key: 'timezone',
    sorter: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button 
          type="link" 
          icon={<EditOutlined />} 
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
        <Popconfirm
          title="Delete Port"
          description="Are you sure you want to delete this port?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Popconfirm>
      </Space>
    )
  }
];



  const fetchData = async (params: any) => {
    try {
      setLoading(true);
      const { current, pageSize, filters: paramFilters, sorter, search } = params;
      const { data, total } = await api.getPorts({
        page: current,
        limit: pageSize,
        search: search || searchText,
        sortBy: sorter?.field || sortField,
        sortOrder: sorter?.order === 'ascend' ? 'asc' : 'desc',
        ...paramFilters
      });
      setData(data);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      toast.error('Failed to fetch ports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch when using global search
    if (Object.keys(filters).length === 0) {
      fetchData({
        current: pagination.current,
        pageSize: pagination.pageSize,
        search: searchText
      });
    }
  }, [searchText]);

  const handleTableChange: TableProps<Port>['onChange'] = (pag, filters, sorter) => {
    const typedSorter = sorter as { field?: string; order?: 'ascend' | 'descend' };
    
    // Only update sort state if sorter changed
    if (sorter && (typedSorter.field !== sortField || typedSorter.order !== sortOrder)) {
      setSortField(typedSorter.field || 'name');
      setSortOrder(typedSorter.order || 'ascend');
    }

    // Update pagination
    setPagination({
      current: pag.current || 1,
      pageSize: pag.pageSize || 10,
      total: pagination.total
    });
    
    // Convert filters to _like format
    const newFilters: Record<string, string> = {};
    Object.entries(filters || {}).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        newFilters[`${key}_like`] = values[0].toString();
      }
    });
    setFilters(newFilters);
    
    // Only fetch if filters or sorter actually changed
    fetchData({
      current: pag.current,
      pageSize: pag.pageSize,
      filters: newFilters,
      sorter: typedSorter,
      search: ''
    });
  };

  const getColumnSearchProps = (dataIndex: keyof Port): Partial<ColumnType<Port>> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => {
            confirm();
            // Don't fetch here as handleTableChange will handle it
          }}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              confirm();
              // Don't fetch here as handleTableChange will handle it
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters?.();
              setSelectedKeys([]);
              confirm();
              // Don't fetch here as handleTableChange will handle it
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: boolean | Key | null, record: Port) => true
  });

  const handleDelete = async (id: string) => {
    try {
      await api.deletePort(id);
      toast.success('Port deleted successfully');
      await fetchData({
        current: pagination.current,
        pageSize: pagination.pageSize,
        search: searchText
      });
    } catch (error) {
      toast.error('Error deleting port');
      console.error('Error deleting port:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const timeoutId = setTimeout(() => {
      setSearchText(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };



  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <Input
          placeholder="Global Search"
          value={searchText}
          onChange={handleSearch}
          className="flex-1"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          Add Port
        </Button>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <Table<Port>
          columns={getColumns().map(col => {
            if ('dataIndex' in col) {
              return { 
                ...col, 
                ...getColumnSearchProps(col.dataIndex as keyof Port),
                ellipsis: true
              };
            }
            return col;
          })}
          dataSource={data}
          pagination={false}
          loading={loading}
          onChange={handleTableChange}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Showing {((pagination.current - 1) * pagination.pageSize) + 1} to {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} entries
        </div>
        <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
          <Button
            disabled={pagination.current === 1}
            onClick={() => {
              const newPage = pagination.current - 1;
              setPagination(prev => ({ ...prev, current: newPage }));
              fetchData({
                current: newPage,
                pageSize: pagination.pageSize,
                filters,
                sorter: { field: sortField, order: sortOrder },
                search: searchText
              });
            }}
            className="flex-1 sm:flex-none px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            disabled={pagination.current * pagination.pageSize >= pagination.total}
            onClick={() => {
              const newPage = pagination.current + 1;
              setPagination(prev => ({ ...prev, current: newPage }));
              fetchData({
                current: newPage,
                pageSize: pagination.pageSize,
                filters,
                sorter: { field: sortField, order: sortOrder },
                search: searchText
              });
            }}
            className="flex-1 sm:flex-none px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>

      {isAddModalOpen && (
        <AddPortModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {isEditModalOpen && selectedPort && (
        <EditPortModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleAddSuccess}
          port={selectedPort}
        />
      )}
    </div>
  );
}
