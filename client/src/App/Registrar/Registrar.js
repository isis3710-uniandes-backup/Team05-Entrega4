import React from 'react';
import NavBar from '../NavBar/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import './Registrar.css';


const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        // if we have an error string set valid to false
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

export default class Registrar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            nombre: '',
            correo: '',
            contrasenha: '',
            errors: {
                username: '',
                nombre: '',
                email: '',
                contrasenha: ''
            }
        }

        this.handleUsername = this.handleUsername.bind(this);
        this.handleNombre = this.handleNombre.bind(this);
        this.handleCorreo = this.handleCorreo.bind(this);
        this.handleContrasenha = this.handleContrasenha.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;

        switch (name) {
            case 'username':
                errors.username =
                    value.length < 5
                        ? 'El nombre de usuario debe tener por lo menos 5 caracteres'
                        : '';
                break;
            case 'email':
                errors.email =
                    validEmailRegex.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            case 'password':
                errors.password =
                    value.length < 8
                        ? 'Password must be 8 characters long!'
                        : '';
                break;
            case 'nombre':
                errors.nombre =
                    value.length < 5
                        ? 'El nombre debe tener más de 5 caracteres'
                        : '';
                break;
            default:
        }
    }

    handleUsername(event) {
        this.handleChange(event);
        this.setState({
            username: event.target.value,
            nombre: this.state.nombre,
            correo: this.state.correo,
            contrasenha: this.state.contrasenha
        })
    }

    handleNombre(event) {
        this.handleChange(event);
        this.setState({
            username: this.state.username,
            nombre: event.target.value,
            correo: this.state.correo,
            contrasenha: this.state.contrasenha
        })
    }

    handleCorreo(event) {
        this.handleChange(event);
        this.setState({
            username: this.state.username,
            nombre: this.state.nombre,
            correo: event.target.value,
            contrasenha: this.state.contrasenha
        })
    }

    handleContrasenha(event) {
        this.handleChange(event);
        this.setState({
            username: this.state.username,
            nombre: this.state.nombre,
            correo: this.state.correo,
            contrasenha: event.target.value
        })
    }

    async registrar(username, password, nombre, correo) {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/registrar',
                {
                    "username": username,
                    "password": password,
                    "rol": "cliente",
                    "nombre": nombre,
                    "correo": correo
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            this.props.history.push('/Login')
        }
        catch (err) {
            throw err;
        }

    }


    handleSubmit(event) {
        event.preventDefault();
        if (validateForm(this.state.errors)) {
            this.registrar(this.state.username, this.state.contrasenha, this.state.nombre, this.state.correo);
        }
    }

    render() {
        const { errors } = this.state;

        let incorrectMessage;

        if (!validateForm(this.state.errors)) {
            incorrectMessage =
                <Container className="error-container">
                    Hay campos incorrectos o vacíos
                </Container>
        }

        return (
            <div className="content-body">
                <Container className="prueba">
                    <h1 className="title">
                        Registrarse
                    </h1>
                    {incorrectMessage}
                    <div className="border-container">
                        <Container className="registrar-container">
                            <Form className="text-left">
                                <Form.Group>
                                    <Form.Label>Nombre de usuario *</Form.Label>
                                    <Form.Control type="text" name="username" onChange={this.handleUsername}></Form.Control>
                                    {errors.username.length > 0 &&
                                        <span className='error'>{errors.username}</span>}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Nombre completo *</Form.Label>
                                    <Form.Control type="name" name="nombre" onChange={this.handleNombre}></Form.Control>
                                    {errors.nombre.length > 0 &&
                                        <span className='error'>{errors.nombre}</span>}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Correo *</Form.Label>
                                    <Form.Control type="email" name="email" onChange={this.handleCorreo}></Form.Control>
                                    {errors.email.length > 0 &&
                                        <span className='error'>{errors.email}</span>}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Contraseña *</Form.Label>
                                    <Form.Control type="password" name="password" onChange={this.handleContrasenha}></Form.Control>
                                    {errors.contrasenha.length > 0 &&
                                        <span className='error'>{errors.contrasenha}</span>}
                                </Form.Group>
                                <Button variant="success" size="md" block onClick={this.handleSubmit}>Registrarse</Button>
                            </Form>
                        </Container>
                    </div>
                </Container>
            </div>
        )
    }
}