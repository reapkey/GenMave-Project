import { useState, useEffect, useRef } from 'react';
import { Lock, Save, X, Edit, Trash2, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Journal() {
  const [activeTab, setActiveTab] = useState('write');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const autoSaveTimerRef = useRef(null);
  const MAX_CHARS = 2000;

  useEffect(() => {
    if (activeTab === 'entries') {
      fetchEntries();
    }
  }, [activeTab]);

  // Auto-save logic
  useEffect(() => {
    if (isDirty && content.trim()) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer for 30 seconds
      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave();
      }, 30000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, isDirty]);

  // Warning before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'Kamu punya perubahan yang belum disimpan. Yakin mau keluar?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    if (!content.trim() || !isDirty) return;

    setIsSaving(true);
    try {
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('journal_entries')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', editingEntry.id);

        if (error) throw error;
      } else {
        // Create new entry
        const { error } = await supabase
          .from('journal_entries')
          .insert({ user_id: user.id, content });

        if (error) throw error;
      }

      setIsDirty(false);
      setLastSaved(new Date());
      
      // Backup to localStorage
      localStorage.setItem('journal_backup', JSON.stringify({
        content,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error auto-saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (!content.trim()) {
      alert('Tulis sesuatu dulu sebelum menyimpan!');
      return;
    }

    setIsSaving(true);
    try {
      if (editingEntry) {
        // Update existing
        const { error } = await supabase
          .from('journal_entries')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', editingEntry.id);

        if (error) throw error;
        alert('Entry diupdate ✅');
      } else {
        // Create new
        const { error } = await supabase
          .from('journal_entries')
          .insert({ user_id: user.id, content });

        if (error) throw error;
        alert('Entry disimpan ✅');
      }

      setIsDirty(false);
      setLastSaved(new Date());
      setContent('');
      setEditingEntry(null);
      localStorage.removeItem('journal_backup');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Gagal menyimpan. Coba lagi?');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    if (isDirty && !confirm('Yakin mau hapus semua yang sudah ditulis?')) {
      return;
    }
    setContent('');
    setIsDirty(false);
    setEditingEntry(null);
    localStorage.removeItem('journal_backup');
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
      setIsDirty(true);
    }
  };

  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setContent(entry.content);
    setActiveTab('write');
    setShowModal(false);
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      alert('Entry dihapus');
      fetchEntries();
      setShowModal(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus entry. Coba lagi?');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2 flex items-center gap-2">
            <BookOpen className="text-primary" size={32} />
            Journal
          </h1>
          <p className="text-text-light flex items-center gap-2">
            <Lock size={16} />
            Semua yang kamu tulis di sini private. Nggak ada yang baca kecuali kamu.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-neutral">
          <button
            onClick={() => setActiveTab('write')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'write'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-light hover:text-text'
            }`}
          >
            Write New Entry
          </button>
          <button
            onClick={() => setActiveTab('entries')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'entries'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-light hover:text-text'
            }`}
          >
            Past Entries
          </button>
        </div>

        {/* Write Tab */}
        {activeTab === 'write' && (
          <Card>
            {/* Date & Time */}
            <div className="flex justify-between items-center mb-4 text-sm text-text-light">
              <div>{formatDate(new Date())}</div>
              <div>{formatTime()}</div>
            </div>

            {/* Textarea */}
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Hari ini..."
              className="w-full min-h-[400px] p-4 border border-neutral rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light outline-none resize-y"
            />

            {/* Character Count & Status */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-text-light">
                {content.length} / {MAX_CHARS}
              </div>
              <div className="text-sm">
                {isSaving ? (
                  <span className="text-text-light">Menyimpan...</span>
                ) : isDirty ? (
                  <span className="text-warning">Belum tersimpan</span>
                ) : lastSaved ? (
                  <span className="text-success">Tersimpan</span>
                ) : null}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleManualSave}
                disabled={!content.trim() || isSaving}
                loading={isSaving}
                className="flex items-center gap-2"
              >
                <Save size={18} />
                Simpan
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X size={18} />
                Batal
              </Button>
            </div>
          </Card>
        )}

        {/* Past Entries Tab */}
        {activeTab === 'entries' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : entries.length === 0 ? (
              <Card className="text-center py-12">
                <BookOpen className="mx-auto mb-4 text-text-light" size={48} />
                <h3 className="text-xl font-heading font-semibold mb-2">
                  Belum ada journal entry
                </h3>
                <p className="text-text-light mb-6">
                  Mulai tulis hari ini! ✍️
                </p>
                <Button onClick={() => setActiveTab('write')}>Mulai Menulis</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card
                    key={entry.id}
                    interactive
                    onClick={() => handleViewEntry(entry)}
                    className="cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-text-light">
                        {formatDate(entry.created_at)}
                      </div>
                    </div>
                    <p className="text-text-light line-clamp-3">
                      {entry.content.substring(0, 150)}
                      {entry.content.length > 150 ? '...' : ''}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Entry Modal */}
        {showModal && selectedEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-heading font-semibold">
                  {formatDate(selectedEntry.created_at)}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-text-light hover:text-text"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-base whitespace-pre-wrap mb-6">
                {selectedEntry.content}
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleEditEntry(selectedEntry)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="danger"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Hapus
                </Button>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm && (
                <div className="mt-6 p-4 bg-error/10 border border-error rounded-lg">
                  <p className="text-error mb-4">
                    Yakin mau hapus entry ini? Aksi ini nggak bisa dibatalin.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleDeleteEntry(selectedEntry.id)}
                      variant="danger"
                      size="sm"
                    >
                      Ya, Hapus
                    </Button>
                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                      size="sm"
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
