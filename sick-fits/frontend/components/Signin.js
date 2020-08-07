import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      name
      email
    }
  }
`

const initialState = {
  password: '',
  email: '',
}

class Signin extends Component {
  state = initialState

  saveToState = (e) => {
    this.setState({[e.target.name]: e.target.value})
 }

  render() {
    const {email, password} = this.state
    return (
      <Mutation mutation={SIGNIN_MUTATION} variables={this.state} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
        {(signin, {error, loading}) => (
          <Form
            onSubmit={async (e) => {
              e.preventDefault()
              await signin()
              this.setState({...initialState})
            }}
            method="Post"
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign into your account</h2>
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
              <button type='submit'>Sign In!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signin;