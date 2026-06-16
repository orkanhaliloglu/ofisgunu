import React from 'react';
import { format, isSameMonth } from 'date-fns';
import { tr } from 'date-fns/locale';
import { isWorkingDay, getDateKey, isPublicHoliday, calculateRequiredOfficeDays } from '../utils/dateHelpers';
import { CalendarDays, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WeeklyTracker({ weeks, activeMonthDate, getDayStatus }) {
  return (
    <div className="glass-panel tracker-sidebar animate-pop" style={{ animationDelay: '0.1s' }}>
      <h2 style={{margin: 0, marginBottom: '1.5rem'}}>Haftalık Durum</h2>
      
      {weeks.map((week, index) => {
        const monthDays = week.filter(date => isSameMonth(date, activeMonthDate));
        if (monthDays.length === 0) return null;

        const weekDays = monthDays.filter(isWorkingDay);
        if (weekDays.length === 0) return null;
        
        let officeDays = 0;
        let homeDays = 0;
        let remoteDays = 0;
        let leaves = 0;
        
        weekDays.forEach(date => {
          const key = getDateKey(date);
          const status = getDayStatus(key);
          const isHoliday = isPublicHoliday(date);

          if (isHoliday || status === 'leave' || status === 'holiday' || status === 'remote') {
            leaves++;
            if (status === 'remote') remoteDays++;
          } else if (status === 'office') {
            officeDays++;
          } else if (status === 'home') {
            homeDays++;
          }
        });

        const activeWorkingDays = weekDays.length - leaves;
        const requiredOfficeDays = activeWorkingDays > 0 ? calculateRequiredOfficeDays(activeWorkingDays) : 0;
        
        const isMet = requiredOfficeDays > 0 && officeDays >= requiredOfficeDays;
        const progressPercent = requiredOfficeDays > 0 
          ? Math.min(100, (officeDays / requiredOfficeDays) * 100) 
          : (activeWorkingDays === 0 ? 100 : 0);
          
        let barClass = 'progress-bar';
        if (isMet || activeWorkingDays === 0) barClass += ' success';
        else if (progressPercent > 0 && progressPercent < 100) barClass += ' warning';
        
        const startStr = format(monthDays[0], 'dd MMM', { locale: tr });
        const endStr = format(monthDays[monthDays.length - 1], 'dd MMM', { locale: tr });

        return (
          <div key={index} className="week-card">
            <div className="week-header">
              <span>{startStr} - {endStr}</span>
              {isMet || activeWorkingDays === 0 ? (
                <CheckCircle2 color="var(--color-home)" size={20} />
              ) : (
                <AlertCircle color="var(--color-leave)" size={20} />
              )}
            </div>
            
            <div className="progress-container">
              <div 
                className={barClass} 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            
            <div className="week-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span>
                {activeWorkingDays === 0 
                  ? 'Tüm hafta izin/tatil' 
                  : `Hedef: ${requiredOfficeDays} gün`}
              </span>
              <span style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--color-office)' }}>
                  <strong>{officeDays}</strong>/{requiredOfficeDays} Ofis
                </span>
                <span style={{ color: 'var(--color-home)' }}>
                  <strong>{homeDays}</strong> Ev
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
