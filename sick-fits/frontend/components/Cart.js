import React from 'react';
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`

const Cart = () => {
  return (
    <Query query={LOCAL_STATE_QUERY}>
      {({data}) => {
        const { cartOpen } = data
        console.log({data})
        return (
          <CartStyles open={cartOpen}>
            <header>
              <CloseButton title='close'>&times;</CloseButton>
              <Supreme>Your Cart</Supreme>
              <p>You have __ items</p>
            </header>

            <footer>
              <p>Total: ___</p>
              <SickButton>Checkout</SickButton>
            </footer>
            
          </CartStyles>
        )
      }}
    </Query>
  );
};

export default Cart;
