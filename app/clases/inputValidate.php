<?php

class  Input {
    static $errors = true;
    private $state;

	static function check($arr, $on = false) {
		if ($on === false) {
			$on = $_REQUEST;
		}
		foreach ($arr as $value) {	
			if (empty($on[$value])) {
                self::throwError('Data is missing', 900);
                return false;
                break;
			}else{
                return true;
            }
        }
	}

	static function int($val, $max, $min) {
		$val = filter_var($val, FILTER_VALIDATE_INT);
		if ($val === false || $val <= $max || $val >= $min) {
			self::throwError('Invalid Integer', 901);
		}
		return $val;
	}

	static function str($val, $maxLength, $minLength) {
		if (!is_string($val) || strlen(trim($val)) > $maxLength || strlen(trim($val)) < $minLength) {
			self::throwError('Invalid String', 902);
		}
		$val = trim(htmlspecialchars($val));
		return $val;
	}

	static function bool($val) {
		$val = filter_var($val, FILTER_VALIDATE_BOOLEAN);
		return $val;
	}

	static function email($val) {
		$val = filter_var($val, FILTER_VALIDATE_EMAIL);
		if ($val === false) {
			self::throwError('Invalid Email', 903);
		}
		return $val;
	}

	static function pass($val, $maxLength, $minLength) {
		$val = filter_var($val, FILTER_VALIDATE_STRING);
		if ($val === false || strlen(trim($val)) > $maxLength || strlen(trim($val)) < $minLength) {
			self::throwError('Invalid Password', 904);
		}
		return $val;
	}

	static function url($val) {
		$val = filter_var($val, FILTER_VALIDATE_URL);
		if ($val === false) {
			self::throwError('Invalid URL', 905);
		}
		return $val;
	}

	static function throwError($error = 'Error In Processing', $errorCode = 0) {
		if (self::$errors === true) {
			throw new Exception($error, $errorCode);
		}
	}
}