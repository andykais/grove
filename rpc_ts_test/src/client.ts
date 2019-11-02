import { ModuleRpcProtocolClient } from 'rpc_ts/lib/protocol/client'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'

import { helloServiceDefinition } from './server'
// Definition of the RPC service
// const helloServiceDefinition = {
//   getHello: {
//     request: {} as { language: string },
//     response: {} as { text: string }
//   }
// }

// Now let's do a Remote Procedure Call
;(async () => {
  const client = ModuleRpcProtocolClient.getRpcClient(helloServiceDefinition, {
    remoteAddress: `http://localhost:${4000}`,
    // This "transport" allows the code to run in NodeJS instead of running
    // in the browser.
    getGrpcWebTransport: NodeHttpTransport()
  })
  const result = await client.getHello({ language: 'Spanish' })
  console.log({ result })
})()

// rpc()
//   .then(() => server.close())
//   .catch(err => {
//     console.error(err)
//     process.exit(1)
//   })
