import Foundation
import Capacitor

@objc(StatusBarPlugin)
public class StatusBarPlugin: CAPPlugin {
    private var statusBarView: UIView?

    override public func load() {
        // Get reference to the statusBarView from AppDelegate
        if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
            statusBarView = appDelegate.statusBarView
        }
    }

    @objc func setVisible(_ call: CAPPluginCall) {
        let visible = call.getBool("visible") ?? true

        DispatchQueue.main.async {
            self.statusBarView?.isHidden = !visible
            call.resolve()
        }
    }
}
