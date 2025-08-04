
import React from 'react';
import { Logo } from '@/components/ui/logo';

export default function TermsOfUse() {
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
              Terms &amp; Conditions – EMDRise
            </h1>
            <p className="text-center text-slate-600 mb-8 text-lg">
              <strong>Last updated: 04.08.2025</strong>
            </p>

            <div className="space-y-8 text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">1. Purpose of EMDRise</h2>
                <p>
                  EMDRise is a self‑guided EMDR‑based tool designed to support emotional processing
                  and personal well‑being. It is not a substitute for professional mental health
                  care, diagnosis, or treatment. If you are experiencing a mental health emergency
                  or crisis, call emergency services (e.g., 999 in the UK, 911 in the US) or seek
                  professional help immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">2. Eligibility</h2>
                <ul className="space-y-2 ml-6">
                  <li className="flex"><span className="text-[#1E90FF] mr-2">•</span>You are 18 years or older and able to consent; OR</li>
                  <li className="flex"><span className="text-[#1E90FF] mr-2">•</span>You are under 18 and using the app with parental supervision and professional guidance.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">3. Subscriptions, Payments, and Refunds</h2>
                <ul className="space-y-3 ml-6">
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>Subscription pricing is displayed at the point of purchase.</span>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>Payments are processed via Apple App Store, Google Play Store, or Stripe.</span>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>All payments are final and non‑refundable, except as required by law or by Apple/Google policies.</span>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>Subscriptions auto‑renew unless canceled in your App Store or Google Play settings before the renewal date.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">4. User Responsibilities</h2>
                <ul className="space-y-3 ml-6">
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>Use the app responsibly and in a safe environment.</span>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>Stop any session immediately if you experience severe distress and contact a mental health professional if needed.</span>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>Do not use EMDRise in emergencies or situations requiring urgent mental health intervention.</span>
                  </li>
                </ul>
                <p className="mt-4 font-medium text-slate-800">You are solely responsible for your well‑being and safety while using EMDRise.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">5. Disclaimer and Waiver of Liability</h2>
                <p className="mb-4">
                  By using EMDRise, you acknowledge and agree that:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>No medical advice is provided by the app.</span>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>Results may vary; some users may experience emotional discomfort, vivid dreams, or temporary distress.</span>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>You assume full responsibility for your use of the app and its exercises.</span>
                  </li>
                  <li className="flex">
                    <span className="text-[#1E90FF] mr-2">•</span>
                    <span>EMDRise disclaims all liability to the fullest extent permitted by law for emotional or physical reactions, decisions made based on the app, or data loss and technical failures.</span>
                  </li>
                </ul>
                <p className="mt-4 font-medium text-slate-800">
                  If you experience severe distress or a medical emergency, stop using EMDRise and seek professional help immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">6. Data and Privacy</h2>
                <p>
                  We process your personal information according to our Privacy Policy. By using the
                  app, you consent to our data handling practices as described in that policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">7. Intellectual Property</h2>
                <p>
                  EMDRise and its content are the intellectual property of EMDRise and its licensors.
                  You may not copy, distribute, or modify the app or its content without our prior
                  written consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">8. Termination of Access</h2>
                <p>
                  We may suspend or terminate your access if you violate these Terms, or remove
                  content and accounts at our discretion to maintain safety and compliance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">9. Governing Law</h2>
                <p>
                  These Terms are governed by the laws of England and Wales, without regard to
                  conflict of law principles.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">10. Contact</h2>
                <p>
                  For any questions or concerns about these Terms, contact:
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
