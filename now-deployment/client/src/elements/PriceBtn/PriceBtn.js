import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmazon } from '@fortawesome/free-brands-svg-icons';

import './PriceBtn.scss';

const PriceBtn = ({ price, url, history }) => {
  const handleClick = url => {
    window.open(url, '_blank');
  };

  return (
    <button onClick={() => handleClick(url)} className='cta-price'>
      <span className='amazon-icon'>
        <FontAwesomeIcon icon={faAmazon} />
      </span>
      <span className='price'>$ {price}</span>
    </button>
  );
};

export default PriceBtn;
