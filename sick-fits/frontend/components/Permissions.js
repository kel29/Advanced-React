import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Error from './ErrorMessage'
import Table from './styles/Table'
import SickButton from './styles/SickButton'

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const Permissions = (props) => (
  <Query query={ALL_USERS_QUERY}>
    {({data, error, loading}) => {
      if (loading) return <p>Loading...</p>
      return (
        <>
          <Error error={error} />
          <h2>Manage Permissions</h2>
          <Table>
          <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                <th>👇🏻</th>
              </tr>
            </thead>
            <tbody>{data.users && data.users.map(user => <UserPermissions user={user} key={user.id}/>)}</tbody>
          </Table>
        </>
      )
    }}
  </Query>
)


class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  }

  state = {
    permissions: this.props.user.permissions,
  }

  
  handlePermissionChange = (e) => {
    const { checked, value } = e.target
    if (checked) {
      this.setState(prevState => ({
        permissions: [...prevState.permissions, value]
      }))
    } else {
      this.setState(prevState => ({
        permissions: prevState.permissions.filter(permission => permission !== value)
      }))
    }
  }
  
  render() {
    const { user } = this.props
    const { permissions } = this.state
    return (
      <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={{
        permissions,
        userId: user.id
      }}>
        {(updatePermissions, {loading, error }) => {
          return (
            <>
              { error && <Error error={error} />}
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {possiblePermissions.map(permission => (
                  <td key={`${user.id}-permission-${permission}`}>
                    <label htmlFor={`${user.id}-permission-${permission}`} >
                      <input
                        id={`${user.id}-permission-${permission}`}
                        type='checkbox'
                        checked={permissions.includes(permission)}
                        value={permission}
                        onChange={this.handlePermissionChange}
                      />
                    </label>
                  </td>
                ))}
                <td>
                  <SickButton onClick={updatePermissions} disabled={loading}>
                    Update
                  </SickButton>
                </td>
              </tr>
            </>
          )
        }}
      </Mutation>
    )
  }
};


export default Permissions;
