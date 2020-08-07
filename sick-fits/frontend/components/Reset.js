import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($confirmPassword: String!, $password: String!, $resetToken: String!) {
    resetPassword(password: $password, confirmPassword: $confirmPassword, resetToken: $resetToken) {
      id
      email
      name
    }
  }
`

const initialState = {
  password: '',
  confirmPassword: '',
}

class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.idRequired
  }
  state = initialState

  saveToState = (e) => {
    this.setState({[e.target.name]: e.target.value})
 }

  render() {
    const { password, confirmPassword } = this.state
    const { resetToken } = this.props
    return (
      <Mutation mutation={RESET_MUTATION} variables={{...this.state, resetToken}} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
        {(reset, {error, loading}) => (
          <Form
            onSubmit={async (e) => {
              e.preventDefault()
              await reset()
              this.setState(initialState)
            }}
            method="Post"
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your password</h2>
              <Error error={error} />
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
              <label htmlFor='confirmPassword'>
                confirm new password
                <input
                  type='password'
                  name='confirmPassword'
                  placeholder='confirm password'
                  value={confirmPassword}
                  onChange={this.saveToState}
                />
              </label>
              <button type='submit'>Reset</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Reset;