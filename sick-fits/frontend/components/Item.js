import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'
import Title from './styles/Title'
import ItemStyles from './styles/ItemStyles'
import PriceTag from './styles/PriceTag'
import formatMoney from '../lib/formatMoney'
import DeleteItem from './DeleteItem'

class Item extends Component {
  render() {
    const { item } = this.props;
    const { image, title, id, price, description} = item
    return (
      <ItemStyles>
        {image &&  <img src={image} alt={title} />}
        <Title>
          <Link href={{
            pathname: '/item',
            query: { id }
          }}>
            <a>{title}</a>
          </Link>
        </Title>
        <PriceTag>
          {formatMoney(price)}
        </PriceTag>
        <p>{description}</p>
        <div className="buttonList">
          <Link href={{
            pathname: 'update',
            query: { id }
          }}>
            <a>Edit</a>
          </Link>
          <button>Add To Cart</button>
          <DeleteItem id={id}>Delete Me</DeleteItem>
        </div>
      </ItemStyles>
    );
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired
};

export default Item;