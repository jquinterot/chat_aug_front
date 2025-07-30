// test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'next-intl';

type AllTheProvidersProps = {
  children: React.ReactNode;
};

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
