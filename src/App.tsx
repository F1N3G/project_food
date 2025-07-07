import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Check, X, ShoppingCart } from 'lucide-react';

interface GroceryItem {
  id: string;
  name: string;
  completed: boolean;
  category: string;
}

const CATEGORY_OPTIONS = [
  'Produce',
  'Dairy',
  'Meat',
  'Bakery',
  'Frozen',
  'Pantry',
  'Beverages',
  'Household',
  'Other',
];

function App() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORY_OPTIONS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingCategory, setEditingCategory] = useState(CATEGORY_OPTIONS[0]);
  const [savedLists, setSavedLists] = useState<{ timestamp: number; items: GroceryItem[] }[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('grocery_dark_mode');
    return stored ? JSON.parse(stored) : false;
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Load saved lists from localStorage on mount
  React.useEffect(() => {
    const lists = localStorage.getItem('grocery_saved_lists');
    if (lists) {
      setSavedLists(JSON.parse(lists));
    }
  }, []);

  // Save all lists to localStorage whenever savedLists changes
  React.useEffect(() => {
    localStorage.setItem('grocery_saved_lists', JSON.stringify(savedLists));
  }, [savedLists]);

  React.useEffect(() => {
    localStorage.setItem('grocery_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addItem = () => {
    if (newItem.trim()) {
      const item: GroceryItem = {
        id: Date.now().toString(),
        name: newItem.trim(),
        completed: false,
        category: newCategory,
      };
      setItems([...items, item]);
      setNewItem('');
      setNewCategory(CATEGORY_OPTIONS[0]);
    }
  };

  const toggleComplete = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const startEditing = (item: GroceryItem) => {
    setEditingId(item.id);
    setEditingText(item.name);
    setEditingCategory(item.category);
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      setItems(items.map(item => 
        item.id === editingId ? { ...item, name: editingText.trim(), category: editingCategory } : item
      ));
    }
    setEditingId(null);
    setEditingText('');
    setEditingCategory(CATEGORY_OPTIONS[0]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
    setEditingCategory(CATEGORY_OPTIONS[0]);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        addItem();
      } else {
        saveEdit();
      }
    } else if (e.key === 'Escape' && action === 'edit') {
      cancelEdit();
    }
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  const saveCurrentList = () => {
    if (items.length === 0) return;
    const newSavedList = {
      timestamp: Date.now(),
      items: [...items],
    };
    setSavedLists([newSavedList, ...savedLists]);
  };

  const copyCurrentList = () => {
    if (items.length === 0) return;
    const text = items.map(item => `- ${item.name} [${item.category}]${item.completed ? ' (done)' : ''}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    });
  };

  // Filter items by search term (name only)
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={
      `min-h-screen py-8 px-4 transition-colors duration-300 ` +
      (darkMode
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-blue-50 to-indigo-100')
    }>
      <div className="max-w-md mx-auto">
        <div className={
          `rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 ` +
          (darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white')
        }>
          {/* Header */}
          <div className={
            `flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r px-6 py-8 ` +
            (darkMode
              ? 'from-gray-800 to-gray-700 text-emerald-200'
              : 'from-emerald-500 to-teal-600 text-white')
          }>
            <div className="flex items-center justify-center mb-2 sm:mb-0">
              <ShoppingCart className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">Grocery List</h1>
            </div>
            <button
              onClick={() => setDarkMode((dm: boolean) => !dm)}
              className="ml-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Toggle dark mode"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-6 pt-4 pb-2">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Add Item Form */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'add')}
                placeholder="Add a new item..."
                className="flex-1 min-w-[120px] px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 dark:bg-gray-800 dark:text-gray-100"
              />
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="min-w-[110px] px-2 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 dark:bg-gray-800 dark:text-gray-100"
              >
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option} value={option} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">{option}</option>
                ))}
              </select>
              <button
                onClick={saveCurrentList}
                className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[90px]"
                title="Save this list"
              >
                Save List
              </button>
              <button
                onClick={copyCurrentList}
                className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[90px]"
                title="Copy this list to clipboard"
              >
                {copySuccess ? 'Copied!' : 'Copy List'}
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Your grocery list is empty</p>
                <p className="text-sm mt-1">Add your first item above!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 transition-all duration-200 hover:bg-gray-50 group ${
                      item.completed ? 'bg-gray-50/50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          item.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-gray-300 hover:border-emerald-400'
                        }`}
                      >
                        {item.completed && <Check className="h-4 w-4" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        {editingId === item.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, 'edit')}
                              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm dark:bg-gray-800 dark:text-gray-100"
                              autoFocus
                            />
                            <select
                              value={editingCategory}
                              onChange={e => setEditingCategory(e.target.value)}
                              className="px-2 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm dark:bg-gray-800 dark:text-gray-100"
                            >
                              {CATEGORY_OPTIONS.map(option => (
                                <option key={option} value={option} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">{option}</option>
                              ))}
                            </select>
                            <button
                              onClick={saveEdit}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <p
                              onClick={() => startEditing(item)}
                              className={`cursor-pointer hover:text-emerald-400 transition-colors duration-200 ${
                                item.completed
                                  ? 'text-gray-500 line-through'
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}
                            >
                              {item.name}
                            </p>
                            <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100">
                              {item.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {editingId !== item.id && (
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => startEditing(item)}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Lists Section */}
          <div className={
            `p-6 border-t border-gray-100 bg-gray-50 transition-colors duration-300 ` +
            (darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : '')
          }>
            <h2 className="text-lg font-semibold mb-2">Saved Lists</h2>
            {savedLists.length === 0 ? (
              <p className="text-gray-400 text-sm">No saved lists yet.</p>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {savedLists.map((list, idx) => (
                  <div key={list.timestamp} className="bg-white rounded-lg shadow p-3 relative dark:bg-gray-800 dark:border dark:border-gray-700">
                    <button
                      onClick={() => {
                        setSavedLists(savedLists.filter(l => l.timestamp !== list.timestamp));
                      }}
                      className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                      title="Delete this saved list"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(list.timestamp).toLocaleString()}
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {list.items.map((item) => (
                        <li key={item.id} className={item.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'} style={{ listStyleType: 'disc', color: item.completed ? '#9ca3af' : undefined }}>
                          <span className="text-gray-900 dark:text-gray-100">{item.name}</span>
                          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100">{item.category}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Click any item to edit • Press Enter to save • Press Escape to cancel</p>
        </div>
      </div>
    </div>
  );
}

export default App;