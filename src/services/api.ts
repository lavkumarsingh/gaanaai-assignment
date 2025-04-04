import axios from 'axios';
import { Port } from '@/types/port';

const API_URL = 'http://localhost:3001';
const SOURCE_URL = 'https://raw.githubusercontent.com/marchah/sea-ports/refs/heads/master/lib/ports.json';

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
}

export const api = {
  fetchAndPopulateData: async () => {
    try {
      const response = await axios.get(SOURCE_URL);
      const portsData = response.data;
      
      // Transform data to array format
      const portsArray = Object.entries(portsData).map(([id, data]: [string, any]) => ({
        id,
        ...data
      }));
      
      // Save to json-server
      await axios.post(`${API_URL}/ports/bulk`, portsArray);
      return true;
    } catch (error) {
      console.error('Error populating data:', error);
      return false;
    }
  },

  getPorts: async (params: QueryParams): Promise<ApiResponse<Port>> => {
    const { page = 1, limit = 10, search = '', sortBy = '', sortOrder = 'asc', ...filters } = params;
    
    // Build query parameters
    const queryParams: Record<string, any> = {
      _page: page,
      _limit: limit,
      _sort: sortBy,
      _order: sortOrder
    };

    // Add search parameter if provided
    if (search) {
      queryParams.q = search;
    }

    // Add any additional filters with case-insensitive search
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (key.endsWith('_like')) {
          const actualKey = key.replace('_like', '');
          // Use json-server's full-text search for specific fields
          queryParams[`${actualKey}_like`] = value;
        } else {
          queryParams[key] = value;
        }
      }
    });
    
    // If there's a search term, apply it to specific fields
    if (search) {
      queryParams.q = '';
      queryParams[`name_like`] = search;
      queryParams[`country_like`] = search;
      queryParams[`city_like`] = search;
    }

    try {
      const response = await axios.get<Port[]>(`${API_URL}/ports`, {
        params: queryParams
      });

      return {
        data: response.data,
        total: parseInt(response.headers['x-total-count'] || '0')
      };
    } catch (error) {
      console.error('Error fetching ports:', error);
      throw error;
    }
  },

  getPort: async (id: string): Promise<Port> => {
    try {
      const response = await axios.get<Port>(`${API_URL}/ports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching port:', error);
      throw error;
    }
  },

  createPort: async (port: Omit<Port, 'id'>): Promise<Port> => {
    try {
      const response = await axios.post<Port>(`${API_URL}/ports`, port);
      return response.data;
    } catch (error) {
      console.error('Error creating port:', error);
      throw error;
    }
  },

  updatePort: async (id: string, port: Partial<Port>): Promise<Port> => {
    try {
      const response = await axios.patch<Port>(`${API_URL}/ports/${id}`, port);
      return response.data;
    } catch (error) {
      console.error('Error updating port:', error);
      throw error;
    }
  },

  deletePort: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/ports/${id}`);
    } catch (error) {
      console.error('Error deleting port:', error);
      throw error;
    }
  }
}
