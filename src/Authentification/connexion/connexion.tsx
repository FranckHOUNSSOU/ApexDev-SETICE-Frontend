import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './connexion.css';

const Connexion: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation simple
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    
    setIsLoading(true);
    
    // Simulation d'une requête API
    setTimeout(() => {
      console.log('Connexion avec:', { email, password, rememberMe });
      setIsLoading(false);
      // Redirection vers le dashboard après connexion simulée
      navigate('/dashboard');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <Container className="connexion-container">
      <Row className="min-vh-100">
        {/* Partie gauche - Formulaire */}
        <Col lg={6} className="form-section d-flex flex-column justify-content-center">
          <div className="form-wrapper">
            <div className="text-center mb-5">
              <h1 className="app-title">SETICE</h1>
              <p className="app-subtitle">Connectez-vous à votre espace de travail</p>
            </div>

            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            <Form onSubmit={handleSubmit} className="auth-form">
              <Form.Group className="mb-4" controlId="formEmail">
                <Form.Label>Adresse email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-control-lg"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control-lg"
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  label="Se souvenir de moi"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-check"
                />
                <a href="#forgot-password" className="forgot-password-link">
                  Mot de passe oublié ?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-100 mb-4 login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>

              <div className="divider">
                <span>Ou connectez-vous avec</span>
              </div>

              <div className="social-login">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="social-btn google-btn"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <FcGoogle className="social-icon" />
                  Google
                </Button>
                <Button
                  variant="outline-dark"
                  size="lg"
                  className="social-btn github-btn"
                  onClick={handleGithubLogin}
                  disabled={isLoading}
                >
                  <FaGithub className="social-icon" />
                  GitHub
                </Button>
              </div>
            </Form>
          </div>

          <div className="footer-info text-center mt-5">
            <p>© 2025 SETICE. Tous droits réservés.</p>
            <div className="footer-links">
              <a href="#privacy">Confidentialité</a>
              <span className="mx-2">•</span>
              <a href="#terms">Conditions d'utilisation</a>
              <span className="mx-2">•</span>
              <a href="#help">Aide</a>
            </div>
          </div>
        </Col>

        {/* Partie droite - Illustration */}
        <Col lg={6} className="illustration-section d-none d-lg-block">
          <div className="illustration-overlay">
            <div className="illustration-content">
              <h2 className="illustration-title">Collaboration d'équipe optimisée</h2>
              <p className="illustration-subtitle">
                Rejoignez des milliers d'équipes qui améliorent leur productivité avec SETICE
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Connexion;