import ExpoModulesCore
import FamilyControls
import DeviceActivity
import ManagedSettings

public class ReactNativeScreenTimeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ReactNativeScreenTime")
    
    // Request authorization for Screen Time access
    AsyncFunction("requestAuthorization") { (promise: Promise) in
      Task {
        do {
          try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
          promise.resolve("authorized")
        } catch {
          switch error {
          case AuthorizationError.denied:
            promise.reject("AUTHORIZATION_DENIED", "Screen Time authorization was denied")
          case AuthorizationError.notDetermined:
            promise.reject("AUTHORIZATION_NOT_DETERMINED", "Screen Time authorization not determined")
          default:
            promise.reject("AUTHORIZATION_ERROR", "Failed to request Screen Time authorization: \(error.localizedDescription)")
          }
        }
      }
    }
    
    // Check current authorization status
    Function("getAuthorizationStatus") {
      switch AuthorizationCenter.shared.authorizationStatus {
      case .notDetermined:
        return "notDetermined"
      case .denied:
        return "denied"
      case .approved:
        return "approved"
      @unknown default:
        return "unknown"
      }
    }
    
    // Get screen time report for a date range
    AsyncFunction("getScreenTimeReport") { (startDate: Double, endDate: Double, promise: Promise) in
      guard AuthorizationCenter.shared.authorizationStatus == .approved else {
        promise.reject("NOT_AUTHORIZED", "Screen Time access not authorized")
        return
      }
      
      Task {
        do {
          let start = Date(timeIntervalSince1970: startDate)
          let end = Date(timeIntervalSince1970: endDate)
          
          // This would require implementing DeviceActivityReport properly
          // For now, return a structured placeholder response
          let report = [
            "totalScreenTime": 0, // in seconds
            "startDate": startDate,
            "endDate": endDate,
            "applications": [
              // Placeholder for app usage data
            ] as [[String: Any]],
            "categories": [
              // Placeholder for category usage data  
            ] as [[String: Any]]
          ] as [String: Any]
          
          promise.resolve(report)
        } catch {
          promise.reject("SCREEN_TIME_ERROR", "Failed to get screen time report: \(error.localizedDescription)")
        }
      }
    }
    
    // Get screen time report for today
    AsyncFunction("getTodayScreenTime") { (promise: Promise) in
      guard AuthorizationCenter.shared.authorizationStatus == .approved else {
        promise.reject("NOT_AUTHORIZED", "Screen Time access not authorized")
        return
      }
      
      Task {
        do {
          let calendar = Calendar.current
          let startOfDay = calendar.startOfDay(for: Date())
          let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay)!
          
          // This would require implementing DeviceActivityReport
          // For now, return a placeholder response
          promise.resolve([
            "totalScreenTime": 0,
            "date": startOfDay.timeIntervalSince1970,
            "apps": []
          ])
        } catch {
          promise.reject("SCREEN_TIME_ERROR", "Failed to get screen time: \(error.localizedDescription)")
        }
      }
    }
    
    // Set app usage limits
    AsyncFunction("setAppTimeLimit") { (bundleId: String, timeLimit: Int, promise: Promise) in
      guard AuthorizationCenter.shared.authorizationStatus == .approved else {
        promise.reject("NOT_AUTHORIZED", "Screen Time access not authorized")
        return
      }
      
      Task {
        do {
          let store = ManagedSettingsStore()
          
          // Create application token from bundle ID
          let token = ApplicationToken(bundleIdentifier: bundleId)
          let tokens: Set<ApplicationToken> = [token]
          
          // Set time limit (timeLimit is in minutes)
          let limits = [tokens: DateComponents(minute: timeLimit)]
          store.application.blockedApplications = tokens
          
          promise.resolve("success")
        } catch {
          promise.reject("TIME_LIMIT_ERROR", "Failed to set app time limit: \(error.localizedDescription)")
        }
      }
    }
    
    // Remove app usage limits
    AsyncFunction("removeAppTimeLimit") { (bundleId: String, promise: Promise) in
      guard AuthorizationCenter.shared.authorizationStatus == .approved else {
        promise.reject("NOT_AUTHORIZED", "Screen Time access not authorized")
        return
      }
      
      Task {
        do {
          let store = ManagedSettingsStore()
          
          // Create application token from bundle ID
          let token = ApplicationToken(bundleIdentifier: bundleId)
          var currentBlocked = store.application.blockedApplications ?? Set<ApplicationToken>()
          currentBlocked.remove(token)
          store.application.blockedApplications = currentBlocked
          
          promise.resolve("success")
        } catch {
          promise.reject("REMOVE_LIMIT_ERROR", "Failed to remove app time limit: \(error.localizedDescription)")
        }
      }
    }
    
    // Block specific apps
    AsyncFunction("blockApplication") { (bundleId: String, promise: Promise) in
      guard AuthorizationCenter.shared.authorizationStatus == .approved else {
        promise.reject("NOT_AUTHORIZED", "Screen Time access not authorized")
        return
      }
      
      Task {
        do {
          let store = ManagedSettingsStore()
          
          // Create application token from bundle ID
          let token = ApplicationToken(bundleIdentifier: bundleId)
          var currentBlocked = store.application.blockedApplications ?? Set<ApplicationToken>()
          currentBlocked.insert(token)
          store.application.blockedApplications = currentBlocked
          
          promise.resolve("success")
        } catch {
          promise.reject("BLOCK_APP_ERROR", "Failed to block application: \(error.localizedDescription)")
        }
      }
    }
    
    // Unblock specific apps
    AsyncFunction("unblockApplication") { (bundleId: String, promise: Promise) in
      guard AuthorizationCenter.shared.authorizationStatus == .approved else {
        promise.reject("NOT_AUTHORIZED", "Screen Time access not authorized")
        return
      }
      
      Task {
        do {
          let store = ManagedSettingsStore()
          
          // Create application token from bundle ID
          let token = ApplicationToken(bundleIdentifier: bundleId)
          var currentBlocked = store.application.blockedApplications ?? Set<ApplicationToken>()
          currentBlocked.remove(token)
          store.application.blockedApplications = currentBlocked
          
          promise.resolve("success")
        } catch {
          promise.reject("UNBLOCK_APP_ERROR", "Failed to unblock application: \(error.localizedDescription)")
        }
      }
    }
    
    // Get list of installed applications (placeholder implementation)
    AsyncFunction("getInstalledApplications") { (promise: Promise) in
      guard AuthorizationCenter.shared.authorizationStatus == .approved else {
        promise.reject("NOT_AUTHORIZED", "Screen Time access not authorized")
        return
      }
      
      Task {
        do {
          // Note: Getting list of applications requires FamilyActivityPicker
          // This is a simplified implementation
          let applications: [[String: Any]] = []
          
          promise.resolve(applications)
        } catch {
          promise.reject("GET_APPS_ERROR", "Failed to get installed applications: \(error.localizedDescription)")
        }
      }
    }
  }
}