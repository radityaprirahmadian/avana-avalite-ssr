import React from 'react';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

import ErrorsWrapper from 'src/components/ErrorsWrapper';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    this.setState({ hasError: true, error, errorInfo });

    if (process.env.NEXT_PUBLIC_STAGE === 'PRODUCTION') {
      const { shop } = this.props;

      const bugsnagClient = bugsnag(process.env.NEXT_PUBLIC_BUGSNAG);
      bugsnagClient.use(bugsnagReact, React);

      bugsnagClient.user = {
        id: shop?.id ?? '',
        shopName: shop?.shop_info?.shop_name ?? '',
        email: shop?.shop_info?.shop_email ?? '',
        projectName: 'WA Commerce / AvaLite',
      };

      bugsnagClient.notify(error);
    } else {
      console.log(`Error: ${error}`);
      console.log(`ErrorInfo: ${JSON.stringify(errorInfo)}`);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          className="m-auto text-center"
          style={{ minWidth: 300, maxWidth: 375}}
        >
          <ErrorsWrapper error={{
              title: 'Oh Snap! The apps encountered technical problem',
              message: `Try refreshing the page, or if it won't help, we will knock our 
              developer door to get rid of this nasty error.`
            }}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
