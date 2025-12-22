import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Aqui você pode adicionar a lógica de inscrição
      console.log('Email inscrito:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const socialLinks = [
    { icon: '📘', label: 'Facebook', url: '#' },
    { icon: '📸', label: 'Instagram', url: '#' },
    { icon: '🐦', label: 'Twitter', url: '#' },
    { icon: '💼', label: 'LinkedIn', url: '#' },
    { icon: '📺', label: 'YouTube', url: '#' }
  ];

  const quickLinks = [
    { text: 'Sobre Nós', url: '/sobre' },
    { text: 'Nossos Serviços', url: '/servicos' },
    { text: 'Portfólio', url: '/portfolio' },
    { text: 'Blog', url: '/blog' },
    { text: 'Fale Conosco', url: '/contato' }
  ];

  const bottomLinks = [
    { text: 'Política de Privacidade', url: '/privacidade' },
    { text: 'Termos de Uso', url: '/termos' },
    { text: 'Política de Cookies', url: '/cookies' },
    { text: 'Mapa do Site', url: '/mapa' }
  ];

  const contactInfo = [
    { icon: '📍', title: 'Endereço', content: 'Rua Exemplo, 123<br>São Paulo - SP' },
    { icon: '📞', title: 'Telefone', content: '(11) 99999-9999' },
    { icon: '✉️', title: 'Email', content: 'contato@innovatech.com' }
  ];

  return (
    <>
      <FooterStyles />
      <FooterContainer>
        <FooterContent>
          
          {/* Seção Contato */}
          <FooterSection>
            <SectionTitle>Contato</SectionTitle>
            <ContactInfo>
              {contactInfo.map((item, index) => (
                <ContactItem key={index}>
                  <ContactIcon>{item.icon}</ContactIcon>
                  <ContactText>
                    <strong>{item.title}:</strong>
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                  </ContactText>
                </ContactItem>
              ))}
            </ContactInfo>
          </FooterSection>

          {/* Seção Links Rápidos */}
          <FooterSection>
            <SectionTitle>Links Rápidos</SectionTitle>
            <LinksList>
              {quickLinks.map((link, index) => (
                <ListItem key={index}>
                  <QuickLink to={link.url}>{link.text}</QuickLink>
                </ListItem>
              ))}
            </LinksList>
          </FooterSection>

          {/* Seção Redes Sociais */}
          <FooterSection>
            <SectionTitle>Siga-nos</SectionTitle>
            <SocialText>Conecte-se conosco nas redes sociais</SocialText>
            <SocialLinks>
              {socialLinks.map((social, index) => (
                <SocialIcon 
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </SocialIcon>
              ))}
            </SocialLinks>
          </FooterSection>

          {/* Seção Newsletter */}
          <FooterSection>
            <SectionTitle>Newsletter</SectionTitle>
            <NewsletterText>Receba nossas novidades por email</NewsletterText>
            <NewsletterForm onSubmit={handleSubmit}>
              <NewsletterInput
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <NewsletterButton type="submit">
                {subscribed ? '✓ Inscrito!' : 'Inscrever'}
              </NewsletterButton>
              {subscribed && <SuccessMessage>Obrigado pela inscrição!</SuccessMessage>}
            </NewsletterForm>
          </FooterSection>

        </FooterContent>

        {/* Rodapé Inferior */}
        <FooterBottom>
          <Copyright>
            © {new Date().getFullYear()} Innovatech. Todos os direitos reservados.
          </Copyright>
          <BottomLinks>
            {bottomLinks.map((link, index) => (
              <BottomLink key={index} to={link.url}>
                {link.text}
              </BottomLink>
            ))}
          </BottomLinks>
        </FooterBottom>

      </FooterContainer>
    </>
  );
};