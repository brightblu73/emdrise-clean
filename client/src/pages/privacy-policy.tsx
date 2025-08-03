import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, Database, Shield, Users, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">
            How we protect and handle your personal information
          </p>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Shield className="mr-2 h-6 w-6" />
                Our Commitment to Your Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700 space-y-4">
              <p>
                At EMDRise, we understand that your therapeutic journey involves deeply personal information. 
                We are committed to protecting your privacy and maintaining the confidentiality of your data 
                with the highest standards of security and care.
              </p>
              <p>
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Information</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Email address (for account creation and communication)</li>
                  <li>Username and password (encrypted)</li>
                  <li>Subscription and payment information (processed through Stripe)</li>
                  <li>Account preferences and settings</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Therapeutic Content</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Session notes and reflections you choose to record</li>
                  <li>Progress data and assessment scores (SUDS/VOC ratings)</li>
                  <li>Target memories and therapeutic goals (stored locally when possible)</li>
                  <li>Bilateral stimulation preferences and usage patterns</li>
                  <li>Session completion data and progress tracking</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Technical Information</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Device type, browser information, and operating system</li>
                  <li>IP address and general location (country/region level)</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Error logs and performance data</li>
                  <li>Cookies and local storage data</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded">
                <p className="text-green-800">
                  <strong>Important:</strong> We never collect audio recordings, webcam data, or screen recordings. 
                  Your therapeutic conversations remain private to you.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Provision</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide access to EMDR therapeutic tools and content</li>
                  <li>Save and sync your progress across devices</li>
                  <li>Customize your therapeutic experience based on preferences</li>
                  <li>Enable session continuity and progress tracking</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Account Management</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Process subscription payments and billing</li>
                  <li>Send service-related communications and updates</li>
                  <li>Provide customer support and technical assistance</li>
                  <li>Prevent fraud and ensure account security</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Service Improvement</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Identify and fix technical issues</li>
                  <li>Develop new features and therapeutic tools</li>
                  <li>Conduct research using anonymized, aggregated data</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Legal and Safety</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Comply with legal obligations and court orders</li>
                  <li>Protect our rights and prevent misuse</li>
                  <li>Respond to emergencies involving imminent harm</li>
                  <li>Investigate potential violations of our terms</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing and Disclosure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Data Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded">
                <p className="text-red-800 font-semibold">
                  We do NOT sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Limited Sharing Scenarios</h4>
                <p>We may share your information only in these specific circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> Trusted third parties who help us operate our service 
                    (e.g., Stripe for payment processing, cloud hosting providers)
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law, court order, or to protect 
                    legal rights and safety
                  </li>
                  <li>
                    <strong>Emergency Situations:</strong> To prevent imminent harm to you or others 
                    (with appropriate mental health professionals)
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger or acquisition 
                    (with continued privacy protection)
                  </li>
                  <li>
                    <strong>Anonymized Research:</strong> Aggregated, de-identified data for therapeutic 
                    research (no personal identifiers)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Your Consent</h4>
                <p>
                  Any sharing beyond these scenarios requires your explicit consent. 
                  You can withdraw consent at any time by contacting us.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Data Security and Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>End-to-end encryption for data transmission (HTTPS/TLS)</li>
                  <li>Encrypted storage of sensitive personal information</li>
                  <li>Secure authentication and password protection</li>
                  <li>Regular security audits and vulnerability testing</li>
                  <li>Access controls and employee training on data handling</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Organizational Safeguards</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Principle of least access - employees see only necessary data</li>
                  <li>Background checks for staff with data access</li>
                  <li>Confidentiality agreements and privacy training</li>
                  <li>Incident response procedures for security breaches</li>
                  <li>Regular backups and disaster recovery planning</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Your Security Role</h4>
                <p>Help us protect your data by:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Using a strong, unique password</li>
                  <li>Logging out of shared or public devices</li>
                  <li>Reporting suspicious account activity immediately</li>
                  <li>Keeping your contact information updated</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded">
                <p className="text-yellow-800">
                  <strong>Security Limitation:</strong> While we implement strong security measures, 
                  no system is completely immune to breaches. We will notify you promptly of any 
                  security incidents affecting your personal data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Data Retention and Deletion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">How Long We Keep Your Data</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Active Accounts:</strong> Data is retained while your account is active 
                    and for a reasonable period after cancellation
                  </li>
                  <li>
                    <strong>Therapeutic Content:</strong> Session notes and progress data are kept 
                    until you request deletion or 2 years after account closure
                  </li>
                  <li>
                    <strong>Technical Data:</strong> Logs and usage data are typically deleted 
                    after 12 months unless needed for security or legal purposes
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Processed and stored by Stripe according 
                    to their retention policies
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Deletion Requests</h4>
                <p>You can request deletion of your data by:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Using the account deletion feature in your settings</li>
                  <li>Contacting us at <a href="mailto:privacy@emdrise.com" className="text-blue-600 hover:underline">privacy@emdrise.com</a></li>
                  <li>We will respond within 30 days and complete deletion within 90 days</li>
                  <li>Some data may be retained for legal or security purposes as required by law</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Your Privacy Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Access and Control</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Access:</strong> View and download your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request removal of your personal data</li>
                  <li><strong>Portability:</strong> Export your data in a common format</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Objection:</strong> Opt out of certain data processing activities</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Communication Preferences</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Opt out of marketing communications (while keeping essential service emails)</li>
                  <li>Choose your preferred communication frequency</li>
                  <li>Update notification preferences for progress reminders</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Regional Rights</h4>
                <p>Additional rights may apply based on your location:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>EU/UK (GDPR):</strong> Enhanced rights including data portability and objection</li>
                  <li><strong>California (CCPA):</strong> Right to know, delete, and opt-out of sale</li>
                  <li><strong>Other regions:</strong> Rights as provided by applicable local laws</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Cookies and Tracking Technologies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Types of Cookies We Use</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic site functionality 
                    (login, security, session management)
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Help us understand how you use our site 
                    to improve user experience
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Remember your settings and customizations
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Provide insights into usage patterns 
                    (anonymized where possible)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Managing Cookies</h4>
                <p>You can control cookies through:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Browser settings (disable, block, or delete cookies)</li>
                  <li>Our cookie preference center (when available)</li>
                  <li>Opting out of analytics tracking</li>
                </ul>
                <p className="text-sm text-slate-600 mt-2">
                  Note: Disabling essential cookies may affect site functionality.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services and Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Payment Processing</h4>
                <p>
                  We use Stripe for secure payment processing. Stripe has its own privacy policy 
                  and security measures. We do not store your payment card information on our servers.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Cloud Infrastructure</h4>
                <p>
                  Our service is hosted on secure cloud platforms that meet industry standards 
                  for data protection and security. These providers process data only as directed by us.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Analytics and Monitoring</h4>
                <p>
                  We may use analytics services to understand user behavior and improve our service. 
                  These services receive anonymized or aggregated data that cannot identify individual users.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* International Data Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EMDRise operates globally, and your data may be processed in countries other than 
                your own. We ensure adequate protection through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Adequacy decisions from relevant authorities</li>
                <li>Standard contractual clauses for data protection</li>
                <li>Certification schemes and codes of conduct</li>
                <li>Additional safeguards as required by applicable law</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EMDRise is designed for users aged 18 and older. We do not knowingly collect 
                personal information from children under 18 without proper parental consent and 
                professional supervision.
              </p>
              <p>
                If you believe we have inadvertently collected information from a child under 18, 
                please contact us immediately so we can delete the information.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices, 
                technology, legal requirements, or other factors.
              </p>
              <p>
                <strong>How we notify you:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email notification for significant changes</li>
                <li>Prominent notice on our platform</li>
                <li>30-day advance notice for material changes</li>
                <li>Updated "Last Modified" date on this page</li>
              </ul>
              <p>
                Continued use of our service after changes indicates acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us About Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our 
                data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Privacy Officer:</strong> <a href="mailto:privacy@emdrise.com" className="text-blue-600 hover:underline">privacy@emdrise.com</a></p>
                <p><strong>General Support:</strong> <a href="mailto:support@emdrise.com" className="text-blue-600 hover:underline">support@emdrise.com</a></p>
                <p><strong>Data Protection Officer:</strong> <a href="mailto:dpo@emdrise.com" className="text-blue-600 hover:underline">dpo@emdrise.com</a></p>
              </div>
              
              <p className="text-sm text-slate-600 mt-6">
                <strong>Response Time:</strong> We will respond to privacy requests within 30 days 
                (or as required by applicable law).
              </p>
              
              <p className="text-sm text-slate-600 mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}