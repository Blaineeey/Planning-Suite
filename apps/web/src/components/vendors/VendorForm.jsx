import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Building, Mail, Phone, Globe, MapPin, DollarSign, Star, Tag } from 'lucide-react';

export default function VendorForm({ isOpen, onClose, onSubmit, vendor = null }) {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    category: vendor?.category || 'VENUE',
    contactName: vendor?.contactName || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    website: vendor?.website || '',
    address: vendor?.address || '',
    city: vendor?.city || '',
    state: vendor?.state || '',
    zip: vendor?.zip || '',
    priceRange: vendor?.priceRange || 'MODERATE',
    rating: vendor?.rating || 5,
    commission: vendor?.commission || '',
    notes: vendor?.notes || '',
    services: vendor?.services || [],
    preferredVendor: vendor?.preferredVendor || false,
    instagram: vendor?.instagram || '',
    portfolio: vendor?.portfolio || ''
  });

  const [errors, setErrors] = useState({});

  const vendorCategories = [
    'VENUE',
    'PHOTOGRAPHER',
    'VIDEOGRAPHER',
    'CATERING',
    'FLORIST',
    'DJ',
    'BAND',
    'CAKE',
    'MAKEUP',
    'HAIR',
    'PLANNER',
    'COORDINATOR',
    'RENTALS',
    'TRANSPORTATION',
    'OFFICIANT',
    'INVITATIONS',
    'FAVORS',
    'OTHER'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServicesChange = (e) => {
    const services = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, services }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Vendor name is required';
    if (!formData.email && !formData.phone) {
      newErrors.contact = 'At least one contact method is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        rating: parseInt(formData.rating),
        commission: formData.commission ? parseFloat(formData.commission) : null
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vendor ? 'Edit Vendor' : 'Add New Vendor'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor Name *
            </label>
            <div className="relative">
              <Building size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Vendor Business Name"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              {vendorCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase().replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="vendor@example.com"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="555-0123"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <div className="relative">
              <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {errors.contact && (
          <p className="text-xs text-red-500">{errors.contact}</p>
        )}

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="123 Main Street"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="New York"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="NY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP
            </label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="10001"
            />
          </div>
        </div>

        {/* Business Details */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="BUDGET">Budget ($)</option>
              <option value="MODERATE">Moderate ($$)</option>
              <option value="PREMIUM">Premium ($$$)</option>
              <option value="LUXURY">Luxury ($$$$)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div className="relative">
              <Star size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              >
                {[5,4,3,2,1].map(rating => (
                  <option key={rating} value={rating}>{rating} Stars</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commission %
            </label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="@vendorhandle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio Link
            </label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="https://portfolio.com"
            />
          </div>
        </div>

        {/* Services */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Services Offered
          </label>
          <div className="relative">
            <Tag size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="services"
              value={formData.services.join(', ')}
              onChange={handleServicesChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Service 1, Service 2, Service 3..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Separate services with commas</p>
        </div>

        {/* Preferred Vendor */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="preferredVendor"
            name="preferredVendor"
            checked={formData.preferredVendor}
            onChange={handleChange}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="preferredVendor" className="ml-2 text-sm text-gray-700">
            Mark as Preferred Vendor
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            placeholder="Additional notes about this vendor..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
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
            {vendor ? 'Update Vendor' : 'Add Vendor'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
