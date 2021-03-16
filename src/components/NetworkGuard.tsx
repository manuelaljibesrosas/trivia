import React from 'react';
import { NetworkStatus } from 'shared/network';

const LoadingIndicator = () => (
  <div>Loading...</div>
);

const NetworkErrorIndicator = () => (
  <div>Something went wrong, please try again later</div>
);

type LoaderProps = {
  status: NetworkStatus;
};

// hack to hint the compiler that it should treat "<BaseProps>" as a
// type parameter and not a JSX element
const networkGuard = <BaseProps, >(
  C: React.ComponentType<BaseProps>
): React.FC<BaseProps & LoaderProps> => ({ status, ...props }) => {
  switch (status) {
    case NetworkStatus.READY:
      return <C {...props as BaseProps} />;
    case NetworkStatus.PENDING:
    // we might get to this state if we decide to send the request
    // on mount
    case NetworkStatus.UNINITIALIZED:
      return <LoadingIndicator />;
    default:
      return <NetworkErrorIndicator />
  }
};

export default networkGuard;
