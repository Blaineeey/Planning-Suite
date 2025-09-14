import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { FileText, DollarSign, Calendar, User, Hash } from 'lucide-react';

export default function ProposalForm({ isOpen, onClose, onSubmit, proposal = null, leads = [] }) {
  const [formData, setFormData] = useState({
    leadId: proposal?.leadId || '',
    title: proposal?.title || '',
    number: proposal?.number || `PROP-${Date.now()}`,
    status: proposal?.status || 'DRAFT',
    validUntil: proposal?.validUntil || '',
    lineItems: proposal?.lineItems || [
      { description: '', quantity: 1, price: 0 }
    ],
    taxRate: proposal?.taxRate || 0,
    discount: proposal?.discount || 0,
    terms: proposal?.terms || '',
    notes: proposal?.notes || ''
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

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...formData.lineItems];
    newLineItems[index][field] = field === 'description' ? value : parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, lineItems: newLineItems }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      const newLineItems = formData.lineItems.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, lineItems: newLineItems }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );
    const tax = subtotal * (parseFloat(formData.taxRate) / 100 || 0);
    const total = subtotal + tax - (parseFloat(formData.discount) || 0);
    
    return { subtotal, tax, total };
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.leadId && !proposal) newErrors.leadId = 'Please select a lead';
    if (!formData.validUntil) newErrors.validUntil = 'Valid until date is required';
    
    const hasEmptyLineItems = formData.lineItems.some(item => !item.description);
    if (hasEmptyLineItems) newErrors.lineItems = 'All line items must have descriptions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const totals = calculateTotals();
      onSubmit({
        ...formData,
        ...totals,
        taxRate: parseFloat(formData.taxRate) || 0,
        discount: parseFloat(formData.discount) || 0
      });
    }
  };

  const totals = calculateTotals();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={proposal ? 'Edit Proposal' : 'Create New Proposal'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposal Number
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
                <option value="SENT">Sent</option>
                <option value="VIEWED">Viewed</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>
          </div>

          {!proposal && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Lead *
              </label>
              <select
                name="leadId"
                value={formData.leadId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 ${
                  errors.leadId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a lead...</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.firstName} {lead.lastName} - {lead.email}
                  </option>
                ))}
              </select>
              {errors.leadId && (
                <p className="text-xs text-red-500 mt-1">{errors.leadId}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposal Title *
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
                placeholder="Wedding Planning Services Proposal"
              />
            </div>
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid Until *
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 ${
                  errors.validUntil ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.validUntil && (
              <p className="text-xs text-red-500 mt-1">{errors.validUntil}</p>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Line Items
            </label>
            <button
              type="button"
              onClick={addLineItem}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              + Add Item
            </button>
          </div>
          
          {errors.lineItems && (
            <p className="text-xs text-red-500 mb-2">{errors.lineItems}</p>
          )}
          
          <div className="space-y-2">
            {formData.lineItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Service description"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Qty"
                  min="1"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="Price"
                  min="0"
                  step="0.01"
                />
                <span className="w-24 text-right text-gray-700">
                  ${(item.quantity * item.price).toFixed(2)}
                </span>
                {formData.lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900">${totals.subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Tax:</span>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-gray-900"
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
              <span className="text-gray-600">%</span>
            </div>
            <span className="font-medium text-gray-900">${totals.tax.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Discount:</span>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-gray-900"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <span className="font-medium text-gray-900">-${(parseFloat(formData.discount) || 0).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span className="text-purple-600">${totals.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Terms and Notes */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terms & Conditions
            </label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="Payment terms, cancellation policy, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Internal Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="Notes for your team (not visible to client)"
            />
          </div>
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
            {proposal ? 'Update Proposal' : 'Create Proposal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}