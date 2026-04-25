import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Calendar, Book, Users, Award, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState({ timestamp: '', sessions: [] });
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard-data');
      const data = await response.json();
      setAttendanceData(data.attendance);
      setTimetableData(data.timetable);
      setLoading(false);
    } catch (error) {
       console.error('Error:', error);
       setLoading(false);
    }
  };

  const stats = [
    { title: 'Classes Today', value: '06', icon: Calendar },
    { title: 'Active Assignments', value: '02', icon: Book },
    { title: 'Research Teams', value: '03', icon: Users },
    { title: 'Total Credits', value: '18', icon: Award }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-16 max-w-6xl"
    >
      {/* Elegant Header */}
      <div className="mb-20">
         <h1 className="text-5xl font-serif text-primary leading-tight mb-4">
            Hello, <span className="italic">{user?.name?.split(' ')[0]}</span>.
         </h1>
         <p className="text-muted-foreground text-lg max-w-xl font-medium leading-relaxed">
            Your academic overview for today at Keshav Memorial Institute of Technology. 
            All records are synchronized with the central portal.
         </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {stats.map((stat, i) => (
          <div key={stat.title} className="group cursor-default">
             <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-4 group-hover:text-primary transition-colors">
               {stat.title}
             </p>
             <div className="flex items-baseline gap-4">
                <span className="text-4xl font-serif font-bold text-primary">{stat.value}</span>
                <div className="h-[2px] flex-1 bg-border/50 group-hover:bg-primary/20 transition-colors" />
             </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-24">
         {/* Attendance Section */}
         <section>
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-border">
               <h2 className="text-2xl font-serif text-primary">Daily Attendance</h2>
               <span className="text-[10px] font-bold text-muted-foreground uppercase">{attendanceData.timestamp}</span>
            </div>
            <div className="space-y-4">
              {attendanceData.sessions.map((status, index) => (
                <div key={index} className="flex items-center justify-between py-4 group">
                  <div className="flex items-center gap-6">
                     <span className="text-xs font-bold text-muted-foreground/40 tabular-nums">0{index + 1}</span>
                     <span className="text-base font-semibold group-hover:text-primary transition-colors">Session Slot</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                     status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                     {status === 'Present' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                     {status}
                  </div>
                </div>
              ))}
            </div>
         </section>

         {/* Timetable Section */}
         <section>
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-border">
               <h2 className="text-2xl font-serif text-primary">Core Schedule</h2>
               <Clock size={18} className="text-muted-foreground" />
            </div>
            <div className="space-y-6">
              {timetableData.map((day, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">{day.header}</h3>
                  <div className="paper-secondary rounded-2xl p-2">
                    <table className="w-full text-left">
                      <tbody>
                        {day.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-border/20 last:border-b-0 hover:bg-white/50 transition-colors">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="p-4 text-sm font-medium text-foreground/80 first:font-bold first:text-primary">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
         </section>
      </div>
    </motion.div>
  );
};

export default Dashboard;