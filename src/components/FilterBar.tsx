'use client';

import React from 'react';
import { Port } from '@/types/port';

interface FilterBarProps {
  onFilterChange: (filters: Partial<Port>) => void;
  countries: string[];
  provinces: string[];
  timezones: string[];
}

export default function FilterBar({ onFilterChange, countries, provinces, timezones }: FilterBarProps) {
  const [filters, setFilters] = React.useState<Partial<Port>>({});

  const handleFilterChange = (key: keyof Port, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          id="country"
          className="w-full p-2 border rounded-md"
          value={filters.country || ''}
          onChange={(e) => handleFilterChange('country', e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
          Province
        </label>
        <select
          id="province"
          className="w-full p-2 border rounded-md"
          value={filters.province || ''}
          onChange={(e) => handleFilterChange('province', e.target.value)}
        >
          <option value="">All Provinces</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
          Timezone
        </label>
        <select
          id="timezone"
          className="w-full p-2 border rounded-md"
          value={filters.timezone || ''}
          onChange={(e) => handleFilterChange('timezone', e.target.value)}
        >
          <option value="">All Timezones</option>
          {timezones.map((timezone) => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
