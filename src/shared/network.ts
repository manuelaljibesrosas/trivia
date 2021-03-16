export enum NetworkStatus {
  // we're ready to submit a request and
  // we don't have any cached data available
  UNINITIALIZED = 'UNINITIALIZED',
  // a request is on-flight
  PENDING = 'PENDING',
  // we're ready to submit a request and
  // we have some cached data available
  READY = 'READY',
  // the request failed, this is typically used
  // after the request has been issued n times
  // without success
  ERROR = 'ERROR',
};
