import React from 'react';
export const BaseLayout = ({ children }) => {
  return (
    <>
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>タイトル</title>
        </head>
        <body>{children}</body>
        <script src="/main.js"></script>
      </html>
    </>
  );
};
