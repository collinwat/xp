(function(ko) {

  /**
   * Convert a value to a number. When the value is found to be NaN,
   * fallback to a default value if specified, otherwise return NaN.
   */
  function numeric(value, default_) {
    value = parseFloat(value, 10);

    if (!isNaN(value))
      return value;

    if (arguments.length > 1)
      return default_;

    return NaN;
  }


  ko.extenders.numeric = function(target, options) {
    options = options || {};
    options.min = numeric(options.min, -Infinity);
    options.max = numeric(options.max, Infinity);
    options.precision = numeric(options.precision, 0);

    var multiplier = Math.pow(10, options.precision);

    var result = ko.computed({
      read: target,
      write: function(newValue) {
        var current = target();
        var newNumeric = numeric(newValue);

        newNumeric = isNaN(newNumeric) ?
          current :
          newNumeric = Math.round(newNumeric * multiplier) / multiplier;

        if (newNumeric < options.min)
          newNumeric = options.min;

        if (newNumeric > options.max)
          newNumeric = options.max;

        if (newNumeric !== current) {
          target(newNumeric);
        }
        else if (newValue !== current) {
          target.notifySubscribers(current);
        }
      }
    });

    result(target());
    return result;
  };

  ko.extenders.integer = function(target, options) {
    options = options || {};
    options.precision = 0;
    return ko.extenders.numeric(target, options);
  }

})(ko);
