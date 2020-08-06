import React from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Head from 'next/head'
import Link from 'next/link'
import PaginationStyles from './styles/PaginationStyles'
import Error from './ErrorMessage'
import { perPage } from '../config'

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

const Pagination = (props) => {
  return (
    <Query query={PAGINATION_QUERY}>
        {({error, loading, data}) => {
          if (error) return <Error error={error} />
          if (loading) return <p>Loading...</p>

          const totalItems = data.itemsConnection.aggregate.count
          const totalPages = Math.ceil(totalItems / perPage)
          const currentPage = props.page

          return (
            <PaginationStyles>
              <Head>
                <title>Sick Fits! | Page {currentPage} of {totalPages}</title>
              </Head>
              <Link 
                prefetch
                href={{
                  pathname: 'items',
                  query: {page: currentPage - 1}
                }}>
                <a className='prev' aria-disabled={currentPage < 2}>Prev</a>
              </Link>
              <p>Page {currentPage} of {totalPages}</p>
              <p>{totalItems} Item Total</p>
              <Link 
                prefetch
                href={{
                  pathname: 'items',
                  query: {page: currentPage + 1}
                }}>
                <a className='next' aria-disabled={currentPage === totalPages}>Next</a>
              </Link>
            </PaginationStyles>
          )
        }}
      </Query>
  );
};

export default Pagination;