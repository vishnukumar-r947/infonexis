import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, BrainCircuit, CheckSquare, Network, Settings, Sparkles, ArrowRight } from 'lucide-react';
import { INITIAL_INTELLIGENCE } from '../../data/groundedIntelligence';

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // Toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const hits = [];

    // Search documents
    INITIAL_INTELLIGENCE.documents.forEach((d) => {
      if (d.title.toLowerCase().includes(q) || d.keyInsight.toLowerCase().includes(q) || d.source.toLowerCase().includes(q)) {
        hits.push({
          type: 'Document',
          title: d.title,
          sub: d.keyInsight,
          matchReason: 'Matched document text & metadata',
          route: '/app/information',
          priority: d.priority
        });
      }
    });

    // Search conflicts & issues
    INITIAL_INTELLIGENCE.conflicts.forEach((c) => {
      if (c.title.toLowerCase().includes(q) || c.delta.toLowerCase().includes(q)) {
        hits.push({
          type: 'Conflict',
          title: c.title,
          sub: c.delta,
          matchReason: 'Matched cross-document contradiction',
          route: '/app/intelligence',
          priority: c.severity
        });
      }
    });

    // Search actions
    INITIAL_INTELLIGENCE.actions.forEach((a) => {
      if (a.task.toLowerCase().includes(q) || a.reason.toLowerCase().includes(q)) {
        hits.push({
          type: 'Action',
          title: a.task,
          sub: a.reason,
          matchReason: 'Matched prioritized action item',
          route: '/app/actions',
          priority: a.priority
        });
      }
    });

    setResults(hits);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <Search size={20} color="var(--blue-600)" />
          <input
            autoFocus
            type="text"
            placeholder="Search across documents, facts, conflicts, actions, people, dates... (e.g. 'deadline', 'board')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              background: 'transparent'
            }}
          />
          <span style={{
            fontSize: '0.68rem',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            padding: '2px 6px',
            borderRadius: '4px',
            color: 'var(--text-muted)'
          }}>
            ESC
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px' }}>
          {query.trim() === '' ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Type to search globally across all verified intelligence artifacts.
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No matches found for "{query}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {results.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    navigate(res.route);
                    onClose();
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'var(--transition)'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: 'var(--cyan-700)',
                        background: 'var(--cyan-50)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        {res.type}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {res.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      {res.sub}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Why it matched: <em>{res.matchReason}</em>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
