import React, { Component } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Error from './ErrorMessage'
import Head from 'next/head'

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: {id: $id}) {
      id
      title
      description
      largeImage
    }
  }
`

class SingleItem extends Component {
  render() {
    const { id } = this.props
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{id}}>
        {({error, loading, data}) => {
          const { item } = data
          if (error) return <Error error={error} />
          if (loading) return <p>Loading...</p>
          if (!item) return <p>No item found</p>

          const { largeImage, title, description } = item
          return (
            <SingleItemStyles>
              <Head>
                <title>Sick Fits | {title} </title>
              </Head>
              <img src={largeImage} alt={title} />
              <div className='details'>
                <h2>Viewing {title}</h2>
                <p>{description}</p>
              </div>
            </SingleItemStyles>
          )
        }}
      </Query>
    );
  }
}

export default SingleItem;