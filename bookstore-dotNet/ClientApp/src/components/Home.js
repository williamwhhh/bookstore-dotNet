import React, { Component } from 'react';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { books: [], loading: true, show: false, reservedBook: null };
        this.reserveBook = this.reserveBook.bind(this);
        this.searchBook = this.searchBook.bind(this);
    }

    componentDidMount() {
        this.populateBookData();
    }

    handleClose = () => this.setState({show: false, reservedBook: null });
    handleShow = () => this.setState({ show: true });
    handleSearch = (e) => {
        e.preventDefault();
        e.target.bookName.value ? this.searchBook(e.target.bookName.value) : this.populateBookData();
    }

    renderBookTable(books) {
        return (
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Book Name</th>
                        <th scope="col">Book ID</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Stock</th>
                        
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    {books.map(book =>
                        <tr>
                            <td scope="row">{book.name}</td>
                            <td>{book.id}</td>
                            <td>{book.quantity}</td>
                            <td>{book.stock}</td>
                            <td><button className="btn btn-primary btn-sm" onClick={() => this.reserveBook(book.id)}>Reserve</button></td>
                        </tr>)
                    }
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderBookTable(this.state.books);

        return (
          <div>
            <h1>Welcome to Bookstore!</h1><br/>
                <p>Click on the Reserve buttons below to make bookings.</p>
                <Form onSubmit={this.handleSearch}>
                    <Form.Group className="mb-3" controlId="controlBookName">
                        <Row>
                            <Form.Label>Search for book</Form.Label>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Control name="bookName" type="text" placeholder="Enter the book's name" />
                            </Col>
                            <Col>
                                <Button variant="primary" type="submit" >
                                    Search
                                </Button>
                            </Col>

                        </Row>
                    </Form.Group>

            </Form>
            {contents}
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
                >
                    <Modal show={this.state.show} onHide={this.handleClose} style={{ marginTop: '20%'}}>
                        <Modal.Header closeButton>
                        <Modal.Title>{this.state.reservedBook ? <p>Booking Successful</p> : <p>Booking Failed</p>} </Modal.Title>
                    </Modal.Header>

                        <Modal.Body>
                            {this.state.reservedBook ? <p>Your booking to {this.state.reservedBook.name} is successful! <br/><br/> Booking Number: {this.state.reservedBook.bookingNumber}</p> :
                                <p>Sorry, all booked out</p>}
                        
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>

                    </Modal.Footer>
                </Modal>
            </div>
          </div>

        );
    }

    async populateBookData() {
        const response = await fetch('books');
        const data = await response.json();
        this.setState({books: data, loading: false });
    }

    async searchBook(name) {
        const response = await fetch('books/search/' + name);
        const data = await response.json();
        this.setState({ books: data, loading: false });
    }

    async reserveBook(id) {
        const response = await fetch('books/reserve/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = JSON.parse(await response.text());
        this.populateBookData();
        this.setState({show: true, reservedBook: data.bookingNumber ? data : null });
    }
}
