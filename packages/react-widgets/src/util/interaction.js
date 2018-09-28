import { findDOMNode } from 'react-dom';
import matches from 'dom-helpers/query/matches';

export const isInDisabledFieldset = inst => {
  let node;
  try {
    node = findDOMNode(inst);
  } catch (err) {
    /* ignore */
  }

  return !!node && matches(node, 'fieldset[disabled] *');
};

function wrap(method) {
  return function decoratedMethod(...args) {
    let { disabled, readOnly } = this.props;

    disabled =
      isInDisabledFieldset(this) || disabled == true || readOnly === true;

    if (!disabled) return method.apply(this, args);
  };
}

export let widgetEditable = (target, key, desc) => {
  if (desc.initializer) {
    let init = desc.initializer;
    desc.initializer = function() {
      return wrap(init.call(this)).bind(this);
    };
  } else desc.value = wrap(desc.value);
  return desc;
};
