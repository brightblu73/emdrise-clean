
import React from 'react';
import { Logo } from '@/components/ui/logo';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Logo variant="hero" className="mx-auto mb-4" />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E90FF] text-center mb-4">
              Privacy Policy – EMDRise
            </h1>
            <p className="text-center text-slate-600 mb-8 text-lg">
              <strong>Last updated: 04.08.2025</strong>
            </p>

            <div className="space-y-8 text-slate-700 leading-relaxed">
              <p className="text-lg">
                EMDRise ("we," "our," "us") is committed to protecting your privacy and handling
                your personal information responsibly. By using the EMDRise mobile app and any
                related services (collectively, the "Services"), you agree to the terms of this
                Privacy Policy.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">1. Information We Collect</h2>
                <ul className="space-y-3 ml-6">
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <div>
                      <strong className="text-slate-800">Account Information:</strong> Email address and any details you provide when creating an account.
                    </div>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <div>
                      <strong className="text-slate-800">Therapeutic Data:</strong> Self‑entered session notes, progress tracking, and reflections (sensitive personal data).
                    </div>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <div>
                      <strong className="text-slate-800">Technical and Usage Data:</strong> Device type, operating system, app version, anonymized usage analytics, IP address, and approximate location.
                    </div>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <div>
                      <strong className="text-slate-800">Payment Information:</strong> Processed via Apple App Store, Google Play Store, or Stripe. We do not store your card details.
                    </div>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <div>
                      <strong className="text-slate-800">Communications:</strong> If you opt in, we may send account updates, reminders, or follow‑ups via email or in‑app notifications.
                    </div>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">2. How We Use Your Information</h2>
                <ul className="space-y-2 ml-6">
                  <li className="flex"><span className="text-[#1E90FF] mr-2">•</span>Provide and maintain the EMDRise app</li>
                  <li className="flex"><span className="text-[#1E90FF] mr-2">•</span>Securely store your session history and progress</li>
                  <li className="flex"><span className="text-[#1E90FF] mr-2">•</span>Respond to support requests and troubleshoot issues</li>
                  <li className="flex"><span className="text-[#1E90FF] mr-2">•</span>Communicate updates, reminders, or relevant information (if opted in)</li>
                  <li className="flex"><span className="text-[#1E90FF] mr-2">•</span>Comply with legal obligations</li>
                </ul>
                <p className="mt-4 font-medium text-slate-800">We do not sell your personal information.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">3. Data Storage and Security</h2>
                <p>
                  Your data is stored on <strong className="text-slate-800">Supabase</strong>, a GDPR‑compliant cloud platform.
                  Data is encrypted in transit and at rest. While we take strong measures to protect
                  your data, no system is completely secure. Enter sensitive information thoughtfully.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">4. International Users and Data Transfers</h2>
                <p>
                  We follow UK GDPR and EU GDPR principles. If you use EMDRise outside these regions,
                  your information may be stored on servers located outside your country. By using
                  the app, you consent to this transfer and processing of your data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">5. Data Retention and Deletion</h2>
                <p>
                  We retain your data while your account is active or as required by law. You can
                  request deletion of your data at any time by contacting
                  <strong className="text-[#1E90FF]"> support@emdrise.com</strong>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">6. Your Rights</h2>
                <ul className="space-y-2 ml-6">
                  <li className="flex"><span className="text-[#1E90FF] mr-2">•</span>Access the information we hold about you</li>
                  <li className="flex"><span className="text-[#1E90FF] mr-2">•</span>Request correction or deletion of your data</li>
                  <li className="flex"><span className="text-[#1E90FF] mr-2">•</span>Withdraw consent for processing (may limit functionality)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">7. Children's Privacy</h2>
                <p>
                  EMDRise is intended for users aged 18 and over. Users under 18 require parental
                  supervision and professional guidance. We do not knowingly collect data from
                  children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">8. Data Breaches</h2>
                <p>
                  If a breach affects your data, we will notify you and relevant authorities as
                  required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">9. Changes to This Privacy Policy</h2>
                <p>
                  We may update this policy to reflect changes in our practices or legal requirements.
                  Material updates will be communicated in‑app or via email.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">10. Contact</h2>
                <p>
                  For any questions about this Privacy Policy, contact us at:
                  <br />
                  <strong className="text-[#1E90FF] text-lg">support@emdrise.com</strong>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
