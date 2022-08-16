import React from 'react';
import { staticRender } from '../../../helpers/index';
import { BaseLayout } from '../layouts/BaseLayout.jsx';

import { Header } from '../common/Header.jsx';
import Button from '../components/Button.jsx';

export default () => {
  return staticRender(
    <BaseLayout>
      <Header />
      <Button />
      <div id="app"></div>
      <p>ここはホームページです</p>
      <div className="imgWrap">
        <img src="https://placehold.j/150x150.png" alt="" />
      </div>
    </BaseLayout>
  );
};
