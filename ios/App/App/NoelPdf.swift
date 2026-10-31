import UIKit
import WebKit
import PDFKit
import Capacitor

/// 🖨️ Turns the app's print pages into one real, letter-size PDF, entirely on the phone.
/// JS: NoelPdf.make({ docs: [{ html, margin }], fileName }) → { uri, pages }
///     NoelPdf.print({ uri, name })  → opens the iPhone print screen (AirPrint)
@objc(NoelPdfPlugin)
public class NoelPdfPlugin: CAPPlugin, CAPBridgedPlugin, WKNavigationDelegate {
    public let identifier = "NoelPdfPlugin"
    public let jsName = "NoelPdf"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "make", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "print", returnType: CAPPluginReturnPromise)
    ]

    private let paper = CGRect(x: 0, y: 0, width: 612, height: 792)   // US Letter, in points
    private var queue: [(html: String, margin: CGFloat)] = []
    private var margin: CGFloat = 36
    private var web: WKWebView?
    private var out = PDFDocument()
    private var call: CAPPluginCall?
    private var fileName = "Noel-Printables.pdf"

    @objc func make(_ call: CAPPluginCall) {
        guard let docs = call.getArray("docs") as? [[String: Any]], !docs.isEmpty else { call.reject("Nothing to print"); return }
        DispatchQueue.main.async {
            if self.call != nil { call.reject("Busy making another PDF"); return }
            self.call = call
            self.out = PDFDocument()
            self.fileName = (call.getString("fileName") ?? "Noel-Printables.pdf").replacingOccurrences(of: "/", with: "-")
            self.queue = docs.map { d in
                let m = (d["margin"] as? NSNumber)?.doubleValue ?? 0.5
                return (html: d["html"] as? String ?? "", margin: CGFloat(m * 72))
            }
            self.next()
        }
    }

    private func next() {
        web?.removeFromSuperview(); web = nil
        guard !queue.isEmpty else { finish(); return }
        let d = queue.removeFirst()
        margin = d.margin
        let w = WKWebView(frame: CGRect(x: -2000, y: 0, width: paper.width, height: paper.height))
        w.alpha = 0.01
        w.navigationDelegate = self
        bridge?.viewController?.view.addSubview(w)
        web = w
        w.loadHTMLString(d.html, baseURL: nil)
        // if a page never finishes loading, give up after 20 seconds instead of staying "busy" forever
        DispatchQueue.main.asyncAfter(deadline: .now() + 20) { [weak self, weak w] in
            guard let self = self, let w = w, self.web === w, self.call != nil else { return }
            self.fail(NSError(domain: "NoelPdf", code: 1, userInfo: [NSLocalizedDescriptionKey: "The page took too long to load"]))
        }
    }

    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // a moment for the built-in fonts to settle before drawing
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) { self.render(webView) }
    }

    public func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) { fail(error) }
    public func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) { fail(error) }

    private func fail(_ error: Error) {
        web?.removeFromSuperview(); web = nil; queue = []
        call?.reject("Could not make the PDF: \(error.localizedDescription)"); call = nil
    }

    private func render(_ webView: WKWebView) {
        let r = UIPrintPageRenderer()
        r.addPrintFormatter(webView.viewPrintFormatter(), startingAtPageAt: 0)
        r.setValue(NSValue(cgRect: paper), forKey: "paperRect")
        r.setValue(NSValue(cgRect: paper.insetBy(dx: margin, dy: margin)), forKey: "printableRect")
        let data = NSMutableData()
        UIGraphicsBeginPDFContextToData(data, paper, nil)
        let pages = r.numberOfPages
        r.prepare(forDrawingPages: NSRange(location: 0, length: max(pages, 1)))
        for i in 0..<pages {
            UIGraphicsBeginPDFPage()
            r.drawPage(at: i, in: UIGraphicsGetPDFContextBounds())
        }
        UIGraphicsEndPDFContext()
        if let doc = PDFDocument(data: data as Data) {
            for i in 0..<doc.pageCount {
                if let p = doc.page(at: i) { out.insert(p, at: out.pageCount) }
            }
        }
        next()
    }

    private func finish() {
        guard let call = call else { return }
        self.call = nil
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(fileName)
        try? FileManager.default.removeItem(at: url)
        if out.pageCount == 0 || !out.write(to: url) { call.reject("Could not save the PDF"); return }
        call.resolve(["uri": url.absoluteString, "pages": out.pageCount])
    }

    @objc func print(_ call: CAPPluginCall) {
        guard let s = call.getString("uri"), let url = URL(string: s) else { call.reject("No file"); return }
        DispatchQueue.main.async {
            let info = UIPrintInfo(dictionary: nil)
            info.outputType = .general
            info.jobName = call.getString("name") ?? "Noël Tier 1 Hub"
            let pc = UIPrintInteractionController.shared
            pc.printInfo = info
            pc.printingItem = url
            pc.present(animated: true) { _, completed, error in
                if let error = error { call.reject(error.localizedDescription) } else { call.resolve(["printed": completed]) }
            }
        }
    }
}

/// The app's main screen, with Noël's own native pieces plugged in.
class NoelViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(NoelPdfPlugin())
    }
}
