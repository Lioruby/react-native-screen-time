// Web fallback - module not available on web
export default {
  requestAuthorization: () =>
    Promise.reject(new Error("ScreenTime API is not available on web")),
  getAuthorizationStatus: () => "notDetermined",
  getScreenTimeReport: () =>
    Promise.reject(new Error("ScreenTime API is not available on web")),
  getTodayScreenTime: () =>
    Promise.reject(new Error("ScreenTime API is not available on web")),
  setAppTimeLimit: () =>
    Promise.reject(new Error("ScreenTime API is not available on web")),
  removeAppTimeLimit: () =>
    Promise.reject(new Error("ScreenTime API is not available on web")),
  blockApplication: () =>
    Promise.reject(new Error("ScreenTime API is not available on web")),
  unblockApplication: () =>
    Promise.reject(new Error("ScreenTime API is not available on web")),
  getInstalledApplications: () =>
    Promise.reject(new Error("ScreenTime API is not available on web")),
};