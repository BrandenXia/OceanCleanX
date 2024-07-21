import math
import time

import smbus2 as smbus


class PCA9685:
    # Registers/etc.
    __SUBADR1 = 0x02
    __SUBADR2 = 0x03
    __SUBADR3 = 0x04
    __MODE1 = 0x00
    __PRESCALE = 0xFE
    __LED0_ON_L = 0x06
    __LED0_ON_H = 0x07
    __LED0_OFF_L = 0x08
    __LED0_OFF_H = 0x09
    __ALLLED_ON_L = 0xFA
    __ALLLED_ON_H = 0xFB
    __ALLLED_OFF_L = 0xFC
    __ALLLED_OFF_H = 0xFD

    def __init__(self, address: int = 0x40, debug: bool = False):
        self.bus = smbus.SMBus(1)
        self.address = address
        self.debug = debug
        if self.debug:
            print("Reseting PCA9685")
        self.__write(self.__MODE1, 0x00)

    def __write(self, reg, value):
        """Writes an 8-bit value to the specified register/address"""
        self.bus.write_byte_data(self.address, reg, value)
        if self.debug:
            # print("I2C: Write 0x%02X to register 0x%02X" % (value, reg))
            pass

    def __read(self, reg):
        """Read an unsigned byte from the I2C device"""
        result = self.bus.read_byte_data(self.address, reg)
        if self.debug:
            print("I2C: Device 0x%02X returned 0x%02X from reg 0x%02X" % (self.address, result & 0xFF, reg))
        return result

    def set_pwm_freq(self, freq):
        """Sets the PWM frequency"""
        prescaleval = 25e6  # 25MHz
        prescaleval /= 4096.0  # 12-bit
        prescaleval /= float(freq)
        prescaleval -= 1.0
        if self.debug:
            print("Setting PWM frequency to %d Hz" % freq)
            print("Estimated pre-scale: %d" % prescaleval)
        prescale = math.floor(prescaleval + 0.5)
        if self.debug:
            print("Final pre-scale: %d" % prescale)

        oldmode = self.__read(self.__MODE1)
        newmode = (oldmode & 0x7F) | 0x10  # sleep
        self.__write(self.__MODE1, newmode)  # go to sleep
        self.__write(self.__PRESCALE, int(math.floor(prescale)))
        self.__write(self.__MODE1, oldmode)
        time.sleep(0.005)
        self.__write(self.__MODE1, oldmode | 0x80)

    def set_pwm(self, channel, on, off):
        """Sets a single PWM channel"""
        self.__write(self.__LED0_ON_L + 4 * channel, on & 0xFF)
        self.__write(self.__LED0_ON_H + 4 * channel, on >> 8)
        self.__write(self.__LED0_OFF_L + 4 * channel, off & 0xFF)
        self.__write(self.__LED0_OFF_H + 4 * channel, off >> 8)
        if self.debug:
            # print("channel: %d  LED_ON: %d LED_OFF: %d" % (channel, on, off))
            pass

    def set_servo_pulse(self, channel, pulse):
        """Sets the Servo Pulse,The PWM frequency must be 50HZ"""
        pulse_length = 1e6
        pulse_length /= 50
        pulse_length /= 4096
        pulse = int(pulse / pulse_length)  # PWM frequency is 50HZ,the period is 20000us
        self.set_pwm(channel, 0, pulse)


if __name__ == '__main__':
    pwm = PCA9685(0x40, debug=True)
    pwm.set_pwm_freq(50)
    print("start the control")
    for _ in range(3):
        pwm.set_servo_pulse(8, 1650)
        pwm.set_servo_pulse(3, 1650)
        time.sleep(1)
    try:
        while True:
            i = 1650
            pwm.set_servo_pulse(8, i)
            pwm.set_servo_pulse(3, i)
            time.sleep(0.02)
    except KeyboardInterrupt as _:
        print("Exit...")
    finally:
        pwm.set_servo_pulse(8, 0)
        pwm.set_servo_pulse(3, 0)
