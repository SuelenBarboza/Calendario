import React from 'react';
import './Header.css';
import logo from '../assets/logo.png';
import { useUsuario } from '../context/UsuarioContext';

export default function Header() {
  const { usuario } = useUsuario();

  if (!usuario) return null; // ainda não carregou

  const { nome = 'Usuário', tipo = '', foto = '../Assets/img/avatar.png' } = usuario;

  // Ajusta caminho da foto caso venha relativo do PHP
  const avatarUrl = foto.startsWith('http')
    ? foto
    : `http://localhost/Innovatech/${foto.replace(/^(\.\.\/)+/, '')}`;

  return (
    <header>
      <nav>
        <ul className="menu">

          {/* Logo */}
          <li>
            <div className="logo-container">
              <a href="http://localhost/Innovatech/Public/Home.php">
                <img src={logo} alt="Logo" />
              </a>
            </div>
          </li>

          {/* Início */}
          <li><a href="http://localhost/Innovatech/Public/Home.php">Início</a></li>

          {/* Projetos */}
          <li>
            <a href="#">Projetos</a>
            <ul className="submenu">
              <li><a href="http://localhost/Innovatech/Shared/RegisterProject.php">Cadastrar Projetos</a></li>
              <li><a href="http://localhost/Innovatech/Shared/ViewListProject.php">Visualizar Lista de Projetos</a></li>
            </ul>
          </li>

          {/* Tarefas */}
          <li>
            <a href="#">Tarefas</a>
            <ul className="submenu">
              <li><a href="http://localhost/Innovatech/Shared/AddTasks.php">Adicionar Tarefas</a></li>
              <li><a href="http://localhost/Innovatech/Shared/ViewListTasks.php">Visualizar Lista de Tarefas</a></li>
            </ul>
          </li>

          {/* Colaboração */}
          <li>
            <a href="#">Colaboração</a>
            <ul className="submenu">
              <li><a href="http://localhost/Innovatech/Shared/Comments.php">Comentários</a></li>
              <li><a href="http://localhost/Innovatech/Shared/ViewComments.php">Visualizar Comentários</a></li>

              {tipo === 'Aluno' && (
                <>
                  <li><a href="http://localhost/Innovatech/Shared/SendReport.php">Relatório de Progresso</a></li>
                  <li><a href="http://localhost/Innovatech/Shared/MyReports.php">Meus Relatórios</a></li>
                </>
              )}

              {tipo === 'Professor' && (
                <li><a href="http://localhost/Innovatech/Shared/ViewReportsTeacher.php">Relatórios Recebidos</a></li>
              )}
            </ul>
          </li>

          {/* Calendário */}
          <li>
            <a href="#">Calendário</a>
            <ul className="submenu">
              <li><a href="http://localhost:3000">Visualizar Calendário</a></li>
            </ul>
          </li>

          {/* Gerenciamento */}
          {['Admin', 'Coordenador'].includes(tipo) && (
            <li>
              <a href="#">Gerenciamento</a>
              <ul className="submenu">
                {tipo === 'Admin' && <li><a href="http://localhost/Innovatech/Shared/UserManagerAdmin.php">Gerenciar Usuários</a></li>}
                {tipo === 'Coordenador' && <li><a href="http://localhost/Innovatech/Shared/UserManagerCoord.php">Gerenciar Alunos e Professores</a></li>}
              </ul>
            </li>
          )}

          {/* Suporte */}
          <li>
            <a href="#">Suporte</a>
            <ul className="submenu">
              {['Aluno', 'Professor', 'Coordenador'].includes(tipo) && (
                <>
                  <li><a href="http://localhost/Innovatech/Shared/Support.php">Solicitar Suporte</a></li>
                  <li><a href="http://localhost/Innovatech/Shared/MyCallings.php">Meus Chamados</a></li>
                </>
              )}

              {tipo === 'Admin' && <li><a href="http://localhost/Innovatech/Shared/SuportAdmin.php">Painel de Solicitações</a></li>}
            </ul>
          </li>

          {/* Perfil do usuário */}
          <li className="user-profile">
            <a href="#">
              <img src={avatarUrl} className="user-avatar" alt="Foto do usuário" />
              <div className="user-info">
                <span className="user-name">{nome}</span>
                <span className="user-role">{tipo}</span>
              </div>
            </a>
            <ul className="submenu">
              <li><a href="http://localhost/Innovatech/Shared/Profile.php">Meu perfil</a></li>
              <li><a href="http://localhost/Innovatech/Public/Logout.php">Sair</a></li>
            </ul>
          </li>

          {/* Notificações */}
          <li className="bell-icon">
            <a href="javascript:void(0)">
              <i className="fa-regular fa-bell"></i>
              <span className="notification-bubble"></span>
            </a>
            <div className="notification-menu">
              <ul>
                <li><a href="#">Você tem 3 novos recados!</a></li>
                <li><a href="#">Reunião agendada para amanhã.</a></li>
                <li><a href="#">Novos projetos adicionados.</a></li>
              </ul>
            </div>
          </li>

        </ul>
      </nav>
    </header>
  );
}