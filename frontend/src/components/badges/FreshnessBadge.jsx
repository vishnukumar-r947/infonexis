import React from 'react';
import { FRESHNESS_RULES } from '../../config/constants';
import { Clock, ShieldAlert } from 'lucide-react';

export default function FreshnessBadge({ freshness = 'RECENT', note = '' }) {
  const rule = FRESHNESS_RULES[freshness] || FRESHNESS_RULES.RECENT;
  const badgeClass = 'badge-' + (freshness.toLowerCase());

  return (
    <div
      className={badgeClass}
      title={note || rule.desc}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'help' }}
    >
      <Clock size={12} />
      <span>{rule.label}</span>
      {freshness === 'STALE' && <ShieldAlert size={11} color="#DC2626" />}
    </div>
  );
}
