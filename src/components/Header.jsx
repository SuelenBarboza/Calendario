import './Header.css';
import logo from '../assets/logo.png';

export default function Header() {
  return (
    <header>
      {/* Fontes e ícones devem ficar no index.html do React */}
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
            <a href="http://localhost/Innovatech/Public/Home.php">Início</a>
          </li>

          <li>
            <a href="#">Projetos</a>
            <ul className="submenu">
              <li>
                <a href="http://localhost/Innovatech/Shared/RegisterProject.php">
                  Cadastrar Projetos
                </a>
              </li>
              <li>
                <a href="http://localhost/Innovatech/Shared/ViewListProject.php">
                  Visualizar Lista de Projetos
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="#">Tarefas</a>
            <ul className="submenu">
              <li>
                <a href="http://localhost/Innovatech/Shared/AddTasks.php">
                  Adicionar Tarefas
                </a>
              </li>
              <li>
                <a href="http://localhost/Innovatech/Shared/ViewListTasks.php">
                  Visualizar Lista de Tarefas
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="#">Colaboração</a>
            <ul className="submenu">
              <li>
                <a href="http://localhost/Innovatech/Shared/Comments.php">
                  Comentários
                </a>
              </li>
              <li>
                <a href="http://localhost/Innovatech/Shared/ViewComments.php">
                  Visualizar Comentários
                </a>
              </li>
              <li>
                <a href="http://localhost/Innovatech/Shared/SendReport.php">
                  Relatório de Progresso
                </a>
              </li>
              <li>
                <a href="http://localhost/Innovatech/Shared/MyReports.php">
                  Meus Relatórios
                </a>
              </li>
              <li>
                <a href="http://localhost/Innovatech/Shared/ViewReportsTeacher.php">
                  Relatórios Recebidos
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="#">Calendário</a>
            <ul className="submenu">
              <li>
                <a href="http://localhost:3000">
                  Visualizar Calendário
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="#">Gerenciamento</a>
            <ul className="submenu">
              <li>
                <a href="http://localhost/Innovatech/Shared/UserManagerAdmin.php">
                  Gerenciar Usuários
                </a>
              </li>
              <li>
                <a href="http://localhost/Innovatech/Shared/UserManagerCoord.php">
                  Gerenciar Alunos e Professores
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="#">Suporte</a>
            <ul className="submenu">
              <li>
                <a href="http://localhost/Innovatech/Shared/Support.php">
                  Solicitar Suporte
                </a>
              </li>
              <li>
                <a href="http://localhost/Innovatech/Shared/SuportAdmin.php">
                  Painel de Solicitações
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="http://localhost/Innovatech/Public/Logout.php">
              Sair
            </a>
          </li>

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
