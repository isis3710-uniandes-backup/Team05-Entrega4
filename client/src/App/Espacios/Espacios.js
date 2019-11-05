import React from "react";
import Card from 'react-bootstrap/Card';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css'
import DateTimePicker from 'react-datetime-picker';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

import "./Espacios.css";
import axios from "axios";
import DateTime from 'react-datetime';
const url_espacios = "http://localhost:5000/api/espacios";

let jwt = require('jsonwebtoken');
const cookies = new Cookies();

export default class Espacios extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      espacios: [],
      fechaInicio: new Date(),
      fechaFin: null,
      _idUsuario: jwt.decode(cookies.get('token')).correo,
      _idEspacio: null,
      _idReserva: null
    };
    this.onChange = date => this.setState({ fechaInicio: date });
    this.get_espacios = this.get_espacios.bind(this);
  }

  componentDidMount() {
    this.get_espacios();
  }

  async get_espacios() {
    const prom = await axios.get(url_espacios);
    if (prom.status < 300 && prom.status > 199) {
      this.setState({
        espacios: prom.data
      });
    } else {
      console.log(prom.status, "\n The response was not OK");
    }
  }

  handleDate(date) {
    console.log(date);
    this.setState({ fechaInicio: DateTime(date._d) });
  };

  handle_onPost() {
    const reserva = {
      fechaInicio: this.state.fechaInicio,
      fechaFin: this.state.fechaFin,
      _idEspacio: this.state._idEspacio,
      _idUsuario: this.state._idUsuario
    };
    this.post_reserva(reserva);
  }

  async post_reserva(reserva) {
    console.log(reserva);
    let p = await axios.post('http://localhost:5000/api/reservas', reserva).then((p) => {
      this.setState({ _idReserva: p.data[0]._id });
      this.props.history.push('pagar/' + p.data[0]._id + '/' + reserva._idEspacio);
      console.log(this.props.history);
    });

    /*
    fetch('http://localhost:5000/api/reservas', {
      method: "post",
      body: JSON.stringify(reserva),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(_ => {
        this.props.history.push('/reservas')
      })
      .catch(err => {
        console.log(err.message);
      });
      */
  }

  render() {
    return (
      <div>
        <div className="host">
          <h1>Espacios disponibles</h1>
          <div className="row">
            <div className="col-4">
              <div>
                <div className="card-container ReservaCard" style={{ padding: '1em' }}>
                  <Card>
                    <h5 style={{ padding: '1em' }} className="card-title">Reserva parqueaderos de acuerdo con tus necesidades.</h5>
                    <Card.Body className="d-flex justify-content-center w-100" style={{ width: '100%' }}>
                      <br />
                      <DateTimePicker onChange={this.onChange} value={this.state.fechaInicio} />
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="row" id="CardsContainer">
                {this.state.espacios.length > 0 ? (
                  <React.Fragment>
                    {this.state.espacios.map((x, i) => {
                      return (
                        <div
                          key={i}
                          className="col-md-4"
                          style={{ marginTop: "2em" }}
                        >
                          <div className="card" style={{ textAlign: "left" }}>
                            <div className="card-body">
                              <h5 className="card-title">{x.parqueadero}</h5>
                              <p className="card-text">{x.descripcion}</p>
                              <button
                                className="btn btn-primary"
                                style={{ float: "right" }}
                                onClick={() => {
                                  this.setState({ _idEspacio: x._id }, this.handle_onPost);
                                }}>

                                <Link to={{
                                  pathname: "/pagos", state: {
                                    _idReserva: this.state._idReserva
                                  },
                                }}
                                  onClick={() => {
                                    this.setState({ _idEspacio: x._id }, this.handle_onPost);
                                  }}
                                >
                                  Reservar
                                </Link>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ) : (
                    <div
                      className="col-md-12"
                      style={{ marginTop: "2em", width: "100%" }}
                    >
                      <div className="card" style={{ textAlign: "center" }}>
                        <div className="card-body">
                          <p className="card-text">
                            En este momento no hay espacios de parqueo disponibles
                    </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
