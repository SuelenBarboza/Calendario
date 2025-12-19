import './Header.css';
import logo from '../assets/logo.png'; // ajuste o caminho

export default function Header() {
  return (
    <header>
      <nav>
        <ul className="menu">

          <li>
            <div className="logo-container">
              <a href="http://localhost/Innovatech/Public/Home.php">
                <img src={logo} alt="Logo" />
              </a>
            </div>
          </li>

          <li>
            <a href="#">Projetos</a>
            <ul className="submenu">
              <li><a href="http://localhost/Innovatech/Shared/RegisterProject.php">Cadastrar Projetos</a></li>
              <li><a href="http://localhost/Innovatech/Shared/EditProject.php">Editar Projetos</a></li>
              <li><a href="http://localhost/Innovatech/Shared/ViewListProject.php">Visualizar Lista de Projetos</a></li>
              <li><a href="http://localhost/Innovatech/Shared/CompleteProject.php">Concluir Projeto</a></li>
            </ul>
          </li>

          <li>
            <a href="#">Tarefas</a>
            <ul className="submenu">
              <li><a href="http://localhost/Innovatech/Shared/AddTasks.php">Adicionar Tarefas</a></li>
              <li><a href="http://localhost/Innovatech/Shared/EditTasks.php">Editar Tarefas</a></li>
              <li><a href="http://localhost/Innovatech/Shared/ViewListTasks.php">Visualizar Lista de Tarefas</a></li>
              <li><a href="http://localhost/Innovatech/Shared/CompleteTasks.php">Concluir Tarefas</a></li>
            </ul>
          </li>

          <li>
            <a href="#">Calendário</a>
            <ul className="submenu">
              <li><a href="http://localhost:3000">Visualizar Calendário</a></li>
            </ul>
          </li>

          <li>
            <a href="#">Relatórios</a>
            <ul className="submenu">
              <li><a href="http://localhost/Innovatech/Shared/ProgressReport.php">Relatório de Progresso</a></li>
              <li><a href="http://localhost/Innovatech/Shared/PerformanceReport.php">Relatório de Desempenho</a></li>
            </ul>
          </li>

          <li>
            <a href="#">Configurações</a>
            <ul className="submenu">
              <li><a href="http://localhost/Innovatech/Shared/SystemSettings.php">Configurações do Sistema</a></li>
              <li><a href="http://localhost/Innovatech/Users/Admin/ValidateUser.php">Gerenciar Usuários</a></li>
            </ul>
          </li>

          <li><a href="http://localhost/Innovatech/Shared/Support.php">Suporte</a></li>
          <li><a href="http://localhost/Innovatech/Logout.php">Sair</a></li>

          <li className="bell-icon">
            <a href="#">
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
