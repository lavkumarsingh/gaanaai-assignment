export interface Port {
  id: string;
  name: string;
  city: string;
  country: string;
  alias: string[];
  regions: string[];
  coordinates: number[];
  province: string;
  timezone: string;
  unlocs: string[];
  code?: string;
}

export interface PortsResponse {
  [key: string]: Port;
}

export interface Column {
  key: keyof Port;
  label: string;
  visible: boolean;
}
