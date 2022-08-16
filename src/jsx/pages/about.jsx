import React from 'react';
import { staticRender } from '../../../helpers/index';
import { BaseLayout } from '../layouts/BaseLayout.jsx';
const Button = () => <button>about</button>;

export default () => {
  return staticRender(
    <BaseLayout>
      <Button />
      <div id="app"></div>
    </BaseLayout>
  );
};
