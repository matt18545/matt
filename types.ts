export interface PortfolioPosition {
  id: string;
  name: string;
  totalCost: number;
  currentValue: number;
  iconUrl: string;
  assetType: string;
  sector: string;
  geo: string;
  nextEarningsDate?: string; // 'YYYY-MM-DD'
  nextDividendDate?: string; // 'YYYY-MM-DD'
}

export type PositionUpdatePayload = Partial<Pick<PortfolioPosition, 'totalCost' | 'currentValue'>>;

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export interface ChartDataPoint {
  timestamp: number;
  gainLoss: number;
}

export interface FinancialEvent {
  id: string;
  title: string;
  date: string; // Stored as 'YYYY-MM-DD'
  positionId?: string; // Optional: link to a position
  type: 'earnings' | 'dividend' | 'custom';
  description?: string; // Optional: more details
  source: 'auto' | 'manual';
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}
