import React from 'react';
import { isSameMonth } from 'date-fns';
import { isWorkingDay, getDateKey, calculateRequiredOfficeDays, isPublicHoliday } from '../utils/dateHelpers';
import { Briefcase, CalendarCheck, CalendarOff } from 'lucide-react';

export default function MonthlySummary({ weeks, activeMonthDate, getDayStatus }) {
  let totalWorkingDays = 0;
  let totalLeaves = 0;
  let totalOffice = 0;
  let totalRequired = 0;

  weeks.forEach(week => {
    const monthDays = week.filter(date => isSameMonth(date, activeMonthDate));
    const weekDays = monthDays.filter(isWorkingDay);
    if (weekDays.length === 0) return;

    let weekLeaves = 0;
    
    weekDays.forEach(date => {
      totalWorkingDays++;
      const key = getDateKey(date);
      const status = getDayStatus(key);
      const isHoliday = isPublicHoliday(date);

      if (isHoliday || status === 'leave' || status === 'holiday') {
        weekLeaves++;
        totalLeaves++;
      } else if (status === 'office') {
        totalOffice++;
      }
    });

    const activeWorkingDays = weekDays.length - weekLeaves;
    if (activeWorkingDays > 0) {
      totalRequired += calculateRequiredOfficeDays(activeWorkingDays);
    }
  });

  return (
    <div className="glass-panel monthly-summary animate-pop">
      <h2>Aylık Özet</h2>
      
      <div className="summary-grid">
        <div className="summary-item">
          <CalendarCheck size={20} className="icon-blue" />
          <div className="summary-details">
            <span className="summary-label">Hedef Ofis</span>
            <span className="summary-value highlight">{totalRequired} Gün</span>
          </div>
        </div>
        
        <div className="summary-item">
          <Briefcase size={20} className="icon-green" />
          <div className="summary-details">
            <span className="summary-label">Gerçekleşen</span>
            <span className="summary-value">{totalOffice} Gün</span>
          </div>
        </div>
        
        <div className="summary-item">
          <CalendarOff size={20} className="icon-amber" />
          <div className="summary-details">
            <span className="summary-label">İzin / Tatil</span>
            <span className="summary-value">{totalLeaves} Gün</span>
          </div>
        </div>
      </div>
      
      <div className="summary-progress-wrapper">
        <div className="summary-progress-header">
          <span>Aylık İlerleme</span>
          <span>{totalRequired > 0 ? Math.round((totalOffice / totalRequired) * 100) : 100}%</span>
        </div>
        <div className="progress-container">
          <div 
            className="progress-bar success" 
            style={{ width: `${totalRequired > 0 ? Math.min(100, (totalOffice / totalRequired) * 100) : 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
