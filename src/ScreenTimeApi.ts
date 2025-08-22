import ReactNativeScreenTimeModule from './ReactNativeScreenTimeModule';
import { 
  AuthorizationStatus, 
  ScreenTimeReport, 
  TodayScreenTimeReport, 
  InstalledApplication 
} from './types';

export class ScreenTimeApi {
  private static checkModule() {
    if (!ReactNativeScreenTimeModule) {
      throw new Error(
        'ReactNativeScreenTime module is not available. ' +
        'Make sure you are running on iOS and the module is properly linked.'
      );
    }
    if (typeof ReactNativeScreenTimeModule.requestAuthorization !== 'function') {
      throw new Error(
        'ReactNativeScreenTime module methods are not available. ' +
        'This might happen if you are running on a simulator or web. ' +
        'Screen Time API only works on physical iOS devices.'
      );
    }
  }
  /**
   * Request authorization to access Screen Time data
   * This will show the system permission dialog to the user
   */
  static async requestAuthorization(): Promise<string> {
    this.checkModule();
    return await ReactNativeScreenTimeModule.requestAuthorization();
  }

  /**
   * Get the current authorization status for Screen Time access
   * @returns AuthorizationStatus - current status
   */
  static getAuthorizationStatus(): AuthorizationStatus {
    this.checkModule();
    return ReactNativeScreenTimeModule.getAuthorizationStatus();
  }

  /**
   * Get screen time report for a specific date range
   * @param startDate - Start date as Unix timestamp
   * @param endDate - End date as Unix timestamp
   * @returns Promise<ScreenTimeReport> - Screen time data for the period
   */
  static async getScreenTimeReport(startDate: number, endDate: number): Promise<ScreenTimeReport> {
    return await ReactNativeScreenTimeModule.getScreenTimeReport(startDate, endDate);
  }

  /**
   * Get today's screen time report (convenience method)
   * @returns Promise<TodayScreenTimeReport> - Today's screen time data
   */
  static async getTodayScreenTime(): Promise<TodayScreenTimeReport> {
    return await ReactNativeScreenTimeModule.getTodayScreenTime();
  }

  /**
   * Set a time limit for a specific application
   * @param bundleId - App bundle identifier (e.g., "com.apple.mobilesafari")
   * @param timeLimit - Time limit in minutes
   * @returns Promise<string> - Success message
   */
  static async setAppTimeLimit(bundleId: string, timeLimit: number): Promise<string> {
    return await ReactNativeScreenTimeModule.setAppTimeLimit(bundleId, timeLimit);
  }

  /**
   * Remove time limit for a specific application
   * @param bundleId - App bundle identifier
   * @returns Promise<string> - Success message
   */
  static async removeAppTimeLimit(bundleId: string): Promise<string> {
    return await ReactNativeScreenTimeModule.removeAppTimeLimit(bundleId);
  }

  /**
   * Block a specific application
   * @param bundleId - App bundle identifier
   * @returns Promise<string> - Success message
   */
  static async blockApplication(bundleId: string): Promise<string> {
    return await ReactNativeScreenTimeModule.blockApplication(bundleId);
  }

  /**
   * Unblock a specific application
   * @param bundleId - App bundle identifier
   * @returns Promise<string> - Success message
   */
  static async unblockApplication(bundleId: string): Promise<string> {
    return await ReactNativeScreenTimeModule.unblockApplication(bundleId);
  }

  /**
   * Get list of installed applications
   * Note: This is a placeholder implementation. 
   * Full implementation requires FamilyActivityPicker integration.
   * @returns Promise<InstalledApplication[]> - List of installed apps
   */
  static async getInstalledApplications(): Promise<InstalledApplication[]> {
    return await ReactNativeScreenTimeModule.getInstalledApplications();
  }

  // Convenience methods for common use cases

  /**
   * Check if Screen Time access is authorized
   * @returns boolean - true if authorized, false otherwise
   */
  static isAuthorized(): boolean {
    return this.getAuthorizationStatus() === 'approved';
  }

  /**
   * Get screen time for the last 7 days
   * @returns Promise<ScreenTimeReport> - Last week's screen time data
   */
  static async getWeeklyScreenTime(): Promise<ScreenTimeReport> {
    const endDate = Date.now() / 1000;
    const startDate = endDate - (7 * 24 * 60 * 60); // 7 days ago
    return this.getScreenTimeReport(startDate, endDate);
  }

  /**
   * Get screen time for the current month
   * @returns Promise<ScreenTimeReport> - Current month's screen time data
   */
  static async getMonthlyScreenTime(): Promise<ScreenTimeReport> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = Date.now() / 1000;
    const startDate = startOfMonth.getTime() / 1000;
    return this.getScreenTimeReport(startDate, endDate);
  }
}