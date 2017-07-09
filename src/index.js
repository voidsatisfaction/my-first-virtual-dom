/** @jsx h */

if (module.hot) {
  module.hot.accept();
}

function h(type, props, ...children) {
  return { type, props: props || {}, children };
}

/* ---------- ELEMENT ------------ */

function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  setProps($el, node.props);
  node.children
    .map(createElement)
    .forEach($el.appendChild.bind($el));
  return $el;
}

function changed(node1, node2) {
  return typeof node1 !== typeof node2 ||
         typeof node1 === 'string' && node1 !== node2 ||
         node1.type !== node2.type
}

function updateElement($parent, newNode, oldNode, index=0) {
  if (!oldNode) {
    $parent.appendChild(
      createElement(newNode)
    );
  } else if (!newNode) {
    $parent.removeChild(
      $parent.childNodes[index]
    );
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    );
  } else if (newNode.type) {
    updateProps(
      $parent.childNodes[index],
      newNode.props,
      oldNode.props
    );
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }
  }
}

/* ---------- PROPS ------------ */

function isCustomProp(name) {
  return false;
}

function setBooleanProp($target, name, value) {
  if (value) {
    $target.setAttribute(name, value);
    $target[name] = true;
  } else {
    $target[name] = false;
  }
}

function setProp($target, name, value) {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    $target.setAttribute('class', value);
  } else if (typeof value === 'boolean') {
    setBooleanProp($target, name, value);
  } else {
    $target.setAttribute(name, value);
  }
}

function setProps($target, props) {
  Object.keys(props).forEach((name) => {
    setProp($target, name, props[name]);
  });
}

function removeBooleanProp($target, name) {
  $target.removeAttribute(name);
  $target[name] = false;
}

function removeProp($target, name, value) {
  if (isCustomProp($target)) {
    return;
  } else if (name === 'className') {
    $target.removeAttribute('class');
  } else if (typeof value === 'boolean') {
    removeBooleanProp($target, name);
  } else {
    $target.removeAttribute(name);
  }
}

function updateProp($target, name, newVal, oldVal) {
  if (!newVal) {
    removeProp($target, name, oldVal);
  } else if (!oldVal || newVal !== oldVal) {
    setProp($target, name, newVal);
  }
}

function updateProps($target, newProps, oldProps = {}) {
  const props = { ...newProps, ...oldProps };
  Object.keys(props).forEach((name) => {
    updateProp($target, name, newProps[name], oldProps[name]);
  });
}
/* ---------------------- */

const f = (
  <ul style="list-style: none;">
    <li className="item">item 1</li>
    <li className="item">
      <input type="checkbox" checked={true} />
      <input type="text" disabled={false} />
    </li>
  </ul>
);

const g = (
  <ul style="list-style: none;">
    <li className="item item2">item 1</li>
    <li style="background: red;">
      <input type="checkbox" checked={false}/>
      <input type="text" disabled={true}/>
    </li>
  </ul>
)

const $root = document.getElementById('root');
const $reload = document.getElementById('reload');

updateElement($root, f);
$reload.addEventListener('click', () => {
  if ($reload.className == 'active') {
    $reload.className = null;
    updateElement($root, g, f); 
  } else {
    $reload.className = 'active';
    updateElement($root, f, g);
  }
})