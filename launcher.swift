
import Cocoa;
import Foundation;

var appName = "app";
var launchUrl = "";

class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationDidFinishLaunching(_ aNotification: Notification) {
        guard let currentExecutableDir = Bundle.main.executableURL?.deletingLastPathComponent() else { NSApplication.shared.terminate(nil); return; }
        let targetURL = currentExecutableDir.appendingPathComponent(appName);
        let task = Process();
        task.executableURL = targetURL;
        task.arguments = [launchUrl];
        do {
            try task.run();
        } catch {
            print("Could not start \(targetURL.absoluteString) \(error)");
        }
        NSApplication.shared.terminate(nil);
    }

    func application(_ application: NSApplication, open urls: [URL]) {
        for url in urls {
            launchUrl = url.absoluteString;
            break;
        }
    }
}

autoreleasepool {
    if let infoDict = Bundle.main.infoDictionary {
        appName = infoDict["CFBundleName"] as? String ?? "app";
    }
    let app = NSApplication.shared;
    let delegate = AppDelegate();
    app.delegate = delegate;
    app.run();
}
