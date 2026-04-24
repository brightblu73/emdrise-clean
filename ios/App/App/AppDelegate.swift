import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var statusBarView: UIView?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        DispatchQueue.main.async {
            if #available(iOS 13.0, *) {
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let statusBarManager = windowScene.statusBarManager {
                    let statusBarView = UIView(frame: statusBarManager.statusBarFrame)
                    statusBarView.backgroundColor = UIColor(red: 246/255, green: 247/255, blue: 250/255, alpha: 1.0) // #3B82F6
                    self.statusBarView = statusBarView
                    if let window = windowScene.windows.first {
                        window.addSubview(statusBarView)
                    }
                    UIDevice.current.beginGeneratingDeviceOrientationNotifications()
                    NotificationCenter.default.addObserver(self, selector: #selector(self.orientationChanged), name: UIDevice.orientationDidChangeNotification, object: nil)

                    // Also listen to status bar orientation notifications for programmatic orientation changes
                    NotificationCenter.default.addObserver(self, selector: #selector(self.orientationChanged), name: UIApplication.didChangeStatusBarOrientationNotification, object: nil)

                    self.orientationChanged()
                }
            } else {
//                UIApplication.shared.statusBar?.backgroundColor = UIColor.white
            }
        }
        return true
    }

    @objc func orientationChanged() {
        // Check status bar orientation instead of device orientation for more reliable detection
        // when orientation is changed programmatically by Capacitor plugins
        let statusBarOrientation = UIApplication.shared.statusBarOrientation

        switch statusBarOrientation {
        case .portrait, .portraitUpsideDown:
            statusBarView?.isHidden = false
        case .landscapeLeft, .landscapeRight:
            statusBarView?.isHidden = true
        @unknown default:
            // For any unknown orientations, default to visible
            statusBarView?.isHidden = false
        }
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
