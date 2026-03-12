import React from 'react';
import { format, isSameMonth } from 'date-fns';
import { tr } from 'date-fns/locale';
import { isWorkingDay, getDateKey, calculateRequiredOfficeDays, isPublicHoliday } from '../utils/dateHelpers';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function WeeklyTracker({ weeks, activeMonthDate, getDayStatus }) {
  return (
    <div className="glass-panel tracker-sidebar animate-pop" style={{ animationDelay: '0.1s' }}>
      <h2>Haftalık Durum</h2>
      
      {weeks.map((week, index) => {
        // filter days in current month
        const monthDays = week.filter(date => isSameMonth(date, activeMonthDate));
        if (monthDays.length === 0) return null;

        // Calculate stats for this specific week from active month
        const weekDays = monthDays.filter(isWorkingDay);
        const totalWorkingDays = weekDays.length;
        
        if (totalWorkingDays === 0) return null; // Only weekend in this month for this week row
        
        let leaves = 0;
        let officeDays = 0;
        
        weekDays.forEach(date => {
          const key = getDateKey(date);
          const status = getDayStatus(key);
          const isHoliday = isPublicHoliday(date);

          if (isHoliday || status === 'leave' || status === 'holiday') {
            leaves++;
          } else if (status === 'office') {
            officeDays++;
          }
        });

        // The formula based on active working days
        const activeWorkingDays = totalWorkingDays - leaves;
        // if active is 0 (e.g. 5 days leave), required is 0
        const requiredOfficeDays = activeWorkingDays > 0 ? calculateRequiredOfficeDays(activeWorkingDays) : 0;
        
        const isMet = requiredOfficeDays > 0 && officeDays >= requiredOfficeDays;
        const progressPercent = requiredOfficeDays > 0 
          ? Math.min(100, (officeDays / requiredOfficeDays) * 100) 
          : (activeWorkingDays === 0 ? 100 : 0); // 100% if no required days
          
        let barClass = 'progress-bar';
        if (isMet || activeWorkingDays === 0) barClass += ' success';
        else if (progressPercent > 0 && progressPercent < 100) barClass += ' warning';
        
        // Formatter for week display
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
            
            <div className="week-stats">
              <span>
                {activeWorkingDays === 0 
                  ? 'Tüm hafta izin/tatil' 
                  : `Hedef: ${requiredOfficeDays} gün`}
              </span>
              <span>
                {officeDays} / {requiredOfficeDays} Ofis
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
