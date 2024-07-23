from .control import Control
from .pca9685 import PCA9685


class MotorControl(Control):
    __MID = 1500
    __RANGE = 500

    def __init__(self):
        self._pwm = PCA9685()
        self._pwm.set_pwm_freq(50)
        self.left_offset = 150
        self.right_offset = 150
        self.left_pin = 3
        self.right_pin = 8

        # initialize motor
        self.__set_left(self.__MID)
        self.__set_right(self.__MID)

    def __set_left(self, wave: float):
        self._pwm.set_servo_pulse(self.left_pin, wave + self.left_offset)

    def __set_right(self, wave: float):
        self._pwm.set_servo_pulse(self.right_pin, wave + self.right_offset)

    def set_speed(self, direction: float, speed: float):
        """
        control the motor speed by converting direction and speed to PWM wave of two motor
        :param direction: [-1, 1], negative is left
        :param speed: [-1, 1], negative is reverse
        """
        super().set_speed(direction, speed)

        direction_factor = self.__RANGE * direction / 2 * 0.9
        speed_factor = self.__RANGE * speed / 2

        self.__set_left(self.__MID + direction_factor + speed_factor)
        self.__set_right(self.__MID - direction_factor + speed_factor)
