// Screen Time API Types

export type AuthorizationStatus = 'notDetermined' | 'denied' | 'approved' | 'unknown';

export interface ScreenTimeReport {
  totalScreenTime: number; // in seconds
  startDate: number; // Unix timestamp
  endDate: number; // Unix timestamp
  applications: ApplicationUsage[];
  categories: CategoryUsage[];
}

export interface ApplicationUsage {
  bundleIdentifier: string;
  displayName: string;
  totalTime: number; // in seconds
  numberOfNotifications?: number;
  numberOfPickups?: number;
}

export interface CategoryUsage {
  identifier: string;
  displayName: string;
  totalTime: number; // in seconds
  applications: ApplicationUsage[];
}

export interface TodayScreenTimeReport {
  totalScreenTime: number; // in seconds
  date: number; // Unix timestamp
  apps: ApplicationUsage[];
}

export interface InstalledApplication {
  bundleIdentifier: string;
  displayName: string;
  token?: number;
}

// Error types
export type ScreenTimeError = 
  | 'AUTHORIZATION_DENIED'
  | 'AUTHORIZATION_NOT_DETERMINED' 
  | 'AUTHORIZATION_ERROR'
  | 'NOT_AUTHORIZED'
  | 'SCREEN_TIME_ERROR'
  | 'TIME_LIMIT_ERROR'
  | 'REMOVE_LIMIT_ERROR'
  | 'BLOCK_APP_ERROR'
  | 'UNBLOCK_APP_ERROR'
  | 'GET_APPS_ERROR';