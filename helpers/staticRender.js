import ReactDOMServer from 'react-dom/server';

export const staticRender = (element) => {
  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(element);
}