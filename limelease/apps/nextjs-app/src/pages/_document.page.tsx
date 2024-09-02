import Document, { Html, Head, Main, NextScript } from 'next/document';

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type { DocumentContext, DocumentInitialProps } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

const AppDocument = () => {
  return (
    <Html lang="en">
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

AppDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
  const cache = createCache();
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => <StyleProvider cache={cache}>{sheet.collectStyles(<App {...props} />)}</StyleProvider>,
      });

    const initialProps = await Document.getInitialProps(ctx);
    const style = extractStyle(cache, true);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
          <style dangerouslySetInnerHTML={{ __html: style }} />
        </>
      ),
    };
  } finally {
    sheet.seal();
  }
};

export default Document;
