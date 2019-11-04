import React, { useState } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';
import NavBar from '../NavBar/NavBar.js';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import Cookies from 'universal-cookie';
import "./Login.css";

const cookies = new Cookies();

let jwt = require('jsonwebtoken');


export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            incorrectLogin: false
        }

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
    }

    async login(username, pass) {
        try {
            const response = await axios.post(
                'http://localhost:5000/login/login',
                {
                    "username": username,
                    "password": pass
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            cookies.set('token', response.data.token);
            console.log(cookies.get('token'));
            this.props.history.push('/')
        } catch (err) {
            this.setState({ username: this.state.username, password: this.state.password, incorrectLogin: true })
        }
    }

    handleUserChange(event) {
        this.setState({
            username: event.target.value,
            password: this.state.password
        });
        console.log(this.state)
    }

    handlePassChange(event) {
        this.setState({
            username: this.state.username,
            password: event.target.value
        });
        console.log(this.state)
    }

    handleSubmit(event) {
        this.login(this.state.username, this.state.password);
    }

    render() {

        let incorrectMessage;

        if (this.state.incorrectLogin) {
            incorrectMessage =
                <Container className="error-container">
                    Usuario o contraseña incorrectos
                </Container>
        }

        return (
            <div>
                <NavBar />
                <div className="content-body">
                    <Container className="prueba">
                        <h1 className="titulo">
                            Iniciar sesión
                        </h1>
                        {incorrectMessage}
                        <div className="border-container">
                            <Container className="login-container">
                                <Form className="text-left">
                                    <Form.Group>
                                        <Form.Label>Nombre de usuario</Form.Label>
                                        <Form.Control required type="text" placeholder="Escribe tu correo" onChange={this.handleUserChange}></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control type="password" onChange={this.handlePassChange}></Form.Control>
                                    </Form.Group>
                                    <Button variant="success" size="md" block onClick={this.handleSubmit}>Ingresar</Button>
                                </Form>
                            </Container>
                        </div>
                    </Container>
                    <Container>
                        <Row>
                            <Col>
                                ¿No tienes cuenta? <Nav.Link href="/Registrar">Regístrate</Nav.Link>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}
