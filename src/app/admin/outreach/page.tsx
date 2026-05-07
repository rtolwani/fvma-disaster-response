'use client';

import { useState } from 'react';
import { Phone, Mail, MessageSquare, Users, Send, Clock, CheckCircle } from 'lucide-react';

export default function OutreachPage() {
  const [selectedChannels, setSelectedChannels] = useState({
    voice: false,
    sms: false,
    email: false,
  });

  const [audience, setAudience] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);

  const templates = {
    voice: [
      {
        id: 'emergency-checkin',
        name: 'Emergency Check-In',
        content: `Hello, this is Sarah from FVMA Emergency Coordination. We're checking on all Florida veterinary clinics during [EVENT_NAME].

Press 1 if you are SAFE and OPERATING.
Press 2 if you are SAFE but CLOSED.
Press 3 if you NEED ASSISTANCE.
Press 4 if you are UNSAFE or EVACUATING.

[If 3 or 4] Please stay on the line to speak with our triage system.`,
      },
      {
        id: 'followup',
        name: 'Follow-Up Call',
        content: `Hi Dr. [NAME], this is Sarah from FVMA. We haven't received your emergency check-in response yet. Please press 1 to confirm you're safe, or press 3 if you need assistance.`,
      },
    ],
    sms: [
      {
        id: 'emergency-sms',
        name: 'Emergency SMS',
        content: `Hi Dr. Smith, FVMA emergency check-in for [EVENT_NAME]. Are you safe and operational? Reply: 1=Safe/Operating, 2=Safe/Closed, 3=Need Help, 4=Unsafe. Reply STOP to opt out.`,
      },
      {
        id: 'reminder-sms',
        name: 'Reminder SMS',
        content: `FVMA Reminder: Please respond to our emergency check-in. Reply: 1=Safe, 3=Need Help. Your response helps us coordinate aid.`,
      },
    ],
    email: [
      {
        id: 'emergency-email',
        name: 'Emergency Email Survey',
        content: `<p>Dear Dr. [NAME],</p>

<p>The Florida Veterinary Medical Association is checking on all veterinary clinics during <strong>[EVENT_NAME]</strong>.</p>

<p>Please click the button below to complete a brief 2-minute survey about:</p>
<ul>
  ✓ Clinic status (operational/closed)<br/>
  ✓ Staff safety<br/>
  ✓ Supply needs<br/>
  ✓ Animal welfare concerns
</ul>

<p style="text-align: center; margin: 30px 0;">
  <a href="[SURVEY_LINK]" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Complete Survey</a>
</p>

<p>If you need immediate assistance, call our emergency line: <strong>(555) 123-4567</strong></p>

<p>Stay safe,<br/>FVMA Emergency Coordination Team</p>

<hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;"/>
<p style="font-size: 12px; color: #666;">Disaster Response Technology provided by dvmSuccess | dvm.com</p>`,
      },
    ],
  };

  const audienceOptions = [
    { id: 'all', label: 'All Clinics', count: 1200, description: 'Send to all 1,200+ Florida clinics' },
    { id: 'non-responders', label: 'Non-Responders', count: 350, description: 'Clinics that haven\'t responded yet' },
    { id: 'county', label: 'By County', count: 0, description: 'Select specific counties' },
    { id: 'ce-optin', label: 'CE Opt-In Only', count: 945, description: 'Clinics opted in for communications' },
  ];

  const handleLaunch = () => {
    if (!selectedChannels.voice && !selectedChannels.sms && !selectedChannels.email) {
      alert('Please select at least one channel (Voice, SMS, or Email)');
      return;
    }

    const totalRecipients = audienceOptions.find(a => a.id === audience)?.count || 0;
    const channels = [];
    if (selectedChannels.voice) channels.push('Voice');
    if (selectedChannels.sms) channels.push('SMS');
    if (selectedChannels.email) channels.push('Email');

    if (!confirm(`Launch ${channels.join(', ')} campaign to ${totalRecipients} clinics?\n\nThis will start sending immediately.`)) {
      return;
    }

    setIsLaunching(true);
    // Simulate launch
    setTimeout(() => {
      setIsLaunching(false);
      alert('Campaign launched successfully! Monitoring dashboard will show real-time responses.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Outreach Campaign</h1>
              <p className="text-sm text-gray-600 mt-1">Launch multi-channel emergency communications</p>
            </div>
            <a href="/" className="text-sm text-blue-600 hover:text-blue-700">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Select Channels */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Select Communication Channels</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Voice */}
            <label className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedChannels.voice 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="checkbox"
                checked={selectedChannels.voice}
                onChange={(e) => setSelectedChannels(prev => ({ ...prev, voice: e.target.checked }))}
                className="absolute top-3 right-3 w-5 h-5"
              />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Voice</p>
                  <p className="text-xs text-gray-600">AI phone calls (Bland.ai)</p>
                </div>
              </div>
            </label>

            {/* SMS */}
            <label className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedChannels.sms 
                ? 'border-green-600 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="checkbox"
                checked={selectedChannels.sms}
                onChange={(e) => setSelectedChannels(prev => ({ ...prev, sms: e.target.checked }))}
                className="absolute top-3 right-3 w-5 h-5"
              />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">SMS</p>
                  <p className="text-xs text-gray-600">Text messages (Twilio)</p>
                </div>
              </div>
            </label>

            {/* Email */}
            <label className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedChannels.email 
                ? 'border-purple-600 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="checkbox"
                checked={selectedChannels.email}
                onChange={(e) => setSelectedChannels(prev => ({ ...prev, email: e.target.checked }))}
                className="absolute top-3 right-3 w-5 h-5"
              />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-xs text-gray-600">Detailed surveys (SendGrid)</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Step 2: Select Audience */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Select Audience</h2>
          <div className="space-y-3">
            {audienceOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  audience === option.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="audience"
                    checked={audience === option.id}
                    onChange={() => setAudience(option.id)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                {option.count > 0 && (
                  <span className="text-sm font-medium text-gray-700">
                    {option.count.toLocaleString()} clinics
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: Choose Template */}
        {(selectedChannels.voice || selectedChannels.sms || selectedChannels.email) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Choose Message Template</h2>
            
            {selectedChannels.voice && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Voice Templates
                </h3>
                <select
                  value={selectedTemplate === 'voice' ? selectedTemplate : ''}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    if (e.target.value.startsWith('voice-')) {
                      setCustomMessage(templates.voice.find(t => t.id === e.target.value.replace('voice-', ''))?.content || '');
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a template...</option>
                  {templates.voice.map(template => (
                    <option key={template.id} value={`voice-${template.id}`}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedChannels.sms && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> SMS Templates
                </h3>
                <select
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    setCustomMessage(templates.sms.find(t => t.id === e.target.value)?.content || '');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a template...</option>
                  {templates.sms.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedChannels.email && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Templates
                </h3>
                <select
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    setCustomMessage(templates.email.find(t => t.id === e.target.value)?.content || '');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a template...</option>
                  {templates.email.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message Preview/Editor */}
            {customMessage && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Message Preview</h3>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={selectedChannels.email ? 12 : 4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {selectedChannels.sms && `${customMessage.length}/160 characters`}
                  {selectedChannels.voice && 'Variables: [EVENT_NAME], [NAME]'}
                  {selectedChannels.email && 'HTML supported. Variables: [EVENT_NAME], [NAME], [SURVEY_LINK]'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Launch */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Launch Campaign</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600">Recipients:</p>
              <p className="text-2xl font-bold text-gray-900">
                {audienceOptions.find(a => a.id === audience)?.count.toLocaleString() || 0} clinics
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Channels:</p>
              <div className="flex gap-2 mt-1">
                {selectedChannels.voice && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    Voice
                  </span>
                )}
                {selectedChannels.sms && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    SMS
                  </span>
                )}
                {selectedChannels.email && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                    Email
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleLaunch}
            disabled={isLaunching || !customMessage}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLaunching ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Launching...
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                Launch Campaign
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By launching, you agree to FVMA's communication policies. Recipients can opt out anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
