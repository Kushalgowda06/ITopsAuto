import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        marginTop: 'auto',
        padding: '0.3rem 0',
        fontSize: '0.875rem',
        color: '#6c757d'
      }}
    >
      <Container>
        <div className="text-center">
          <p style={{ margin: 0 }}>
            © {currentYear} VibeCoding Assist Platform. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 