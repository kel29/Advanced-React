import React from 'react';
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import User from './User'
import CartItem from './CartItem'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`

const Cart = () => (
  <User>
    {({ data: { me } }) => (
      me &&
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {toggleCart => (
            <Query query={LOCAL_STATE_QUERY}>
              {({data}) => {
                const { cartOpen } = data
                console.log({data})
                const { cart } = me
                return (
                  <CartStyles open={cartOpen}>
                    <header>
                      <CloseButton title='close' onClick={toggleCart}>&times;</CloseButton>
                      <Supreme>Your Cart</Supreme>
                      <p>You have {cart.length} item{cart.length !== 1 && 's'}</p>
                    </header>
                    <ul>{cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem}/>)}</ul>
                    <footer>
                      <p>Total: {formatMoney(calcTotalPrice(me.cart))}</p>
                      <SickButton>Checkout</SickButton>
                    </footer>
                  </CartStyles>
                )
              }}
            </Query>
          )}
        </Mutation>
    )}
  </User>
)

export default Cart;
