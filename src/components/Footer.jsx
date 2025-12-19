import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">

        <div className="footer-section about">
          <h2>Sobre o Innovatech</h2>
          <p>
            O Innovatech é uma plataforma inovadora focada no desenvolvimento
            tecnológico e soluções acadêmicas.
          </p>
        </div>

        <div className="footer-section contact">
          <h2>Contato</h2>
          <p><i className="fas fa-map-marker-alt"></i> Rua da Inovação, 123 - Araçatuba, SP</p>
          <p><i className="fas fa-phone"></i> (18) 98765-4321</p>
          <p><i className="fas fa-envelope"></i> contato@innovatech.com</p>
        </div>

        <div className="footer-section links">
          <h2>Links Úteis</h2>
          <ul>
            <li><a href="#">Sobre Nós</a></li>
            <li><a href="#">Projetos</a></li>
            <li><a href="#">Suporte</a></li>
            <li><a href="#">Contato</a></li>
            <li><a href="#">Política de Privacidade</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h2>Siga-nos</h2>
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Innovatech. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
