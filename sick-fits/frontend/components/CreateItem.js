import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from '../components/ErrorMessage'
import Router from 'next/router';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $image: String
    $largeImage: String
    $price: Int!
  ) {
    createItem(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) {
      id
    }
  }
`

const initialState = {
  title: '',
  description: '',
  image: '',
  largeImage: '',
  price: 0,
}

class CreateItem extends Component {
  state = initialState

  handleChange = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val})
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => 
          (
            <Form onSubmit={async e => {
              e.preventDefault()
              const resp = await createItem();
              this.setState(initialState)
              Router.push({
                pathname: '/item',
                query: { id: resp.data.createItem.id }
              })
            }}>
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
                    type="text"
                    value={this.state.title}
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
                    value={this.state.price}
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
                    value={this.state.description}
                  />
                </label>
                <button type="submit" >Submit</button>
              </fieldset>
            </Form>
          )
        }
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION }
