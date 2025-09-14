'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function GuestForm({ isOpen, onClose, onSubmit, guest = null, projectId }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    side: 'BOTH',
    rsvpStatus: 'PENDING',
    plusOne: false,
    plusOneName: '',
    ageGroup: 'ADULT',
    mealSelection: '',
    dietaryRestrictions: '',
    tableId: '',
    notes: ''
  });

  useEffect(() => {
    if (guest) {
      setFormData({
        firstName: guest.firstName || '',
        lastName: guest.lastName || '',
        email: guest.email || '',
        phone: guest.phone || '',
        side: guest.side || 'BOTH',
        rsvpStatus: guest.rsvpStatus || 'PENDING',
        plusOne: guest.plusOne || false,
        plusOneName: guest.plusOneName || '',
        ageGroup: guest.ageGroup || 'ADULT',
        mealSelection: guest.mealSelection || '',
        dietaryRestrictions: guest.dietaryRestrictions || '',
        tableId: guest.tableId || '',
        notes: guest.notes || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        side: 'BOTH',
        rsvpStatus: 'PENDING',
        plusOne: false,
        plusOneName: '',
        ageGroup: 'ADULT',
        mealSelection: '',
        dietaryRestrictions: '',
        tableId: '',
        notes: ''
      });
    }
  }, [guest]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, projectId });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {guest ? 'Edit Guest' : 'Add New Guest'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Side */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Side
                  </label>
                  <select
                    value={formData.side}
                    onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="BRIDE">Bride</option>
                    <option value="GROOM">Groom</option>
                    <option value="BOTH">Both</option>
                  </select>
                </div>

                {/* RSVP Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={formData.rsvpStatus}
                    onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                    <option value="MAYBE">Maybe</option>
                  </select>
                </div>

                {/* Age Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Group
                  </label>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="ADULT">Adult</option>
                    <option value="CHILD">Child</option>
                  </select>
                </div>

                {/* Meal Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meal Selection
                  </label>
                  <select
                    value={formData.mealSelection}
                    onChange={(e) => setFormData({ ...formData, mealSelection: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Meal</option>
                    <option value="Beef">Beef</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Fish">Fish</option>
                    <option value="Vegetarian">Vegetarian</option>
                  </select>
                </div>

                {/* Plus One */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.plusOne}
                        onChange={(e) => setFormData({ ...formData, plusOne: e.target.checked })}
                        className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Has Plus One</span>
                    </label>
                    
                    {formData.plusOne && (
                      <input
                        type="text"
                        placeholder="Plus One Name"
                        value={formData.plusOneName}
                        onChange={(e) => setFormData({ ...formData, plusOneName: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    )}
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                    placeholder="e.g., Vegetarian, Gluten-free, Nut allergy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-base font-medium text-white hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {guest ? 'Update Guest' : 'Add Guest'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
