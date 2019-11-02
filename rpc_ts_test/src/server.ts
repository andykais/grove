import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { ModuleRpcCommon } from 'rpc_ts/lib/common'
import { ModuleRpcServer } from 'rpc_ts/lib/server'
import { ModuleRpcProtocolServer } from 'rpc_ts/lib/protocol/server'
import { ModuleRpcProtocolClient } from 'rpc_ts/lib/protocol/client'

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never
type ThenArg<T> = T extends Promise<infer U> ? U : T

type ServiceHandlers = { [fnName: string]: (...args: any[]) => any }
type ConvertHandlersToDefinitions<I extends ServiceHandlers> = {
  [K in keyof I]: {
    request: ArgumentTypes<I[K]>[0]
    response: ThenArg<ReturnType<I[K]>>
  }
}
const createServiceDefinitions = <T extends ServiceHandlers>(
  serviceHandlers: T
): ConvertHandlersToDefinitions<T> => {
  const definitions: any = Object.entries(serviceHandlers).reduce((acc, [key, fn]) => {
    acc[key] = {
      request: {},
      response: {}
    }
    return acc
  }, {})
  return definitions
}

// Definition of the RPC service
const helloServiceHandlers = {
  getHello: async (request: { language: string }) => {
    const { language } = request
    if (language === 'Spanish') return { text: 'Hola' }
    throw new ModuleRpcServer.ServerRpcError(
      ModuleRpcCommon.RpcErrorType.notFound,
      `language '${language}' not found`
    )
  }
}

// Implementation of an RPC server
import * as express from 'express'
import * as http from 'http'
const app = express()

export const helloServiceDefinition = createServiceDefinitions(helloServiceHandlers)
app.use(ModuleRpcProtocolServer.registerRpcRoutes(helloServiceDefinition, helloServiceHandlers))

const server = http.createServer(app).listen(4000, () => {
  console.log('server started')
})
