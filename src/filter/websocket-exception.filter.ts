import {
    ArgumentsHost, Catch,
} from "@nestjs/common";
import {
    BaseWsExceptionFilter, WsException,
} from "@nestjs/websockets";

@Catch(WsException)
export default class WebsocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: WsException, host: ArgumentsHost) {
        console.log(exception.getError());
        super.catch(exception, host);
    }
}