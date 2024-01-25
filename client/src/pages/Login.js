import React, { useState } from 'react';
import { Container, Form, Button, Card, Navbar } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoginValidationSchema } from '../validation/LoginRegistration';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Validate the input using Yup schema
      await LoginValidationSchema.validate({ email, password }, { abortEarly: false });

      // If validation passes, send the login data to the server
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });

      // Check if the response contains a token
      const { message, token } = response.data;

      if (message === 'Login successful' && token) {
        // Store the token in cookies using js-cookie
        Cookies.set('token', token, { path: '/' });
        console.log(message);
        navigate('/');
      } else {
        console.error('Token not found in the server response');
      }

      // Add any additional logic based on the server response if needed
      setValidationErrors({ email: '', password: '' }); // Reset validation errors
    } catch (error) {
      // If validation fails, update the validation error state
      const errors = {};

      if (error.response && error.response.status === 401) {
        // Display an alert for invalid credentials
        window.alert('Invalid email or password');
      } else if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
      }

      setValidationErrors(errors);
    }
  };
  
  return (
    <>
      <Navbar bg="light" expand="lg" fixed="sticky-top">
        <Container fluid>
          <Navbar.Brand href="/" className='m-1'>JJCK REALTY SERVICES</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="d-flex align-items-center justify-content-center mt-5">
        <Card style={{ width: '400px' }}>
          <Card.Body>
            <h2 className="text-center">Login</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {validationErrors.email && (
                  <Form.Text className="text-danger">{validationErrors.email}</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {validationErrors.password && (
                  <Form.Text className="text-danger">{validationErrors.password}</Form.Text>
                )}
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Login
              </Button>
            </Form>
            <p className='text-center pt-4'>No account yet?<a href='/register' style={{ textDecoration: 'none' }}> Register here.</a></p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Login;