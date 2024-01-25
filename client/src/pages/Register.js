import axios from 'axios';
import React from 'react';
import { Container, Form, Button, Card, Navbar } from 'react-bootstrap';
import { useFormik } from 'formik';
import { RegistrationValidationSchema } from '../validation/LoginRegistration';
import { useNavigate  } from 'react-router-dom';

function Register() {
  const navigate = useNavigate ();
  const formik = useFormik({
    initialValues: {
      completename: '',
      address: '',
      birthdate: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: RegistrationValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:3001/register', {
          completename: values.completename,
          address: values.address,
          birthdate: values.birthdate,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
    
        console.log(response.data.message);

        if (response.data.message === 'User registered successfully') {
          // Redirect to the login page after successful registration
          navigate('/login');
        }
        // Optionally, you can reset the form or navigate to another page after successful registration
      } catch (error) {
        console.error('Error registering user:', error.message);
      }
    },
  });

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
            <h2 className="text-center">Register</h2>
            <Form onSubmit={formik.handleSubmit}>

              <Form.Group controlId="completename">
                <Form.Label>Complete Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter complete name"
                  value={formik.values.completename}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.completename && formik.errors.completename && (
                  <div className="text-danger">{formik.errors.completename}</div>
                )}
              </Form.Group>

              <Form.Group controlId="address">
                <Form.Label>Complete Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="text-danger">{formik.errors.address}</div>
                )}
              </Form.Group>

              <Form.Group controlId="birthdate">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  value={formik.values.birthdate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.birthdate && formik.errors.birthdate && (
                  <div className="text-danger">{formik.errors.birthdate}</div>
                )}
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-danger">{formik.errors.email}</div>
                )}
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-danger">{formik.errors.password}</div>
                )}
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="text-danger">{formik.errors.confirmPassword}</div>
                )}
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Register
              </Button>
            </Form>
            <p className='text-center pt-4'>Already Registered?<a href='/login' style={{ textDecoration: 'none' }}> Login here.</a></p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Register;
