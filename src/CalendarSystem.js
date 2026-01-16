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

  // 🔄 Função para buscar dados do calendário
  const fetchCalendarData = async (projectId = null) => {
    try {
      let url = 'http://localhost/Innovatech/Config/getCalendarData.php';
      
      // Adiciona o parâmetro projeto_id apenas se um projeto for selecionado
      if (projectId) {
        url += `?projeto_id=${projectId}`;
      } else {
        url += '?projeto_id=all'; // Para buscar todos os projetos para o seletor
      }

      const res = await fetch(url);
      const data = await res.json();

      console.log('Resposta do backend para projeto ID:', projectId, data);

      if (projectId) {
        // Se um projeto específico foi solicitado, atualize apenas os projetos
        setProjects(data.projects || []);
        setTimeSlots(data.timeSlots || []);
      } else {
        // Se nenhum projeto específico (ou "all"), atualize a lista de projetos
        setAllProjects(data.allProjects || []);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do calendário:', error);
    }
  };

  // 🔄 Efeito para carregar a lista de projetos inicial
  useEffect(() => {
    fetchCalendarData(); // Carrega a lista de projetos
  }, []);

  // 🔄 Efeito para buscar dados quando o projeto selecionado muda
  useEffect(() => {
    if (selectedProjectId) {
      fetchCalendarData(selectedProjectId);
    } else {
      // Se nenhum projeto selecionado, limpa os dados
      setProjects([]);
      setTimeSlots([]);
    }
  }, [selectedProjectId]);

  // Converter projetos e horários para eventos do calendário
  const calendarEvents = useMemo(() => {
    const events = {};

    const addEvent = (dateKey, event) => {
      if (!events[dateKey]) events[dateKey] = [];
      events[dateKey].push(event);
    };

    // 🔹 PROJETOS / TAREFAS / COMENTÁRIOS (apenas do projeto selecionado)
    projects.forEach(project => {
      if (!project) return;

      // 🔹 Início do projeto
      if (project.data_inicio) {
        const dateKey = project.data_inicio.split('T')[0] || project.data_inicio.split(' ')[0];
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
        const dateKey = project.data_fim.split('T')[0] || project.data_fim.split(' ')[0];
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
          if (!tarefa?.created_at) return;

          const dateKey = tarefa.created_at.split('T')[0] || tarefa.created_at.split(' ')[0];

          addEvent(dateKey, {
            type: 'task',
            title: tarefa.nome, // só o título, sem "Tarefa:"
            color: '#4299e1',
            data: tarefa,
            time: new Date(tarefa.created_at).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })
          });
        });
      }


      
      // 🔹 Comentários
      if (Array.isArray(project.comentarios)) {
        project.comentarios.forEach(c => {
          if (!c?.created_at) return;

          const dateKey = c.created_at.split('T')[0] || c.created_at.split(' ')[0];

          addEvent(dateKey, {
            type: 'comment',
            title: `Comentário - ${c.usuario_nome}`,
            color: '#805ad5',
            data: c
          });
        });
      }});

    console.log('Eventos do calendário:', events);
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

    return (
      <div className="calendar-header">
        <div className="project-selector">
          <select
            value={selectedProjectId || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setSelectedProjectId(Number(value));
              } else {
                setSelectedProjectId(null);
              }
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              color: '#2d3748',
              fontSize: '14px',
              cursor: 'pointer',
              minWidth: '200px'
            }}
          >
            <option value="">Todos os projetos</option>
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
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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

 
  // Time Slots Panel (AGENDA) - NOVA VERSÃO ESTILO IMAGEM
