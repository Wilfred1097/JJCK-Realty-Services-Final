import React from 'react';
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Cookies from 'js-cookie';

const NavigationBar = () => {
  const token = Cookies.get('token');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = async () => {
    try {
      // Make a request to the server to clear the token
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies) in the request
      });

      if (response.ok) {
        // Clear the token in cookies
        Cookies.remove('token');

        // Navigate to the home page or any other page after successful logout
        navigate('/');
      } else {
        // Handle logout error if needed
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      // Handle errors during logout if needed
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="#" className='m-1'>JJCK REALTY SERVICES</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="mx-auto m-1">
            <Nav.Link href="#listing">Listings</Nav.Link>
            <Nav.Link href="#">Contact Us</Nav.Link>
          </Nav>
          <Form className="d-flex justify-content-end">
            <FormControl className='m-1' type="search" placeholder="Search" aria-label="Search" />
            <Button className='m-1' variant="success" type="submit">Search</Button>
            {token ? (
              // If token is present, display "Logout" button
              <Button className='m-1' variant="primary" onClick={handleLogout}>Logout</Button>
            ) : (
              // If token is not present, display "Login" button
              <Button className='m-1' variant="primary" as={Link} to="/login">Login</Button>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
