import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';

export default function BudgetTracker({ project, budget, onUpdate }) {
  const [categories, setCategories] = useState(budget?.categories || [
    { id: '1', name: 'Venue', planned: 15000, actual: 0, paid: 0 },
    { id: '2', name: 'Catering', planned: 12000, actual: 0, paid: 0 },
    { id: '3', name: 'Photography', planned: 3500, actual: 0, paid: 0 },
    { id: '4', name: 'Videography', planned: 2500, actual: 0, paid: 0 },
    { id: '5', name: 'Flowers', planned: 3000, actual: 0, paid: 0 },
    { id: '6', name: 'Music/DJ', planned: 1500, actual: 0, paid: 0 },
    { id: '7', name: 'Dress', planned: 2000, actual: 0, paid: 0 },
    { id: '8', name: 'Cake', planned: 800, actual: 0, paid: 0 },
    { id: '9', name: 'Invitations', planned: 500, actual: 0, paid: 0 },
    { id: '10', name: 'Favors', planned: 600, actual: 0, paid: 0 },
    { id: '11', name: 'Transportation', planned: 1000, actual: 0, paid: 0 },
    { id: '12', name: 'Miscellaneous', planned: 2000, actual: 0, paid: 0 }
  ]);

  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', planned: '', actual: '', paid: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const totalBudget = project?.budget || 50000;
  const totalPlanned = categories.reduce((sum, cat) => sum + (cat.planned || 0), 0);
  const totalActual = categories.reduce((sum, cat) => sum + (cat.actual || 0), 0);
  const totalPaid = categories.reduce((sum, cat) => sum + (cat.paid || 0), 0);
  const remaining = totalBudget - totalActual;
  const percentUsed = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.planned) {
      const category = {
        id: Date.now().toString(),
        name: newCategory.name,
        planned: parseFloat(newCategory.planned) || 0,
        actual: parseFloat(newCategory.actual) || 0,
        paid: parseFloat(newCategory.paid) || 0
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', planned: '', actual: '', paid: '' });
      setShowAddForm(false);
    }
  };

  const handleUpdateCategory = (id, field, value) => {
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { ...cat, [field]: field === 'name' ? value : parseFloat(value) || 0 }
        : cat
    ));
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleSave = () => {
    onUpdate({ categories, totalBudget });
  };

  const getCategoryStatus = (category) => {
    if (category.actual > category.planned) return 'over';
    if (category.actual === category.planned) return 'on-track';
    return 'under';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'over': return 'text-red-600';
      case 'on-track': return 'text-green-600';
      case 'under': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Budget</span>
            <DollarSign size={20} className="text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${totalBudget.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Spent</span>
            <TrendingUp size={20} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${totalActual.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {percentUsed.toFixed(1)}% of budget
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Paid</span>
            <DollarSign size={20} className="text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${totalPaid.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ${(totalActual - totalPaid).toLocaleString()} pending
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Remaining</span>
            {remaining >= 0 ? (
              <TrendingDown size={20} className="text-green-400" />
            ) : (
              <AlertCircle size={20} className="text-red-400" />
            )}
          </div>
          <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(remaining).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {remaining >= 0 ? 'Under budget' : 'Over budget'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Budget Usage</span>
          <span className="text-sm text-gray-500">{percentUsed.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              percentUsed > 100 
                ? 'bg-red-500' 
                : percentUsed > 80 
                ? 'bg-yellow-500' 
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Budget Categories</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            <Plus size={16} className="inline mr-1" />
            Add Category
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Planned</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => {
              const variance = category.planned - category.actual;
              const status = getCategoryStatus(category);
              const isEditing = editingCategory === category.id;

              return (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleUpdateCategory(category.id, 'name', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-gray-900"
                      />
                    ) : (
                      <span className="font-medium text-gray-900">{category.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        value={category.planned}
                        onChange={(e) => handleUpdateCategory(category.id, 'planned', e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-gray-900"
                      />
                    ) : (
                      <span className="text-gray-900">${category.planned.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        value={category.actual}
                        onChange={(e) => handleUpdateCategory(category.id, 'actual', e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-gray-900"
                      />
                    ) : (
                      <span className="text-gray-900">${category.actual.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        value={category.paid}
                        onChange={(e) => handleUpdateCategory(category.id, 'paid', e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-gray-900"
                      />
                    ) : (
                      <span className="text-gray-900">${category.paid.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${Math.abs(variance).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${getStatusColor(status)}`}>
                      {status === 'over' ? 'Over Budget' : status === 'on-track' ? 'On Track' : 'Under Budget'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="text-green-600 hover:text-green-700"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingCategory(category.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Add New Category Row */}
            {showAddForm && (
              <tr className="bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Category name"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={newCategory.planned}
                    onChange={(e) => setNewCategory({ ...newCategory, planned: e.target.value })}
                    placeholder="0"
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-gray-900"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={newCategory.actual}
                    onChange={(e) => setNewCategory({ ...newCategory, actual: e.target.value })}
                    placeholder="0"
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-gray-900"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={newCategory.paid}
                    onChange={(e) => setNewCategory({ ...newCategory, paid: e.target.value })}
                    placeholder="0"
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-gray-900"
                  />
                </td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleAddCategory}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewCategory({ name: '', planned: '', actual: '', paid: '' });
                      }}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Totals Row */}
            <tr className="bg-gray-100 font-semibold">
              <td className="px-6 py-4 text-gray-900">TOTAL</td>
              <td className="px-6 py-4 text-gray-900">${totalPlanned.toLocaleString()}</td>
              <td className="px-6 py-4 text-gray-900">${totalActual.toLocaleString()}</td>
              <td className="px-6 py-4 text-gray-900">${totalPaid.toLocaleString()}</td>
              <td className="px-6 py-4">
                <span className={totalPlanned - totalActual >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${Math.abs(totalPlanned - totalActual).toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4" colSpan="2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  Save Budget
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
