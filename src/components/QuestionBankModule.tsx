import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Database, Edit2, Trash2, Plus, X, BookOpen, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { sharedQuestions, updateSharedQuestions, Question, COURSES_MAP } from '../data/mockQuestions';

const COURSE_CATEGORIES = [
  { id: 'Category A', name: 'Principles of First Aid' },
  { id: 'Category B', name: 'Basic Life Support & CPR' },
  { id: 'Category C', name: 'Wounds, Bleeding & Shock' },
  { id: 'Category D', name: 'Musculoskeletal Injuries & Transport' },
];

const initialSubjek = Object.entries(COURSES_MAP).map(([code, name], index) => ({
  id: String(index + 1),
  name,
  code,
  duration: '14', // Default placeholder
}));

export const QuestionBankModule = () => {
  const [selectedCourse, setSelectedCourse] = useState<{name: string, code: string} | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const [categories, setCategories] = useState(COURSE_CATEGORIES);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');

  const [questions, setQuestions] = useState<Question[]>(sharedQuestions);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [subjekList, setSubjekList] = useState(initialSubjek);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourseForm, setNewCourseForm] = useState({ code: '', name: '' });

  const handleAddCourse = () => {
    if (newCourseForm.code.trim() && newCourseForm.name.trim()) {
      const newCourse = {
        id: String(subjekList.length + 1),
        code: newCourseForm.code.toUpperCase(),
        name: newCourseForm.name.toUpperCase(),
        duration: '14'
      };
      setSubjekList([newCourse, ...subjekList]);
      setIsAddingCourse(false);
      setNewCourseForm({ code: '', name: '' });
    }
  };

  useEffect(() => {
    updateSharedQuestions(questions);
  }, [questions]);

  const handleAddCategory = () => {
    const nextChar = String.fromCharCode(65 + categories.length);
    const newCategory = {
      id: `Category ${nextChar}`,
      name: 'New Category'
    };
    setCategories([...categories, newCategory]);
    setEditingCategoryId(newCategory.id);
    setCategoryNameInput(newCategory.name);
    setExpandedCategory(newCategory.id);
  };

  const saveCategoryName = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (categoryNameInput.trim()) {
      setCategories(categories.map(c => c.id === id ? { ...c, name: categoryNameInput } : c));
    }
    setEditingCategoryId(null);
  };

  const handleEditCategory = (category: {id: string, name: string}, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategoryId(category.id);
    setCategoryNameInput(category.name);
  };

  const handleAddNew = (categoryId: string) => {
    setIsAddingNew(true);
    setEditForm({ 
      id: 'q_' + Math.random().toString(36).substr(2, 9), 
      course: selectedCourse?.code || '',
      category: categoryId,
      type: 'Objective',
      description: '', 
      options: ['', '', '', ''], 
      answer: '',
      score: 1 
    });
    setEditingIndex(-1);
  };

  const saveNew = () => {
    if (editForm) {
      setQuestions([editForm, ...questions]);
      setIsAddingNew(false);
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const handleEdit = (questionId: string) => {
    const idx = questions.findIndex(q => q.id === questionId);
    if (idx !== -1) {
      setEditingIndex(idx);
      setEditForm({ ...questions[idx] });
    }
  };

  const saveEdit = () => {
    if (editForm && editingIndex !== null) {
      const newQ = [...questions];
      newQ[editingIndex] = editForm;
      setQuestions(newQ);
      setEditingIndex(null);
      setEditForm(null);
      setIsAddingNew(false);
    }
  };

  const handleDelete = (questionId: string) => {
    const newQ = questions.filter(q => q.id !== questionId);
    setQuestions(newQ);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditForm(null);
    setIsAddingNew(false);
  };

  const renderEditForm = () => {
    if (!editForm) return null;
    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h4 className="font-bold text-gray-900">{isAddingNew ? 'Question Setup (New)' : 'Edit Question'}</h4>
            <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5"/>
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Course</label>
                <input 
                  value={editForm.course}
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 rounded-md p-2.5 text-sm outline-none text-gray-500 font-medium cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Score</label>
                <input 
                  type="number"
                  value={editForm.score}
                  onChange={(e) => setEditForm({...editForm, score: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Type</label>
                <select 
                  value={editForm.type}
                  onChange={(e) => setEditForm({...editForm, type: e.target.value as 'Objective' | 'Subjective'})}
                  className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none bg-white"
                >
                  <option value="Objective">Objective</option>
                  <option value="Subjective">Subjective</option>
                </select>
              </div>
              {editForm.type === 'Objective' && (
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Option Count</label>
                  <select 
                    value={editForm.options.length}
                    onChange={(e) => {
                      const count = parseInt(e.target.value);
                      const currentOptions = [...editForm.options];
                      if (count > currentOptions.length) {
                        currentOptions.push(...Array(count - currentOptions.length).fill(''));
                      } else {
                        currentOptions.splice(count);
                      }
                      setEditForm({...editForm, options: currentOptions});
                    }}
                    className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} Options</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Description</label>
              <textarea 
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none"
                rows={3}
                placeholder="Question Details"
              />
            </div>
            
            {editForm.type === 'Objective' && (
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Option of answer
                </label>
                <div className="space-y-2">
                  {editForm.options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-8 h-8 shrink-0 rounded bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input 
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOps = [...editForm.options];
                          newOps[idx] = e.target.value;
                          setEditForm({...editForm, options: newOps});
                        }}
                        placeholder={`Option Description ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Answer</label>
              {editForm.type === 'Objective' ? (
                <select 
                  value={editForm.answer}
                  onChange={(e) => setEditForm({...editForm, answer: e.target.value})}
                  className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none bg-white"
                >
                  <option value="">-- Select Answer --</option>
                  {editForm.options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    return <option key={idx} value={letter}>{letter} - {opt || `(Empty Option)`}</option>
                  })}
                </select>
              ) : (
                <textarea 
                  value={editForm.answer}
                  onChange={(e) => setEditForm({...editForm, answer: e.target.value})}
                  className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none"
                  rows={2}
                  placeholder="Expected answer or grading rubric..."
                />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button onClick={cancelEdit} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-md transition-colors">Cancel</button>
            <button onClick={isAddingNew ? saveNew : saveEdit} disabled={!editForm.category} className="disabled:opacity-50 px-5 py-2 bg-action-teal text-white rounded-md text-sm font-bold shadow-sm hover:bg-teal-700 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4"/> Save Question
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedCourse) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
              <Database className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-xl text-gray-900 tracking-tight">Question Collection</h2>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Subject, Code, or Target..."
                className="w-full border border-gray-200 rounded-lg p-2 pl-9 text-sm focus:border-action-teal outline-none"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button 
              onClick={() => setIsAddingCourse(true)}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Create New Course
            </button>
          </div>
        </div>

        {isAddingCourse && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Course Code</label>
              <input 
                type="text" 
                value={newCourseForm.code}
                onChange={(e) => setNewCourseForm({...newCourseForm, code: e.target.value})}
                placeholder="e.g. CERC1011"
                className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none"
              />
            </div>
            <div className="flex-[2] w-full">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Course Name</label>
              <input 
                type="text" 
                value={newCourseForm.name}
                onChange={(e) => setNewCourseForm({...newCourseForm, name: e.target.value})}
                placeholder="e.g. PENDIDIKAN PALANG MERAH"
                className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:border-action-teal outline-none"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setIsAddingCourse(false)}
                className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-md font-bold text-sm hover:bg-gray-50 flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCourse}
                disabled={!newCourseForm.code || !newCourseForm.name}
                className="px-4 py-2.5 bg-action-teal text-white rounded-md font-bold text-sm hover:bg-teal-700 flex-1 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {subjekList
              .filter(s => 
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s as any).target?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.duration.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((subjek, index) => (
              <motion.button
                key={subjek.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCourse({ name: subjek.name, code: subjek.code })}
                className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-action-teal/30 transition-all text-left flex flex-col items-start gap-4 h-full relative group"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex bg-action-teal/10 text-action-teal p-3 rounded-lg group-hover:bg-action-teal group-hover:text-white transition-colors shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-lg font-bold font-mono">
                    {subjek.code}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight mt-1 text-sm md:text-base">{subjek.name}</h3>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  const courseQuestions = questions.filter(q => q.course === selectedCourse.code);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedCourse(null)}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900 tracking-tight">{selectedCourse.code} Questions</h2>
            <p className="text-sm text-gray-500">{selectedCourse.name}</p>
          </div>
        </div>
        <button 
          onClick={handleAddCategory}
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      <div className="space-y-4">
        {categories.map(category => {
          const isExpanded = expandedCategory === category.id;
          const questionsInCategory = courseQuestions.filter(q => q.category === category.id);

          return (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div 
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full flex items-center justify-between p-5 sm:p-6 bg-white hover:bg-gray-50 transition-colors text-left cursor-pointer group"
              >
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-gray-400">{category.id}:</span>
                    {editingCategoryId === category.id ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={categoryNameInput}
                          onChange={(e) => setCategoryNameInput(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-action-teal"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveCategoryName(category.id, e as any);
                            if (e.key === 'Escape') setEditingCategoryId(null);
                          }}
                        />
                        <button onClick={(e) => saveCategoryName(category.id, e)} className="p-1.5 bg-action-teal text-white rounded hover:bg-teal-700 transition-colors">
                          <Save className="w-3.5 h-3.5"/>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingCategoryId(null); }} className="p-1.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors">
                          <X className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    ) : (
                      <h3 className="font-bold text-lg text-charcoal flex items-center gap-2">
                        {category.name}
                        <button 
                          onClick={(e) => handleEditCategory(category, e)}
                          className="p-1 text-gray-400 hover:text-action-teal hover:bg-teal-50 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </h3>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{questionsInCategory.length} questions</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-full text-gray-500 shrink-0">
                  {isExpanded ? <ChevronDown className="w-5 h-5"/> : <ChevronRight className="w-5 h-5"/>}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex justify-end mb-4">
                        <button 
                          onClick={() => handleAddNew(category.id)}
                          className="bg-white hover:bg-gray-50 text-action-teal border border-action-teal/30 px-3 py-1.5 text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5"/> New Question
                        </button>
                      </div>

                      <div className="overflow-x-auto rounded-lg border border-gray-100">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-widest font-semibold">
                            <tr>
                              <th className="px-6 py-4 text-center">Type</th>
                              <th className="px-6 py-4 w-1/2">Description</th>
                              <th className="px-6 py-4 text-center">Score</th>
                              <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {questionsInCategory.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium bg-white">No questions in this category.</td>
                              </tr>
                            ) : (
                              questionsInCategory.map((q) => (
                                <tr key={q.id} className="hover:bg-gray-50/50 bg-white">
                                  <td className="px-6 py-4 text-center text-gray-600">{q.type}</td>
                                  <td className="px-6 py-4 text-gray-900 whitespace-normal min-w-[200px]">{q.description}</td>
                                  <td className="px-6 py-4 text-center text-action-teal font-bold">{q.score}</td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <button 
                                        onClick={() => handleEdit(q.id)}
                                        className="p-1.5 text-gray-400 hover:text-action-teal transition-colors"
                                        title="Edit"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDelete(q.id)}
                                        className="p-1.5 text-gray-400 hover:text-brand-red transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      
      {renderEditForm()}
    </motion.div>
  );
};

