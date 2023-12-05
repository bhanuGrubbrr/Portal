import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { RpcOptions, UnaryCall } from '@protobuf-ts/runtime-rpc';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.grpcUrl}`;

export const grpcTransport = () => {
  const token = localStorage.getItem('access_token');
  return new GrpcWebFetchTransport({
    baseUrl,
    format: 'binary',
    fetchInit: {
      mode: 'cors',
      credentials: 'include',
    },
    interceptors: [
      {
        interceptUnary(next, method, input, options: RpcOptions): UnaryCall {
          if (!options.meta) {
            options.meta = {};
          }
          options.meta['Authorization'] = `Bearer ${token}`;
          // options.meta['grpc-accept-encoding'] = 'gzip';

          var response = next(method, input, options);
          if (environment.grpcDebug) {
            response.then(
              (resp) => {
                window.postMessage(
                  {
                    type: '__GRPCWEB_DEVTOOLS__',
                    method: method.name,
                    methodType: 'unary',
                    request: input,
                    response: resp.response,
                    error: undefined,
                  },
                  '*'
                );
              },
              (error) => {
                window.postMessage(
                  {
                    type: '__GRPCWEB_DEVTOOLS__',
                    method: method.name,
                    methodType: 'unary',
                    request: input,
                    response: undefined,
                    error: error,
                  },
                  '*'
                );
              }
            );
          }
          return response;
        },
      },
    ],
  });
};
