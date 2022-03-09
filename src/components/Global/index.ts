import ReactDOM from 'react-dom';
import React from 'react';

//显示组件
export function showModal(modalComponent: React.FC<any>, props?: any) {
  const container = document.createElement('div');
  container.className = 'popup-content';
  const param = { modalVisible: true, ...props };
  ReactDOM.render(React.createElement(modalComponent, param), container);
  document.body.appendChild(container);
}

//关闭弹框
export function closeModal() {
  const nodeList = document.getElementsByClassName('popup-content');
  if (!nodeList || nodeList.length <= 0) {
    return;
  }
  const node = nodeList[nodeList.length - 1];
  const unmountResult = ReactDOM.unmountComponentAtNode(node);
  if (unmountResult && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
