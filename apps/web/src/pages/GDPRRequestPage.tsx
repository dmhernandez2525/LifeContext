import { useState } from 'react';
import { Mail, Copy, Check, Clock, AlertCircle, FileText } from 'lucide-react';
import { GDPR_TEMPLATES, getAllCategories, type PlatformTemplate } from '@/data/gdpr-templates';
import { useDataReclamationStore } from '@/store/data-reclamation-store';
import { cn } from '@/lib/utils';

export default function GDPRRequestPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformTemplate | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const { gdprRequests, addGDPRRequest } = useDataReclamationStore();

  const categories = ['All', ...getAllCategories()];
  const filteredTemplates = selectedCategory === 'All' 
    ? GDPR_TEMPLATES 
    : GDPR_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleMarkAsSent = (platform: PlatformTemplate) => {
    addGDPRRequest({
      id: crypto.randomUUID(),
      platform: platform.name,
      email: platform.email,
      sentDate: new Date(),
      status: 'pending',
    });
    setSelectedPlatform(null);
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          GDPR Data Requests
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
          Request your data from major platforms. We provide the templates, you send the emails.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-6 rounded-2xl mb-8">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">How This Works</h3>
            <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
              <li>Select a platform below</li>
              <li>Copy the pre-written GDPR email template</li>
              <li>Send from YOUR email to the platform's privacy team</li>
              <li>Wait 7-45 days for response (varies by company)</li>
              <li>Upload the received data when it arrives</li>
            </ol>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">
              <strong>Legal Note</strong>: You send emails yourself to remain GDPR compliant. We don't auto-send.
            </p>
          </div>
        </div>
      </div>

      {/* Active Requests Tracker */}
      {gdprRequests.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Your Active Requests ({gdprRequests.length})
          </h2>
          <div className="space-y-3">
            {gdprRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{req.platform}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sent: {req.sentDate.toLocaleDateString()}
                  </p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  req.status === 'pending' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
                  req.status === 'received' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                )}>
                  {req.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full font-medium transition-all",
              selectedCategory === cat
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Platform Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((platform) => (
          <button
            key={platform.name}
            onClick={() => setSelectedPlatform(platform)}
            className="text-left p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:scale-105"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{platform.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{platform.category}</p>
              </div>
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
              <Clock className="w-4 h-4" />
              <span>{platform.expectedResponseTime}</span>
            </div>
            {platform.notes && (
              <p className="text-xs text-gray-500 dark:text-gray-500 italic">{platform.notes}</p>
            )}
          </button>
        ))}
      </div>

      {/* Modal for Selected Platform */}
      {selectedPlatform && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setSelectedPlatform(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPlatform.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">GDPR Data Request Template</p>
              </div>
              <button 
                onClick={() => setSelectedPlatform(null)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Email To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email To:
                </label>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={selectedPlatform.email}
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3"
                  />
                  <button 
                    onClick={() => handleCopy(selectedPlatform.email, 'email')}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    {copiedField === 'email' ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject Line:
                </label>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={selectedPlatform.subject}
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3"
                  />
                  <button 
                    onClick={() => handleCopy(selectedPlatform.subject, 'subject')}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    {copiedField === 'subject' ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Body:
                  </label>
                  <button 
                    onClick={() => handleCopy(selectedPlatform.body, 'body')}
                    className="text-sm text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 hover:underline"
                  >
                    {copiedField === 'body' ? (
                      <><Check className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy Body</>
                    )}
                  </button>
                </div>
                <textarea 
                  readOnly 
                  value={selectedPlatform.body}
                  rows={12}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-mono text-sm"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handleMarkAsSent(selectedPlatform)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Mark as Sent
                </button>
                <button 
                  onClick={() => setSelectedPlatform(null)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
