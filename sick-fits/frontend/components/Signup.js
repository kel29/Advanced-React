import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      name
      email
      permissions
    }
  }
`

const initialState = {
  name: '',
  password: '',
  email: '',
}

class Signup extends Component {
  state = initialState

  saveToState = (e) => {
    this.setState({[e.target.name]: e.target.value})
 }

  render() {
    const {email, name, password} = this.state
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, {error, loading}) => (
          <Form
            onSubmit={async (e) => {
              e.preventDefault()
              await signup()
              this.setState({...initialState})
            }}
            method="Post"
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up for an account</h2>
              <Error error={error} />
              <label htmlFor='email'>
                Email
                <input
                  type='email'
                  name='email'
                  placeholder='email'
                  value={email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor='name'>
                name
                <input
                  type='text'
                  name='name'
                  placeholder='name'
                  value={name}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor='password'>
                password
                <input
                  type='password'
                  name='password'
                  placeholder='password'
                  value={password}
                  onChange={this.saveToState}
                />
              </label>
              <button type='submit'>Sign Up!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;