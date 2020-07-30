import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from '../components/ErrorMessage'
import Router from 'next/router';

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: {id: $id}) {
      id
      title
      description
      price
    }
  }
`

class UpdateItem extends Component {
  state = {}

  handleChange = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val})
  }

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault()
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    })
  }

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{id: this.props.id}}>
        {({data, loading}) => {
          if (loading) return <p>loading...</p>
          if (!data.item) return <p>No item '{this.props.id}' found</p>
          return(
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => 
                (
                  <Form onSubmit={e => this.updateItem(e, updateItem)}>
                    <Error error={error} />
                    <fieldset disabled={loading} aria-busy={loading}>
                      <label htmlFor="title">
                        Title
                        <input
                          id="title"
                          name="title"
                          onChange={this.handleChange}
                          placeholder="Title"
                          required
                          defaultValue={data.item.title}
                          type="text"
                        />
                      </label>
                      <label htmlFor="price">
                        Price
                        <input
                          id="price"
                          name="price"
                          onChange={this.handleChange}
                          placeholder="Price"
                          required
                          type="number"
                          defaultValue={data.item.price}
                        />
                      </label>
                      <label htmlFor="description">
                        Description
                        <textarea
                          id="description"
                          name="description"
                          onChange={this.handleChange}
                          placeholder="Enter a description"
                          required
                          defaultValue={data.item.description}
                        />
                      </label>
                      <button type="submit">Save Changes</button>
                    </fieldset>
                  </Form>
                )
              }
            </Mutation>
          )
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION }
