import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mastfoot mt-auto">
      <div className="inner">
        <p>
          Cover template for{' '}
          <Link to="https://getbootstrap.com/">Bootstrap</Link>, by{' '}
          <Link to="https://twitter.com/mdo">@mdo</Link>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