const TimeSlotsPanel = () => {
  // Organizar eventos por data
  const eventosPorData = useMemo(() => {
    const eventosAgrupados = {};

    projects.forEach(project => {
      if (!project) return;

      // Adicionar início do projeto
      if (project.data_inicio) {
        const dataInicio = project.data_inicio.split(' ')[0];
        if (!eventosAgrupados[dataInicio]) {
          eventosAgrupados[dataInicio] = [];
        }
        eventosAgrupados[dataInicio].push({
          type: 'project-start',
          time: new Date(project.data_inicio).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          title: 'Início do Projeto',
          projectName: project.nome,
          color: '#48bb78'
        });
      }

      // Adicionar fim do projeto
      if (project.data_fim) {
        const dataFim = project.data_fim.split(' ')[0];
        if (!eventosAgrupados[dataFim]) {
          eventosAgrupados[dataFim] = [];
        }
        eventosAgrupados[dataFim].push({
          type: 'project-end',
          time: new Date(project.data_fim).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          title: 'Finalização',
          projectName: project.nome,
          color: '#f56565'
        });
      }

      // Adicionar tarefas
      if (Array.isArray(project.tarefas)) {
        project.tarefas.forEach(tarefa => {
          if (!tarefa?.data_inicio) return;

          const dataTarefa = tarefa.data_inicio.split(' ')[0];
          if (!eventosAgrupados[dataTarefa]) {
            eventosAgrupados[dataTarefa] = [];
          }

          // Extrair hora da tarefa
          const horaTarefa = new Date(tarefa.data_inicio).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          });

          eventosAgrupados[dataTarefa].push({
            type: 'task',
            time: horaTarefa,
            title: tarefa.nome,
            description: tarefa.descricao || '',
            status: tarefa.status || 'pendente',
            color: '#4299e1'
          });
        });
      }

      // Adicionar comentários
      if (Array.isArray(project.comentarios)) {
        project.comentarios.forEach(comentario => {
          if (!comentario?.created_at) return;

          const dataComentario = comentario.created_at.split(' ')[0];
          if (!eventosAgrupados[dataComentario]) {
            eventosAgrupados[dataComentario] = [];
          }

          // Extrair hora do comentário
          const horaComentario = new Date(comentario.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          });

          eventosAgrupados[dataComentario].push({
            type: 'comment',
            time: horaComentario,
            title: 'Comentário',
            content: comentario.comentario || '',
            authorName: comentario.usuario_nome,
            color: '#805ad5'
          });
        });
      }
    });

    // Ordenar eventos por hora dentro de cada data
    Object.keys(eventosAgrupados).forEach(data => {
      eventosAgrupados[data].sort((a, b) => {
        const horaA = a.time.split(':').map(Number);
        const horaB = b.time.split(':').map(Number);
        
        // Converter para minutos para comparação
        const minutosA = horaA[0] * 60 + horaA[1];
        const minutosB = horaB[0] * 60 + horaB[1];
        
        return minutosA - minutosB;
      });
    });

    return eventosAgrupados;
  }, [projects]);

  // Converter datas para ordenação
  const datasOrdenadas = useMemo(() => {
    const datas = Object.keys(eventosPorData);
    return datas.sort((a, b) => new Date(a) - new Date(b));
  }, [eventosPorData]);

  // #############################################
  // INSIRA AS NOVAS FUNÇÕES AQUI ↓↓↓
  // #############################################

  // NOVA FUNÇÃO PARA FORMATAR HORA AM/PM
  const formatarHoraAMPM = (horaStr) => {
    if (!horaStr) return { hora: '--:--', periodo: '' };
    
    try {
      const [hora, minuto] = horaStr.split(':').map(Number);
      const periodo = hora >= 12 ? 'PM' : 'AM';
      const horaFormatada = hora % 12 || 12;
      return {
        hora: `${horaFormatada}:${minuto.toString().padStart(2, '0')}`,
        periodo: periodo
      };
    } catch (error) {
      return { hora: horaStr, periodo: '' };
    }
  };

  // NOVA FUNÇÃO PARA FORMATAR DATA
  const formatarDataCompleta = (dataString) => {
    const data = new Date(dataString);
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    
    // Verificar se é hoje
    if (data.toDateString() === hoje.toDateString()) {
      return 'Hoje';
    }
    // Verificar se é amanhã
    if (data.toDateString() === amanha.toDateString()) {
      return 'Amanhã';
    }
    
    const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' });
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    
    return {
      diaSemana: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1),
      dataFormatada: `${dia}/${mes}/${ano}`
    };
  };

  // #############################################
  // FIM DAS NOVAS FUNÇÕES ↑↑↑
  // #############################################

  // Se não há projeto selecionado
  if (!selectedProjectId) {
    return (
      <div className="time-slots-panel">
        <div className="panel-header">
          <h3>Agenda</h3>
          <span className="month-year">
            {currentDate.toLocaleString('pt-BR', { 
              month: 'long', 
              year: 'numeric' 
            }).toUpperCase()}
          </span>
        </div>
        <div className="no-project-selected">
          <span className="icon">📋</span>
          <p>Selecione um projeto para ver a agenda</p>
        </div>
      </div>
    );
  }

  // Se há projeto selecionado mas não há eventos
  if (datasOrdenadas.length === 0) {
    return (
      <div className="time-slots-panel">
        <div className="panel-header">
          <h3>Agenda</h3>
          <span className="month-year">
            {currentDate.toLocaleString('pt-BR', { 
              month: 'long', 
              year: 'numeric' 
            }).toUpperCase()}
          </span>
        </div>
        <div className="no-events">
          <p>Nenhuma atividade agendada para este projeto</p>
        </div>
      </div>
    );
  }

  return (
  <div className="time-slots-panel">
    <div className="panel-header">
      <h3>Agenda</h3>
      <span className="month-year">
        {currentDate
          .toLocaleString('pt-BR', {
            month: 'long',
            year: 'numeric',
          })
          .toUpperCase()}
      </span>
    </div>

    <div className="agenda-days-list">
      {datasOrdenadas.map((dataStr) => {
        const dataInfo = formatarDataCompleta(dataStr);
        const diaSemana =
          typeof dataInfo === 'object' ? dataInfo.diaSemana : dataInfo;
        const dataFormatada =
          typeof dataInfo === 'object' ? dataInfo.dataFormatada : '';

        const eventosDoDia = eventosPorData[dataStr] || [];

        const eventosInicioProjeto = eventosDoDia.filter(
          (e) => e.type === 'project-start'
        );
        const eventosTarefas = eventosDoDia.filter((e) => e.type === 'task');
        const eventosComentarios = eventosDoDia.filter(
          (e) => e.type === 'comment'
        );
        const eventosFimProjeto = eventosDoDia.filter(
          (e) => e.type === 'project-end'
        );

        return (
          <div key={dataStr} className="agenda-day-group">
            {/* Cabeçalho do dia */}
            <div className="agenda-day-header">
              <div>
                {diaSemana}
                {dataFormatada && (
                  <span className="date"> {dataFormatada}</span>
                )}
              </div>
            </div>

            {/* Início do projeto (faixa roxa) */}
            {eventosInicioProjeto.map((evento, idx) => (
              <div key={`inicio-${idx}`} className="agenda-main-event-title">
                Planejamento de Projeto — {evento.projectName}
              </div>
            ))}

            {/* Comentários */}
            {eventosComentarios.map((evento, idx) => (
              <div key={`comentario-${idx}`} className="horario-item-image">
                <span className="dot blue"></span>
                <span className="time-agenda">{evento.time}</span>
                <span className="activity-agenda">Comentário</span>
              </div>
            ))}

            {/* Tarefas */}
            {eventosTarefas.map((evento, idx) => (
              <div key={`tarefa-${idx}`} className="horario-item-image">
                <span className="dot purple"></span>
                <span className="time-agenda">{evento.time}</span>
                <span className="activity-agenda">{evento.title}</span>
              </div>
            ))}

            {/* Finalização */}
            {eventosFimProjeto.map((evento, idx) => (
              <div key={`fim-${idx}`} className="horario-item-image">
                <span className="dot red"></span>
                <span className="time-agenda">{evento.time}</span>
                <span className="activity-agenda">Finalização do projeto</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  </div>
);}


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
                        Tarefa: {event.data?.nome || 'Atividade'}
                      </>
                    )}

                    {event.type === 'comment' && (
                      <>
                        Comentário
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
                  event.type === 'task' || event.type === 'project'
                );

                return (
                  <div
                    key={day.toISOString()}
                    className={`week-day-cell ${timeEvents.length > 0 ? 'has-event' : ''}`}
                    onClick={() => { setSelectedDate(day); setCurrentDate(day); }}
                  >
                    {timeEvents.map((event, eventIndex) => (
                      <div 
                        key={eventIndex} 
                        className="week-event"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.type === 'project' 
                          ? (event.eventType === 'start' ? 'Início' : 'Fim')
                          : 'Tarefa'}
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
                  .filter(event => event.type === 'task' || event.type === 'project')
                  .map((event, index) => (
                    <div
                      key={`${event.type}-${index}`}
                      className="day-event"
                      style={{ backgroundColor: event.color }}
                    >
                      <strong>
                        {event.type === 'project' 
                          ? (event.eventType === 'start' ? 'Início: ' : 'Fim: ')
                          : 'Tarefa: '}
                      </strong>
                      {event.data?.nome || 'Evento'}
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
    const taskEvents = dayEvents.filter(event => event.type === 'task');
    const commentEvents = dayEvents.filter(event => event.type === 'comment');

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

    // Mostra informações do projeto selecionado
    const selectedProject = projects.length > 0 ? projects[0] : null;

    return (
      <div className="info-panel">
        <h3>Detalhes — {selectedDate.toLocaleDateString('pt-BR')}</h3>

        {selectedProject && (
          <div className="project-card" style={{ marginBottom: '20px' }}>
            <div className="project-header">
              <h5>{selectedProject.nome}</h5>
              <span className={`project-badge ${selectedProject.status}`}>
                {selectedProject.status || 'Ativo'}
              </span>
            </div>
            <div className="project-desc">
              {selectedProject.descricao || 'Sem descrição'}
            </div>
            <div className="project-dates">
              <div className="date-item">
                <span>Início:</span>
                <strong>
                  {selectedProject.data_inicio 
                    ? new Date(selectedProject.data_inicio).toLocaleDateString('pt-BR')
                    : 'Não definido'}
                </strong>
              </div>
              <div className="date-item">
                <span>Término:</span>
                <strong>
                  {selectedProject.data_fim
                    ? new Date(selectedProject.data_fim).toLocaleDateString('pt-BR')
                    : 'Não definido'}
                </strong>
              </div>
            </div>
            <div className="project-members">
              <strong>Alunos:</strong> {selectedProject.alunos?.join(', ') || 'Nenhum'}
              <br />
              <strong>Orientadores:</strong> {selectedProject.orientadores?.join(', ') || 'Nenhum'}
            </div>
          </div>
        )}

        <div className="date-summary">
          <div className="summary-item start">
            <span className="summary-count">{projectEvents.length}</span>
            <span className="summary-label">Projetos</span>
          </div>
          <div className="summary-item ongoing">
            <span className="summary-count">{taskEvents.length}</span>
            <span className="summary-label">Tarefas</span>
          </div>
          <div className="summary-item end">
            <span className="summary-count">{commentEvents.length}</span>
            <span className="summary-label">Comentários</span>
          </div>
        </div>

        {taskEvents.length > 0 && (
          <div className="events-section">
            <h4>Tarefas</h4>
            {taskEvents.map((event, index) => (
              <div key={index} className="time-slot-mini-card">
                <div className="time-slot-header">
                  <span className="hora">
                    {event.data?.data_inicio 
                      ? new Date(event.data.data_inicio).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })
                      : 'Sem hora'}
                  </span>
                </div>
                <div className="atividade">
                  <strong>{event.data?.nome || 'Tarefa'}</strong>
                  <br />
                  <small>{event.data?.descricao || 'Sem descrição'}</small>
                </div>
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