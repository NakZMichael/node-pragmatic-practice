// import { Request, Response, RequestHandler } from 'express';
// import { v4 } from 'uuid';

// export type AppContext = {
//   requestId: string
//   [option: string]: any
// }

// export type ContextInitializer<Ctx> = () => Ctx

// export interface ILogger<Ctx>{
//   log: (ctx: Ctx) => void
// }

// export type AppHandler<Ctx> = (req: Request, res: Response, context: Ctx) => Promise<Ctx>

// // AppHandlerをRequestHandlerに変換する
// export const handlerWrapper = <Ctx>(handler: AppHandler<Ctx>, logger: ILogger<Ctx>, ctxInitializer: ContextInitializer<Ctx>): RequestHandler => {
//   return (req, res, next = function(){}) => {
//     const context = ctxInitializer();
//     handler(req, res, context).then(logger.log).catch(next);
//   };
// };

// // handlerWrapperを生成する。
// export const generateHandlerWrapper = <Ctx>(logger: ILogger<Ctx>, ctxInitializer: ContextInitializer<Ctx>): (handler: AppHandler<Ctx>) => RequestHandler => {
//   return (handler: AppHandler<Ctx>) => {
//     return handlerWrapper<Ctx>(handler, logger, ctxInitializer);
//   };
// };

// // とりあえず一番シンプルなロガー
// export class AppLogger implements ILogger<AppContext>{
//   log = (ctx: AppContext) => {
//     console.log(ctx);
//   }
// }

// export const simpleContextInitializer: ContextInitializer<AppContext> = () => {
//   return {
//     requestId: v4()
//   };
// };

// export const simpleWrapper = generateHandlerWrapper(new AppLogger(), simpleContextInitializer);

import { Request, Response, RequestHandler, NextFunction } from 'express';
import { AppLogger } from '../../logging';

export type AppHandler = (req: Request, res: Response, next: NextFunction, logger: AppLogger) => Promise<void>
export const handlerWrapper = (handler: AppHandler): RequestHandler => {
  return (req, res, next) => {
    const logger = new AppLogger();
    handler(req, res, next, logger).catch(next);
  };
};