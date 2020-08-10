import { Query } from 'react-apollo'
import gql from 'graphql-tag'
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
            <tbody>{data.users && data.users.map(user => <UserPermissions user={user} />)}</tbody>
          </Table>
        </>
      )
    }}
  </Query>
)


const UserPermissions = (props) => {
  const { user } = props
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      {possiblePermissions.map(permission => (
        <td>
          <label htmlFor={`${user.id}-permission-${permission}`} >
            <input type='checkbox' />
          </label>
        </td>
      ))}
      <td><SickButton>Update</SickButton></td>
    </tr>
  );
};


export default Permissions;
