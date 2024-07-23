import asyncio
import concurrent.futures
import json
import logging

import websockets

logger = logging.getLogger(__name__)


def check_data_validity(data: dict) -> bool:
    if not isinstance(data, dict) or "type" not in data:
        logger.warning(f"Invalid data: {data}")
        return False

    return True


class Server:
    def __init__(self):
        try:
            from control.motor import MotorControl
        except ImportError:
            from control import Control as MotorControl

            logger.warning("Motor module not found, using dummy control")

        self.lock = asyncio.Lock()
        self.executor = concurrent.futures.ThreadPoolExecutor()

        self.control = MotorControl()

    def data_action(self, data: dict):
        match data["type"]:
            case "control":
                return self.control.set_speed, data["direction"], data["speed"]
            case _:
                raise ValueError(f"Invalid data type: {data['type']}")

    async def handler(self, websocket: websockets.WebSocketServerProtocol):
        await self.lock.acquire()

        async for message in websocket:
            try:
                data = json.loads(message)
            except (json.JSONDecodeError, ValueError) as e:
                logger.error(f"Error decoding JSON: {e}")
                await websocket.send("error: Invalid JSON")
                continue

            if not check_data_validity(data):
                await websocket.send("error: Invalid data")
                continue

            logger.debug(f"Received data: {data}")

            try:
                self.executor.submit(*self.data_action(data))
            except ValueError as e:
                await websocket.send("error: Invalid data")
                continue

        self.lock.release()


async def _main():
    server = Server()
    addr = ("0.0.0.0", 9876)

    async with websockets.serve(server.handler, *addr):
        logger.info("Server started, ctrl-c to stop")
        await asyncio.Future()


def main():
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO
    )

    try:
        asyncio.run(_main())
    except KeyboardInterrupt:
        logger.info("Server stopped")


if __name__ == "__main__":
    main()
