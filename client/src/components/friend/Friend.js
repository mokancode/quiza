import React, { Component } from 'react'
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { getUserByHandle } from '../../actions/requestActions';
import axios from 'axios';
import { findDOMNode } from 'react-dom';
import './Friend.css';
import classnames from 'classnames';
export class Friend extends Component {
    constructor(props) {
        super(props);

        this.state = {
            friend: '',
            contact: null,
            error: {},
            showForm: false
        }

        this.createContact = this.createContact.bind(this);
        this.showForm = this.showForm.bind(this);
    }

    componentDidMount() {
        const handle = this.props.match.params.id;
        // this.getUserByHandle();
        axios.get(`/api/users/getfriendbyhandle/${handle}`)
            .then(function (res) {
                this.setState({ friend: res.data });

                const friendId = res.data.id;
                axios.get(`/api/contacts/getcontact/${friendId}`)
                    .then(function (res) {
                        this.setState({ contact: res.data });
                    }.bind(this))
                    .catch(function (err) {
                        this.setState({ error: err.response.data });
                        console.log("Error fetching contact: ", err);
                    }.bind(this));


            }.bind(this))
            .catch(function (err) {
                console.log("Error fetching user by handle: ", err);
            }.bind(this))
    }

    showForm() {
        this.setState(function (prevState) {
            return {
                showForm: !prevState.showForm
            }
        }, function () {
            if (this.state.showForm === true) {
                findDOMNode(this.refs.createContactBtn).classList.add("invisible");
            } else {
                findDOMNode(this.refs.createContactBtn).classList.remove("invisible");
            }
        });
    }

    createContact(e) {
        e.preventDefault();
    }

    render() {

        const { id } = this.state.friend;
        const { error, showForm } = this.state;
        const handle = this.props.match.params.id;
        return (
            <div className="friendPage">
                {id ?
                    <div>
                        Welcome to {handle}'s page. My ID is {id}

                        {error.contact ?
                            <div className="createContactDiv">
                                <span> You have yet to create a contact!</span>
                                <button ref="createContactBtn" onClick={this.showForm} className="createContactBtn" type="button">Create contact</button>

                                {showForm ?
                                    <div className="formContainerDiv">
                                        <form onSubmit={this.createContact} className="formDiv">
                                            <div className="closeFormDiv">
                                                <div className="closeForm" onClick={this.showForm}>
                                                    &#9932;
                                                </div>
                                            </div>
                                            <h1 id="createContactHeader">Create contact</h1>
                                            <input
                                                type="password"
                                                // className={classnames("form-control form-control-lg", {
                                                //     'is-invalid': error
                                                // })}
                                                placeholder="Password"
                                                name="password"
                                            // value={value}
                                            // onChange={onChange}
                                            // disabled={disabled}
                                            />

                                            <button>Submit</button>
                                        </form>
                                    </div>
                                    : null
                                }

                            </div>
                            : null
                        }

                    </div>
                    : <span>Loading...</span>
                }

                {/* ID of friend: {friendID} */}
            </div >
        )
    }
}

// const mapStateToProps = state => ({
//     auth: state.auth,
//     requests: state.auth
// });

export default Friend;
// export default connect(mapStateToProps, { getUserByHandle })(Friend);