import pino from 'pino';
import { v4 } from 'uuid';
import { LoggingContext } from './context';

export class AppLogger{

  // loggerはpinoを使うことにしているが案件に応じて変えれば良い。
  private logger = pino({
    prettyPrint:true,
    timestamp:() => {return JSON.stringify({
      time:new Date().toUTCString()
    });},
    serializers: {
      error: pino.stdSerializers.err,
    }
  })

  public context: LoggingContext

  // baseContextは一連の処理において全てのロギングのタイミングで必要な情報
  // ipアドレスや国や地域など案件に応じて設定すると良い。
  constructor(baseContext?: Omit<LoggingContext, 'id'>){
    this.context = {
      // トランザクションのidは必ず記録する必要があるので自動で設定できるようにしてある。
      id:v4(),
      ...baseContext,
    };
  }
  // フィールドが被った場合は上書きされる。
  addContext(field: string, value: string|number|Record<string, unknown>){
    this.context[field] = value;
  }
  
  debug(additionalMessage?: Record<string, unknown>){
    this.logger.debug({
      ...this.context,
      ...additionalMessage,
    });
  }
  info(additionalMessage?: Record<string, unknown>){
    this.logger.info({
      ...this.context,
      ...additionalMessage,
    });
  }
  warn(additionalMessage?: Record<string, unknown>){
    this.logger.warn({
      ...this.context,
      ...additionalMessage,
    });
  }
  error(error: Error){
    this.logger.error({
      context:this.context,
      error:error,
    });
  }

}