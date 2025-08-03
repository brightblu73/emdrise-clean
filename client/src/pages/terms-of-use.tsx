import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CreditCard, Shield, AlertCircle } from "lucide-react";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Terms of Use</h1>
          <p className="text-lg text-slate-600">
            Please read these terms carefully before using EMDRise
          </p>
        </div>

        <div className="space-y-6">
          {/* Agreement to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing and using EMDRise ("the Platform", "our Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p>
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EMDRise provides:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Guided EMDR-based therapeutic exercises and bilateral stimulation tools</li>
                <li>Educational content about trauma processing and mental health</li>
                <li>Progress tracking and journaling features</li>
                <li>Virtual therapist guidance through structured therapeutic protocols</li>
                <li>Relaxation and grounding techniques</li>
              </ul>
              <p className="text-sm text-slate-600 bg-yellow-50 p-3 rounded">
                <strong>Important:</strong> EMDRise is a supplementary tool and does not replace professional mental health care, therapy, or medical treatment.
              </p>
            </CardContent>
          </Card>

          {/* User Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                User Eligibility and Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>To use EMDRise, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years of age, or have parental/guardian consent if under 18</li>
                <li>Have the mental capacity to understand and consent to these terms</li>
                <li>Provide accurate and truthful information during registration</li>
                <li>Be capable of safely engaging with trauma-related therapeutic content</li>
                <li>Not be experiencing a current mental health emergency</li>
              </ul>
              <p>
                <strong>Professional Supervision Required:</strong> Users under 18 or those with severe mental health conditions should use this platform only under professional supervision.
              </p>
            </CardContent>
          </Card>

          {/* Account Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Account Registration and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>When creating an account, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as necessary</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms or pose safety risks.
              </p>
            </CardContent>
          </Card>

          {/* Acceptable Use Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You agree <strong>NOT</strong> to use EMDRise to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Share account credentials with others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Use the service for commercial purposes without authorization</li>
                <li>Reverse engineer, decompile, or disassemble any part of the service</li>
                <li>Create multiple accounts to circumvent restrictions</li>
              </ul>
            </CardContent>
          </Card>

          {/* Subscription and Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Subscription and Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Free Trial</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>7-day free trial available for new users</li>
                  <li>Full access to all features during trial period</li>
                  <li>Cancel anytime during trial to avoid charges</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Subscription</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Monthly subscription: £12.99/month</li>
                  <li>Automatic renewal unless cancelled</li>
                  <li>Billing occurs on the same day each month</li>
                  <li>Price changes will be communicated 30 days in advance</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Cancellation and Refunds</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cancel anytime through your account settings</li>
                  <li>Cancellation takes effect at the end of current billing period</li>
                  <li>No refunds for partial month usage</li>
                  <li>Access continues until subscription expires</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Payment Processing</h4>
                <p>Payments are processed securely through Stripe. We do not store your payment information on our servers.</p>
              </div>
            </CardContent>
          </Card>

          {/* Content and Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Our Content</h4>
                <p>
                  All content, features, and functionality of EMDRise, including but not limited to text, graphics, logos, videos, and software, are owned by EMDRise and protected by copyright, trademark, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Your Content</h4>
                <p>You retain ownership of content you create (session notes, reflections, etc.). However, you grant us a limited license to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Store and process your content to provide the service</li>
                  <li>Use anonymized, aggregated data for service improvement</li>
                  <li>Backup your data for recovery purposes</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">License to Use</h4>
                <p>
                  We grant you a limited, non-exclusive, non-transferable license to access and use EMDRise for personal, non-commercial purposes in accordance with these terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>, which is incorporated into these terms by reference.
              </p>
              <p>
                Key privacy principles:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We collect only necessary information to provide our service</li>
                <li>Your therapeutic content remains private and confidential</li>
                <li>We do not sell your personal information to third parties</li>
                <li>You can request data deletion at any time</li>
              </ul>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Service Availability and Modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We strive to provide reliable service, but we cannot guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uninterrupted access to the platform</li>
                <li>Error-free operation at all times</li>
                <li>Compatibility with all devices or browsers</li>
                <li>Permanent availability of all features</li>
              </ul>
              <p>
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify, suspend, or discontinue the service</li>
                <li>Update these terms with 30 days notice</li>
                <li>Perform maintenance and updates</li>
                <li>Change features or functionality</li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertCircle className="mr-2 h-5 w-5" />
                Limitation of Liability and Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-orange-700 space-y-4">
              <p>
                <strong>IMPORTANT:</strong> EMDRise is provided "as is" without warranties of any kind. To the fullest extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We disclaim all warranties, express or implied</li>
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the amount you paid for the service</li>
                <li>We are not responsible for therapeutic outcomes or medical results</li>
                <li>Users assume all risks associated with trauma processing</li>
              </ul>
              <p className="font-semibold">
                This platform supplements but does not replace professional mental health care.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Termination by You</h4>
                <p>You may terminate your account at any time by canceling your subscription and contacting us to delete your account.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Termination by Us</h4>
                <p>We may terminate or suspend your account if you:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Violate these terms of use</li>
                  <li>Engage in harmful or illegal activities</li>
                  <li>Pose a safety risk to yourself or others</li>
                  <li>Fail to pay subscription fees</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Effect of Termination</h4>
                <p>Upon termination:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Your access to the platform will cease</li>
                  <li>Your data may be deleted after a reasonable period</li>
                  <li>Outstanding payments remain due</li>
                  <li>Certain provisions of these terms survive termination</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Resolution */}
          <Card>
            <CardHeader>
              <CardTitle>Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have a dispute with EMDRise:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact us directly at <a href="mailto:support@emdrise.com" className="text-blue-600 hover:underline">support@emdrise.com</a> to resolve the matter informally</li>
                <li>If informal resolution fails, disputes will be resolved through binding arbitration</li>
                <li>Arbitration will be conducted in accordance with applicable laws</li>
                <li>You waive the right to participate in class action lawsuits</li>
              </ol>
            </CardContent>
          </Card>

          {/* General Provisions */}
          <Card>
            <CardHeader>
              <CardTitle>General Provisions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Governing Law</h4>
                <p>These terms are governed by the laws of the United Kingdom, without regard to conflict of law principles.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Severability</h4>
                <p>If any provision of these terms is found unenforceable, the remaining provisions will remain in full force and effect.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Entire Agreement</h4>
                <p>These terms, together with our Privacy Policy and Legal Disclaimer, constitute the entire agreement between you and EMDRise.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Changes to Terms</h4>
                <p>We may update these terms periodically. Significant changes will be communicated 30 days in advance. Continued use constitutes acceptance of revised terms.</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                For questions about these Terms of Use, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> <a href="mailto:legal@emdrise.com" className="text-blue-600 hover:underline">legal@emdrise.com</a></p>
                <p><strong>Support:</strong> <a href="mailto:support@emdrise.com" className="text-blue-600 hover:underline">support@emdrise.com</a></p>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}