import abc
import logging

logger = logging.getLogger(__name__)


class Control(abc.ABC):
    def set_speed(self, direction: float, speed: float):
        logger.info(f"speed: {speed}, direction: {direction}")
