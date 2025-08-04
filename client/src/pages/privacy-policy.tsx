import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Privacy Policy – EMDRise</h1>
      <p><strong>Last updated: 04.08.2025</strong></p>

      <p>
        EMDRise ("we," "our," "us") is committed to protecting your privacy and handling
        your personal information responsibly. By using the EMDRise mobile app and any
        related services (collectively, the "Services"), you agree to the terms of this
        Privacy Policy.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account Information:</strong> Email address and any details you provide when creating an account.</li>
        <li><strong>Therapeutic Data:</strong> Self‑entered session notes, progress tracking, and reflections (sensitive personal data).</li>
        <li><strong>Technical and Usage Data:</strong> Device type, operating system, app version, anonymized usage analytics, IP address, and approximate location.</li>
        <li><strong>Payment Information:</strong> Processed via Apple App Store, Google Play Store, or Stripe. We do not store your card details.</li>
        <li><strong>Communications:</strong> If you opt in, we may send account updates, reminders, or follow‑ups via email or in‑app notifications.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide and maintain the EMDRise app</li>
        <li>Securely store your session history and progress</li>
        <li>Respond to support requests and troubleshoot issues</li>
        <li>Communicate updates, reminders, or relevant information (if opted in)</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>3. Data Storage and Security</h2>
      <p>
        Your data is stored on <strong>Supabase</strong>, a GDPR‑compliant cloud platform.
        Data is encrypted in transit and at rest. While we take strong measures to protect
        your data, no system is completely secure. Enter sensitive information thoughtfully.
      </p>

      <h2>4. International Users and Data Transfers</h2>
      <p>
        We follow UK GDPR and EU GDPR principles. If you use EMDRise outside these regions,
        your information may be stored on servers located outside your country. By using
        the app, you consent to this transfer and processing of your data.
      </p>

      <h2>5. Data Retention and Deletion</h2>
      <p>
        We retain your data while your account is active or as required by law. You can
        request deletion of your data at any time by contacting
        <strong> support@emdrise.com</strong>.
      </p>

      <h2>6. Your Rights</h2>
      <ul>
        <li>Access the information we hold about you</li>
        <li>Request correction or deletion of your data</li>
        <li>Withdraw consent for processing (may limit functionality)</li>
      </ul>

      <h2>7. Children's Privacy</h2>
      <p>
        EMDRise is intended for users aged 18 and over. Users under 18 require parental
        supervision and professional guidance. We do not knowingly collect data from
        children under 13.
      </p>

      <h2>8. Data Breaches</h2>
      <p>
        If a breach affects your data, we will notify you and relevant authorities as
        required by law.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        We may update this policy to reflect changes in our practices or legal requirements.
        Material updates will be communicated in‑app or via email.
      </p>

      <h2>10. Contact</h2>
      <p>
        For any questions about this Privacy Policy, contact us at:
        <br />
        <strong>support@emdrise.com</strong>
      </p>
    </div>
  );
}