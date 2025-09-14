import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { FileText, Hash, Calendar, User } from 'lucide-react';

export default function ContractForm({ isOpen, onClose, onSubmit, contract = null, proposals = [] }) {
  const [formData, setFormData] = useState({
    proposalId: contract?.proposalId || '',
    number: contract?.number || `CONTRACT-${Date.now()}`,
    title: contract?.title || '',
    status: contract?.status || 'DRAFT',
    content: contract?.content || '',
    terms: contract?.terms || '',
    signedAt: contract?.signedAt || '',
    clientName: contract?.clientName || '',
    clientEmail: contract?.clientEmail || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.content) newErrors.content = 'Contract content is required';
    if (!formData.clientName) newErrors.clientName = 'Client name is required';
    if (!formData.clientEmail) newErrors.clientEmail = 'Client email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Default contract template
  const contractTemplates = {
    standard: `WEDDING PLANNING SERVICES AGREEMENT

This Agreement is entered into on [DATE] between [PLANNER NAME] ("Planner") and [CLIENT NAME] ("Client").

1. SERVICES
The Planner agrees to provide the following wedding planning services:
- Full wedding planning and coordination
- Vendor management and coordination
- Timeline creation and management
- Day-of coordination
- Budget management assistance

2. COMPENSATION
Client agrees to pay Planner a total fee of $[AMOUNT] for the services described above.
Payment Schedule:
- 50% deposit upon signing: $[AMOUNT]
- 25% payment 60 days before event: $[AMOUNT]
- 25% final payment 14 days before event: $[AMOUNT]

3. CANCELLATION POLICY
- Cancellation more than 90 days before event: 50% refund of paid amounts
- Cancellation 30-90 days before event: 25% refund of paid amounts
- Cancellation less than 30 days before event: No refund

4. LIABILITY
Planner's liability is limited to the total amount paid by Client under this Agreement.

5. GOVERNING LAW
This Agreement shall be governed by the laws of [STATE].

By signing below, both parties acknowledge and agree to the terms of this Agreement.

CLIENT SIGNATURE: _____________________  DATE: __________

PLANNER SIGNATURE: ___________________  DATE: __________`,
    
    simple: `WEDDING PLANNING AGREEMENT

Client: [CLIENT NAME]
Planner: [PLANNER NAME]
Event Date: [DATE]
Services: Full wedding planning and coordination
Total Fee: $[AMOUNT]
Payment Terms: 50% deposit, balance due 14 days before event

Both parties agree to the terms stated above.

CLIENT: _____________________  DATE: __________
PLANNER: ___________________  DATE: __________`
  };

  const loadTemplate = (templateKey) => {
    setFormData(prev => ({
      ...prev,
      content: contractTemplates[templateKey]
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contract ? 'Edit Contract' : 'Create New Contract'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Number
              </label>
              <div className="relative">
                <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent for Signature</option>
                <option value="SIGNED">Signed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {proposals.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link to Proposal (Optional)
              </label>
              <select
                name="proposalId"
                value={formData.proposalId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                <option value="">No linked proposal</option>
                {proposals.map(proposal => (
                  <option key={proposal.id} value={proposal.id}>
                    {proposal.number} - {proposal.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contract Title *
            </label>
            <div className="relative">
              <FileText size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Wedding Planning Services Contract"
              />
            </div>
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 ${
                    errors.clientName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.clientName && (
                <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Email *
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 ${
                  errors.clientEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="client@example.com"
              />
              {errors.clientEmail && (
                <p className="text-xs text-red-500 mt-1">{errors.clientEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contract Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Contract Content *
            </label>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => loadTemplate('standard')}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Load Standard Template
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('simple')}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Load Simple Template
              </button>
            </div>
          </div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={12}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 font-mono text-sm ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter contract content or load a template..."
          />
          {errors.content && (
            <p className="text-xs text-red-500 mt-1">{errors.content}</p>
          )}
        </div>

        {/* Additional Terms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Terms & Conditions
          </label>
          <textarea
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
            placeholder="Any additional terms specific to this contract..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
          >
            {contract ? 'Update Contract' : 'Create Contract'}
          </button>
          {formData.status === 'DRAFT' && !contract && (
            <button
              type="button"
              onClick={() => {
                if (validate()) {
                  onSubmit({ ...formData, sendForSignature: true });
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700"
            >
              Create & Send for Signature
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}