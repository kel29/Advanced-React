import React from 'react';
import formatMoney from '../lib/formatMoney'
import styled from 'styled-components'

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`

const CartItem = ({cartItem}) => {
  const { image, price, description, title } = cartItem.item
  return (
    <CartItemStyles>
      <img width='100' alt={title} src={image}/>
      <div className="cart-item-details">
        <h3>{cartItem.item.title}</h3>
        <p>
          {formatMoney(cartItem.item.price * cartItem.quantity)}
          {' - '}
          <em>
            {cartItem.quantity} &times; {formatMoney(cartItem.item.price)} each
          </em>
        </p>
      </div>
    </CartItemStyles>
  );
};

export default CartItem;