import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Heart } from "lucide-react";

export default function LegalDisclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Legal Disclaimer</h1>
          <p className="text-lg text-slate-600">
            Important information about EMDRise and your therapeutic journey
          </p>
        </div>

        <div className="space-y-6">
          {/* Emergency Notice */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="mr-2 h-6 w-6" />
                Emergency Situations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-red-700">
              <p className="mb-4">
                <strong>If you are experiencing a mental health emergency or having thoughts of self-harm:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact emergency services immediately (911 in the US, 999 in the UK)</li>
                <li>Go to your nearest emergency room</li>
                <li>Call the National Suicide Prevention Lifeline: 988 (US) or 116 123 (UK Samaritans)</li>
                <li>Contact your mental health professional immediately</li>
              </ul>
              <p className="mt-4 font-semibold">
                EMDRise is not a substitute for emergency mental health services.
              </p>
            </CardContent>
          </Card>

          {/* Not a Substitute for Professional Care */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Not a Substitute for Professional Mental Health Care
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EMDRise is designed as a supplementary therapeutic tool and is <strong>not a replacement</strong> 
                for professional mental health treatment, therapy, or medical care. Our platform provides:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Guided EMDR-based exercises and bilateral stimulation tools</li>
                <li>Educational resources about trauma processing</li>
                <li>Self-guided therapeutic techniques</li>
                <li>Progress tracking and journaling capabilities</li>
              </ul>
              <p>
                <strong>We strongly recommend:</strong> Working with a qualified mental health professional, 
                especially when dealing with trauma, PTSD, or other serious mental health conditions.
              </p>
            </CardContent>
          </Card>

          {/* Qualifications and Limitations */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Qualifications and Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EMDRise is developed based on established EMDR therapy principles, but:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The virtual therapist guidance is not provided by a licensed mental health professional</li>
                <li>We do not diagnose, treat, cure, or prevent any mental health conditions</li>
                <li>Individual results may vary significantly</li>
                <li>Some users may experience increased distress during trauma processing</li>
                <li>The platform is not suitable for all mental health conditions or trauma types</li>
              </ul>
            </CardContent>
          </Card>

          {/* Medical Advice Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Advice Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The information provided through EMDRise is for educational and informational purposes only. 
                It is not intended as medical advice, diagnosis, or treatment. Always seek the advice of 
                qualified mental health professionals regarding any mental health concerns.
              </p>
              <p>
                <strong>Do not disregard professional medical advice</strong> or delay seeking treatment 
                because of information accessed through EMDRise.
              </p>
            </CardContent>
          </Card>

          {/* Age and Capacity Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Age and Capacity Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>EMDRise is intended for use by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Adults aged 18 and over</li>
                <li>Individuals with the mental capacity to consent to participate</li>
                <li>Users who can safely engage with trauma-related content</li>
              </ul>
              <p>
                <strong>Parental supervision and professional guidance</strong> are required for users under 18.
              </p>
            </CardContent>
          </Card>

          {/* Potential Risks */}
          <Card>
            <CardHeader>
              <CardTitle>Potential Risks and Side Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                While EMDR techniques can be beneficial, they may also involve risks, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Temporary increase in emotional distress</li>
                <li>Vivid dreams or memories</li>
                <li>Emotional flooding or overwhelming feelings</li>
                <li>Physical sensations or discomfort</li>
                <li>Disruption of daily functioning</li>
              </ul>
              <p>
                <strong>If you experience severe distress:</strong> Stop using the platform immediately 
                and contact a mental health professional.
              </p>
            </CardContent>
          </Card>

          {/* Data and Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Data Security and Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                While we implement security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No system is completely secure from data breaches</li>
                <li>We cannot guarantee absolute confidentiality</li>
                <li>Your session notes and progress data are stored digitally</li>
                <li>Consider the sensitivity of information you choose to record</li>
              </ul>
              <p>
                See our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> 
                for detailed information about data handling.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EMDRise and its creators, to the fullest extent permitted by law, disclaim all liability for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any adverse effects from using the platform</li>
                <li>Decisions made based on platform content</li>
                <li>Technical failures or service interruptions</li>
                <li>Data loss or security breaches</li>
                <li>Any indirect, incidental, or consequential damages</li>
              </ul>
            </CardContent>
          </Card>

          {/* Informed Consent */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Heart className="mr-2 h-5 w-5" />
                Your Consent and Well-being
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-700 space-y-4">
              <p>
                By using EMDRise, you acknowledge that you have read, understood, and agree to this disclaimer. 
                You confirm that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You understand the limitations and risks of the platform</li>
                <li>You will seek professional help when needed</li>
                <li>You will not use the platform during mental health emergencies</li>
                <li>You take responsibility for your own well-being and safety</li>
              </ul>
              <p className="font-semibold">
                Your mental health and safety are our top priority. Please use EMDRise responsibly 
                and in conjunction with appropriate professional support.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Questions or Concerns</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you have questions about this disclaimer or concerns about using EMDRise, 
                please contact us at: <a href="mailto:legal@emdrise.com" className="text-blue-600 hover:underline">legal@emdrise.com</a>
              </p>
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