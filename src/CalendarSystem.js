import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './CalendarSystem.css';

const CalendarSystem = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [projects, setProjects] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [viewMode, setViewMode] = useState('month');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [allProjects, setAllProjects] = useState([]);


const fetchCalendarData = async (projectId = null) => {
  try {
    let url = 'http://localhost/Innovatech/Config/getCalendarData.php';

    if (projectId !== null) {
      url += `?projeto_id=${projectId}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    console.log('Resposta do backend:', data);

    setAllProjects(data.allProjects || []);
    setProjects(data.projects || []);
    setTimeSlots(data.timeSlots || []);
  } catch (error) {
    console.error('Erro ao buscar dados do calendário:', error);
  }
};

useEffect(() => {
  fetchCalendarData(null);
}, []);


const getEventTitle = (event) => {
  if (!event?.data) return 'Evento';

  switch (event.type) {
    case 'project':
      return event.data.nome || 'Projeto';

    case 'task':
      return event.data.atividade || 'Tarefa';

    case 'comment':
      return 'Comentário';

    default:
      return 'Evento';
  }
};


  // Converter projetos e horários para eventos do calendário
const calendarEvents = useMemo(() => {
  const events = {};

  const addEvent = (dateKey, event) => {
    if (!events[dateKey]) events[dateKey] = [];
    events[dateKey].push(event);
  };

  // 🔹 PROJETOS / TAREFAS / COMENTÁRIOS
  projects.forEach(project => {
    if (!project) return;

    // 🔹 Início do projeto
    if (project.data_inicio) {
      const dateKey = project.data_inicio.split('T')[0];
      addEvent(dateKey, {
        type: 'project',
        eventType: 'start',
        title: `Início do projeto: ${project.nome}`,
        color: '#48bb78',
        data: project
      });
    }

    // 🔹 Fim do projeto
    if (project.data_fim) {
      const dateKey = project.data_fim.split('T')[0];
      addEvent(dateKey, {
        type: 'project',
        eventType: 'end',
        title: `Fim do projeto: ${project.nome}`,
        color: '#f56565',
        data: project
      });
    }

    // 🔹 Tarefas
    if (Array.isArray(project.tarefas)) {
      project.tarefas.forEach(tarefa => {
        if (!tarefa?.data_inicio) return;

        const dateKey = tarefa.data_inicio.split('T')[0];
        addEvent(dateKey, {
          type: 'task',
          title: `Tarefa: ${tarefa.nome}`,
          color: '#4299e1',
          data: tarefa
        });
      });
    }

    // 🔹 Comentários
    if (Array.isArray(project.comentarios)) {
      project.comentarios.forEach(c => {
        if (!c?.created_at) return;

        const dateKey = c.created_at.split(' ')[0];
        addEvent(dateKey, {
          type: 'comment',
          title: 'Comentário adicionado',
          color: '#805ad5',
          data: c
        });
      });
    }
  });

  return events;
}, [projects]);



  // Navigation handlers
  const navigateMonth = useCallback((increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  }, [currentDate]);

  const navigateWeek = useCallback((increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (increment * 7)));
  }, [currentDate]);

  const navigateDay = useCallback((increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + increment));
  }, [currentDate]);

  const navigateYear = useCallback((increment) => {
    setCurrentDate(new Date(currentDate.getFullYear() + increment, currentDate.getMonth(), 1));
  }, [currentDate]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  // Header Component
  const CalendarHeader = ({ allProjects, selectedProjectId, setSelectedProjectId, viewMode, setViewMode, currentDate, goToToday, navigateDay, navigateWeek, navigateMonth, navigateYear }) => {
    const getNavigationHandler = () => {
      switch (viewMode) {
        case 'day': return navigateDay;
        case 'week': return navigateWeek;
        case 'month': return navigateMonth;
        case 'year': return navigateYear;
        default: return navigateMonth;
      }
    };

    const getTitle = () => {
      switch (viewMode) {
        case 'day':
          return currentDate.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        case 'week':
          const startOfWeek = new Date(currentDate);
          const day = currentDate.getDay();
          const diff = day === 0 ? -6 : 1 - day;
          startOfWeek.setDate(currentDate.getDate() + diff);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);

          return `${startOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        case 'month':
          return currentDate.toLocaleString('pt-BR', {
            month: 'long',
            year: 'numeric'
          });
        case 'year':
          return currentDate.getFullYear().toString();
        default:
          return currentDate.toLocaleString('pt-BR', {
            month: 'long',
            year: 'numeric'
          });
      }
    };

    const navigate = getNavigationHandler();
    // console.log('allProjects no render:', allProjects);

    return (
      <div className="calendar-header">
        <div className="project-selector">

          <select
            value={selectedProjectId ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedProjectId(value ? Number(value) : null);
            }}

          >
            <option value="">Selecione um projeto</option>
            {allProjects.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="header-center">
          <button onClick={() => navigate(-1)}>‹</button>
          <h2>{getTitle()}</h2>
          <button onClick={() => navigate(1)}>›</button>
          <button onClick={goToToday}>Hoje</button>
        </div>

        <div className="header-right">
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
              onClick={() => setViewMode('day')}
            >
              Dia
            </button>
            <button
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Semana
            </button>
            <button
              className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Mês
            </button>
            <button
              className={`view-btn ${viewMode === 'year' ? 'active' : ''}`}
              onClick={() => setViewMode('year')}
            >
              Ano
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mini Calendar Component
  const MiniCalendar = () => {
    const miniDate = currentDate;

    const getDaysInMonth = useCallback((date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }, []);

    const getFirstDayOfMonth = useCallback((date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }, []);

    const changeMonth = useCallback((increment) => {
      setCurrentDate(new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + increment,
        1
      ));
    }, [currentDate]);

    const renderMiniCalendar = useCallback(() => {
      const daysInMonth = getDaysInMonth(miniDate);
      const firstDay = getFirstDayOfMonth(miniDate);
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`mini-empty-${i}`} className="mini-day empty"></div>);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(miniDate.getFullYear(), miniDate.getMonth(), day);
        const dateKey = date.toISOString().split('T')[0];
        const dayEvents = calendarEvents[dateKey] || [];
        const hasEvent = dayEvents.length > 0;
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();

        days.push(
          <div
            key={`mini-${day}`}
            className={`mini-day 
              ${hasEvent ? 'has-event' : ''}
              ${isSelected ? 'selected' : ''}
              ${isToday ? 'today' : ''}
            `}
            onClick={() => {
              setCurrentDate(date);
              setSelectedDate(date);
            }}
            title={`${day}/${miniDate.getMonth() + 1}`}
          >
            {day}
            {hasEvent && <div className="event-indicator"></div>}
          </div>
        );
      }

      return days;
    }, [miniDate, selectedDate, calendarEvents, getDaysInMonth, getFirstDayOfMonth]);

    return (
      <div className="mini-calendar">
        <div className="mini-header">
          <button onClick={() => changeMonth(-1)}>‹</button>
          <span className="mini-title">
            {miniDate.toLocaleString('pt-BR', { month: 'long' })}
            <span className="mini-year">{miniDate.getFullYear()}</span>
          </span>
          <button onClick={() => changeMonth(1)}>›</button>
        </div>

        <div className="mini-weekdays">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
            <div key={index} className="mini-weekday">{day}</div>
          ))}
        </div>

        <div className="mini-days">
          {renderMiniCalendar()}
        </div>
      </div>
    );
  };

  // Time Slots Panel (AGENDA) - CORRIGIDO
 const TimeSlotsPanel = () => {
  const displayDate = selectedDate || currentDate;

  const monthYear = displayDate.toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  // 🔹 Agenda unificada por dia (COM PROTEÇÃO)
 const agendaPorDia = useMemo(() => {
  const agenda = {};

  if (!Array.isArray(projects)) return agenda;

  const addEvent = (dateKey, event) => {
    if (!agenda[dateKey]) agenda[dateKey] = [];
    agenda[dateKey].push(event);
  };

  projects.forEach(project => {
    if (!project) return;

    // 🔹 Início do projeto
    if (project.data_inicio) {
      const dateKey = project.data_inicio.split(' ')[0];
      addEvent(dateKey, {
        type: 'project-start',
        title: `Início do projeto: ${project.nome}`,
        color: '#48bb78'
      });
    }

    // 🔹 Fim do projeto
    if (project.data_fim) {
      const dateKey = project.data_fim.split(' ')[0];
      addEvent(dateKey, {
        type: 'project-end',
        title: `Fim do projeto: ${project.nome}`,
        color: '#f56565'
      });
    }

    // 🔹 Tarefas
    if (Array.isArray(project.tarefas)) {
      project.tarefas.forEach(tarefa => {
        if (!tarefa?.data_inicio) return;

        const dateKey = tarefa.data_inicio.split(' ')[0];
        addEvent(dateKey, {
          type: 'task',
          title: `Tarefa: ${tarefa.nome}`,
          color: '#4299e1',
          data: tarefa
        });
      });
    }

    // 🔹 Comentários
    if (Array.isArray(project.comentarios)) {
      project.comentarios.forEach(c => {
        if (!c?.created_at) return;

        const dateKey = c.created_at.split(' ')[0];
        addEvent(dateKey, {
          type: 'comment',
          title: 'Comentário adicionado',
          color: '#805ad5',
          data: c
        });
      });
    }
  });

  return agenda;
}, [projects]);


  const dayKey = displayDate.toISOString().split('T')[0];
  const dayEvents = agendaPorDia[dayKey] || [];

  return (
    <div className="time-slots-panel">
      <div className="panel-header">
        <h3>Agenda</h3>
        <span className="month-year">{monthYear}</span>
      </div>

      {/* Nenhum projeto selecionado */}
      {!selectedProjectId && (
        <div className="no-project-selected">
          <span>📋</span>
          <p>Selecione um projeto para ver a agenda</p>
        </div>
      )}

      {/* Agenda do dia */}
      {selectedProjectId && (
        <div className="agenda-day-group">
          <div className="agenda-day-header">
            <span className="weekday">
              {displayDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
            </span>
            <span className="date">
              {displayDate.toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="day-slots">
            {dayEvents.map((event, index) => (
              <div key={index} className="time-slot-item">
                <span
                  className="dot"
                  style={{ backgroundColor: event.color }}
                ></span>
                <span className="activity">{event.title}</span>
              </div>
            ))}

            {dayEvents.length === 0 && (
              <div className="no-slots-day">
                Nenhuma atividade neste dia
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};




  // Month View Component
  const MonthView = () => {
    const getDaysInMonth = useCallback((date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }, []);

    const getFirstDayOfMonth = useCallback((date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }, []);

    const renderCalendar = useCallback(() => {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = calendarEvents[dateKey] || [];
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();

        days.push(
          <div
            key={date.toISOString()}
            className={`calendar-day 
              ${isSelected ? 'selected' : ''}
              ${isToday ? 'today' : ''}
            `}
            onClick={() => { setSelectedDate(date); setCurrentDate(date); }}
          >
            <div className="day-header">
              <div className="day-number">{day}</div>
              {isToday && <div className="today-badge">Hoje</div>}
            </div>

            <div className="day-events">
              {dayEvents.map((event, index) => (
                <div
                  key={index}
                  className="event-item"
                  style={{ borderLeftColor: event.color }}
                >
                  <div className="event-dot" style={{ backgroundColor: event.color }}></div>
                  <span className="event-title">
                    {event.type === 'project' && (
                      <>
                        {event.eventType === 'start' ? 'Início: ' : 'Conclusão: '}
                        {event.data?.nome || 'Projeto'}
                      </>
                    )}

                    {event.type === 'task' && (
                      <>
                        Tarefa: {event.data?.atividade || 'Atividade'}
                      </>
                    )}

                    {event.type === 'comment' && (
                      <>
                        Comentário adicionado
                      </>
                    )}
                  </span>

                </div>
              ))}
            </div>
          </div>
        );
      }

      return days;
    }, [currentDate, selectedDate, calendarEvents, getDaysInMonth, getFirstDayOfMonth]);

    return (
      <div className="calendar-view month-view">
        <div className="calendar-grid">
          <div className="weekdays">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {renderCalendar()}
          </div>
        </div>
      </div>
    );
  };

  // Week View Component
  const WeekView = () => {
    const getWeekDays = useCallback(() => {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const days = [];

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
      }

      return days;
    }, [currentDate]);

    const timeSlots = useMemo(() => {
      const slots = [];
      for (let hour = 0; hour < 24; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
      return slots;
    }, []);

    const weekDays = getWeekDays();

    return (
      <div className="calendar-view week-view">
        <div className="week-header">
          <div className="week-time-label">Hora</div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`week-day-header ${day.toDateString() === new Date().toDateString() ? 'today' : ''}`}
            >
              {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              <br />
              {day.getDate()}
            </div>
          ))}
        </div>

        <div className="week-grid">
          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={time}>
              <div className="time-slot">{time}</div>
              {weekDays.map((day, dayIndex) => {
                const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                const dayEvents = calendarEvents[dateKey] || [];
                const timeEvents = dayEvents.filter(event =>
                  event.type === 'time-slot' &&
                  event.horario.hora.split(':')[0] === time.substring(0, 2)
                );

                return (
                  <div
                    key={day.toISOString()}
                    className={`week-day-cell ${timeEvents.length > 0 ? 'has-event' : ''}`}
                    onClick={() => { setSelectedDate(day); setCurrentDate(day); }}
                  >
                    {timeEvents.map((event, eventIndex) => (
                      <div key={eventIndex} className="week-event">
                        {event.horario.atividade}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Day View Component
  const DayView = () => {
    const timeSlots = useMemo(() => {
      const slots = [];
      for (let hour = 0; hour < 24; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
      return slots;
    }, []);

    const dayEvents = useMemo(() => {
      if (!selectedDate) return [];

      const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      return calendarEvents[dateKey] || [];
    }, [selectedDate, calendarEvents]);

    return (
      <div className="calendar-view day-view">
        <div className="day-header">
          <h2>
            {selectedDate
              ? selectedDate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
              : 'Selecione uma data'}
          </h2>
        </div>

        <div className="day-grid">
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="day-time-slot">{time}</div>

              <div className="day-event-slot">
                {dayEvents
                  .filter(
                    event =>
                      event.type === 'time-slot' &&
                      event.horario.hora.split(':')[0] === time.substring(0, 2)
                  )
                  .map((event, index) => (
                    <div
                      key={`${event.horario.hora}-${index}`}
                      className="day-event"
                    >
                      <strong>{event.horario.hora}</strong> — {event.horario.atividade}
                    </div>
                  ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Year View Component
  const YearView = () => {
    const months = useMemo(() => {
      return Array.from({ length: 12 }, (_, i) =>
        new Date(currentDate.getFullYear(), i, 1)
      );
    }, [currentDate]);

    const getDaysInMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const renderMonth = (monthDate) => {
      const daysInMonth = getDaysInMonth(monthDate);
      const firstDay = getFirstDayOfMonth(monthDate);
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(
          <div
            key={`empty-${monthDate.getMonth()}-${i}`}
            className="year-day empty"
          ></div>
        );
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth(),
          day
        );

        const dateKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        const dayEvents = calendarEvents[dateKey] || [];
        const isToday = date.toDateString() === new Date().toDateString();

        days.push(
          <div
            key={`${monthDate.getMonth()}-${day}`}
            className={`year-day 
              ${isToday ? 'today' : ''}
              ${dayEvents.length > 0 ? 'has-event' : ''}
            `}
            onClick={() => {
              setSelectedDate(date);
              setCurrentDate(date);
              setViewMode('month');
            }}
            title={`${day}/${monthDate.getMonth() + 1}`}
          >
            {day}
          </div>
        );
      }

      return days;
    };

    return (
      <div className="calendar-view year-view">
        {months.map((month) => (
          <div key={month.toISOString()} className="year-month">
            <div className="year-month-header">
              {month.toLocaleString('pt-BR', { month: 'long' })}
            </div>

            <div className="mini-weekdays">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day) => (
                <div key={day} className="mini-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="year-month-days">{renderMonth(month)}</div>
          </div>
        ))}
      </div>
    );
  };

  // Information Panel Component
  const InfoPanel = () => {
    const dayEvents = useMemo(() => {
      if (!selectedDate) return [];

      const dateKey = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

      return calendarEvents[dateKey] || [];
    }, [selectedDate, calendarEvents]);

    const projectEvents = dayEvents.filter(event => event.type === 'project');
    const timeSlotEvents = dayEvents.filter(event => event.type === 'time-slot');

    if (!selectedDate) {
      return (
        <div className="info-panel">
          <h3>Detalhes da Data</h3>
          <div className="no-selection">
            <span className="select-icon">📅</span>
            <p>Selecione uma data para ver os detalhes</p>
          </div>
        </div>
      );
    }

    return (
      <div className="info-panel">
        <h3>Detalhes — {selectedDate.toLocaleDateString('pt-BR')}</h3>

        <div className="date-summary">
          <div className="summary-item">
            <span className="summary-count">{projectEvents.length}</span>
            <span className="summary-label">Projetos</span>
          </div>
          <div className="summary-item">
            <span className="summary-count">{timeSlotEvents.length}</span>
            <span className="summary-label">Horários</span>
          </div>
          <div className="summary-item">
            <span className="summary-count">{dayEvents.length}</span>
            <span className="summary-label">Total</span>
          </div>
        </div>

        {projectEvents.length > 0 && (
          <div className="events-section">
            <h4>Eventos de Projeto</h4>
            {projectEvents.map((event, index) => (
              <div key={index} className="project-card">
                <div className="project-header">
                  <h5>{event.project.nome}</h5>
                  <span className={`project-badge ${event.eventType}`}>
                    {event.eventType === 'start' ? 'Início' : 'Conclusão'}
                  </span>
                </div>
                <div className="project-dates">
                  <div className="date-item">
                    <span>Data:</span>
                    <strong>
                      {new Date(
                        event.eventType === 'start'
                          ? event.project.data_inicio
                          : event.project.data_fim
                      ).toLocaleDateString('pt-BR')}
                    </strong>
                  </div>
                  <div className="date-item">
                    <span>Hora:</span>
                    <strong>
                      {new Date(
                        event.eventType === 'start'
                          ? event.project.data_inicio
                          : event.project.data_fim
                      ).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {timeSlotEvents.length > 0 && (
          <div className="events-section">
            <h4>Horários Agendados</h4>
            {timeSlotEvents.map((event, index) => (
              <div
                key={`${index}-${event.horario.hora}`}
                className="time-slot-mini-card"
              >
                <div className="time-slot-header">
                  <span className="hora">{event.horario.hora}</span>
                </div>
                <div className="atividade">{event.horario.atividade}</div>
              </div>
            ))}
          </div>
        )}

        {dayEvents.length === 0 && (
          <div className="no-events">
            <span>📅</span>
            <p>Nenhum evento para esta data</p>
          </div>
        )}
      </div>
    );
  };

  // Main Calendar Component
  const MainCalendar = () => {
    switch (viewMode) {
      case 'day':
        return <DayView />;
      case 'week':
        return <WeekView />;
      case 'month':
        return <MonthView />;
      case 'year':
        return <YearView />;
      default:
        return <MonthView />;
    }
  };

  return (
    <div className="calendar-system">
      <CalendarHeader
        allProjects={allProjects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentDate={currentDate}
        goToToday={goToToday}
        navigateDay={navigateDay}
        navigateWeek={navigateWeek}
        navigateMonth={navigateMonth}
        navigateYear={navigateYear}
      />

      <div className="calendar-body">
        <div className="sidebar">
          <MiniCalendar />
          <TimeSlotsPanel />
        </div>

        <div className="main-content">
          <MainCalendar />
        </div>

        <div className="info-sidebar">
          <InfoPanel />
        </div>
      </div>
    </div>
  );
};

export default CalendarSystem;