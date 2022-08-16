import React from 'react';

export const Header = () => {
  return (
    <header className="p-header">
      <div className="p-header_innder">
        <div className="p-header_left">
          <p className="p-header_logo">LOGO</p>
        </div>
        <div className="p-header_right">
          <button className="p-header_contact">お問い合わせ</button>
        </div>
      </div>
    </header>
  );
};
