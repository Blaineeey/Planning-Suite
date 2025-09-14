import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { DollarSign, Hash, Calendar, User, Mail, FileText } from 'lucide-react';

export default function InvoiceForm({ isOpen, onClose, onSubmit, invoice = null, projects = [] }) {
  const [formData, setFormData] = useState({
    projectId: invoice?.projectId || '',
    number: invoice?.number || `INV-${Date.now()}`,
    status: invoice?.status || 'DRAFT',
    dueDate: invoice?.dueDate || '',
    clientName: invoice?.clientName || '',
    clientEmail: invoice?.clientEmail || '',
    lineItems: invoice?.lineItems || [
      { description: '', quantity: 1, price: 0 }
    ],
    taxRate: invoice?.taxRate || 0,
    discount: invoice?.discount || 0,
    paymentTerms: invoice?.paymentTerms || 'Due upon receipt',
    notes: invoice?.notes || ''
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
    if (!formData.clientName) newErrors.clientName = 'Client name is required';
    if (!formData.clientEmail) newErrors.clientEmail = 'Client email is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    
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
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        balance: totals.total,
        amountPaid: 0,
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
      title={invoice ? 'Edit Invoice' : 'Create New Invoice'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number
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
                <option value="PAID">Paid</option>
                <option value="PARTIAL">Partially Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {projects.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project (Optional)
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                <option value="">No linked project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.dueDate && (
              <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>
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
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 ${
                    errors.clientEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="client@example.com"
                />
              </div>
              {errors.clientEmail && (
                <p className="text-xs text-red-500 mt-1">{errors.clientEmail}</p>
              )}
            </div>
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

        {/* Payment Terms and Notes */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Terms
            </label>
            <input
              type="text"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="Due upon receipt, Net 30, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes / Additional Information
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="Thank you for your business!"
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
            {invoice ? 'Update Invoice' : 'Create Invoice'}
          </button>
          {formData.status === 'DRAFT' && !invoice && (
            <button
              type="button"
              onClick={() => {
                if (validate()) {
                  onSubmit({ ...formData, status: 'SENT', sendNow: true });
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700"
            >
              Create & Send
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}