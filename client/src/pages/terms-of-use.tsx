import React from 'react';
import { Logo } from '@/components/ui/logo';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen py-8 px-4" style={{background: 'linear-gradient(135deg, var(--therapeutic-bg), var(--safe-space))'}}>
      <div className="max-w-4xl mx-auto">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Logo variant="hero" className="mx-auto mb-4" />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-blue text-center mb-4">
              Terms of Use
            </h1>
            <p className="text-center text-slate-600 mb-8 text-lg">
              <strong>Last updated: 7 September 2025</strong>
            </p>

            <div className="space-y-8 text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">1. Introduction & Acceptance</h2>
                <p>
                  These Terms of Use ("Terms") constitute a legally binding agreement between you and GC Psychotherapy (we, us, our), a company registered in the United Kingdom, governing your access and use of EMDRise — our mobile and web application offering self‑guided EMDR therapy sessions. By accessing or using our services, you confirm that you are at least 18 years old or of legal age in your jurisdiction and that you have read, understood, and agree to these Terms and to our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">2. Eligibility & Age Restrictions</h2>
                <p>
                  You must be at least 18 years old (or older if required by the laws of your jurisdiction) to use EMDRise. If you are under 18, your parent or guardian must consent to your use. We do not knowingly collect data from children under 16. If we discover that a minor has provided us with personal data, we will delete that data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">3. Description of the Services</h2>
                <p>
                  EMDRise provides guided Eye Movement Desensitisation and Reprocessing (EMDR) sessions via professionally recorded videos, bilateral stimulation (visual, auditory, haptic) and intelligent session management that allows you to pause and resume. The application follows the standard ten‑phase EMDR protocol and offers a choice of virtual therapists. Our services are delivered for general informational and self‑help purposes only. They are not a substitute for professional medical or mental health care and should be used in conjunction with, not instead of, appropriate professional support.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">4. Medical Disclaimer</h2>
                <p className="mb-4">
                  EMDRise does not provide medical or mental health advice and is not intended for the provision of clinical diagnosis or for use in emergencies. The application is not designed for situations where your life or safety or that of others is at immediate risk; if you are thinking of suicide, considering harming yourself or others, or experiencing a medical emergency, you must immediately contact emergency services in your local area. You should never disregard the advice of a qualified healthcare professional or delay in seeking it because of something you have experienced or learned through EMDRise.
                </p>
                <p className="font-medium text-slate-800">
                  By using EMDRise, you acknowledge that you understand these limitations and accept full responsibility for your use of the application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">5. Account Registration & Subscription</h2>
                <p className="mb-4">
                  To access certain features of EMDRise, you must create an account and maintain an active subscription. By creating an account, you agree to provide accurate and complete information and to maintain the confidentiality of your login credentials.
                </p>
                <p className="mb-4">
                  <strong className="text-slate-800">Billing and Renewal.</strong> Your subscription will continue and automatically renew unless canceled. You consent to our charging your payment method on a recurring basis without requiring your prior approval for each recurring charge, until such time as you cancel the applicable order. The length of your billing cycle will depend on the type of subscription plan you choose when you subscribed to the Services.
                </p>
                <p className="mb-4">
                  <strong className="text-slate-800">Free Trial.</strong> We may offer a free trial to new users who register. Unless canceled before the end of the free trial period, your account will be charged according to the subscription plan you selected when you registered. The length of the free trial and subscription pricing are displayed at the time of sign-up.
                </p>
                <p className="mb-4">
                  <strong className="text-slate-800">Cancellation.</strong> You can cancel your subscription at any time by logging into your account. Your cancellation will take effect at the end of the current paid term. If you have any questions or are unsatisfied with our Services, please contact us at{' '}
                  <a href="mailto:support@emdrise.com" className="text-primary-blue underline">support@emdrise.com</a>.
                </p>
                <p className="mb-4">
                  <strong className="text-slate-800">Fee Changes.</strong> We may, from time to time, make changes to the subscription fee and will communicate any price changes to you in accordance with applicable law.
                </p>
                <p>
                  <strong className="text-slate-800">Refunds Policy.</strong> All sales are final and no refund will be issued.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">6. Limited License & Acceptable Use</h2>
                <p className="mb-4">
                  We grant you a limited, non‑exclusive, non‑transferable licence to download and use EMDRise on your personal devices for your own non‑commercial use. You may not modify, reverse engineer, copy, sell, or distribute any part of the application or its content. You may not use EMDRise to post or transmit unlawful, harmful, abusive or infringing content, or to interfere with the operation of our systems. We reserve the right to terminate this licence if you violate these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">7. Ownership & Intellectual Property</h2>
                <p>
                  All content, trademarks, logos, videos, scripts, software, and materials provided through EMDRise are owned by GC Psychotherapy or its licensors and are protected by copyright and other intellectual property laws. You acknowledge that you do not acquire any ownership rights through your use of EMDRise and agree not to reproduce, alter, or create derivative works based on our content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">8. AI Features & Future Development</h2>
                <p>
                  EMDRise may incorporate artificial intelligence features in future releases to personalise your experience. Such features will not provide clinical diagnoses or decisions. We may process de‑identified or aggregated session data to train and improve AI models, but personal or health data will never be sold or used for advertising. We will update our Privacy Policy to describe any new data processing and obtain your consent where required.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">9. Third‑Party Services & External Links</h2>
                <p>
                  Our services rely on third‑party providers for hosting (Supabase, Neon), authentication (Supabase Authentication), payment processing (RevenueCat and Apple), and video streaming. These services have their own terms and privacy policies. We have not reviewed all of the sites linked to EMDRise and are not responsible for the content of any linked site; the inclusion of a link does not imply endorsement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">10. Disclaimers & Limitation of Liability</h2>
                <p className="mb-4">
                  EMDRise is provided "as is" without any warranties, expressed or implied. To the fullest extent permitted by law, we expressly disclaim all warranties, including implied warranties of merchantability, fitness for a particular purpose, and non‑infringement. Your use of the application is at your own risk. We do not warrant that EMDRise will meet your requirements or that the service will be uninterrupted, timely, or error‑free.
                </p>
                <p className="font-medium text-slate-800">
                  In no event shall GC Psychotherapy, its directors, employees, partners, agents, suppliers or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of your use of EMDRise, even if we have been advised of the possibility of such damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">11. Indemnification</h2>
                <p>
                  You agree to indemnify, defend and hold harmless GC Psychotherapy and its affiliates, directors, employees and agents from any claims, damages, liabilities, and expenses arising out of or related to your use of EMDRise, your violation of these Terms, or your infringement of any rights of another.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">12. Governing Law & Dispute Resolution</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales. If you are a consumer residing outside the UK, you may have additional rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">13. Changes to Terms</h2>
                <p>
                  We may modify these Terms from time to time. Material changes will be posted within the application or on our website, and the date of the latest update will be indicated. Your continued use of EMDRise after the changes take effect constitutes your acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">14. Contact Information</h2>
                <p>
                  If you have any questions or concerns about these Terms, please contact us at:
                  <br />
                  <strong className="text-primary-blue text-lg">support@emdrise.com</strong>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}