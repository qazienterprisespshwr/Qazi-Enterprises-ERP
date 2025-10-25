// Fix: Create SendIcon component.
import React from 'react';
import { Icon } from './Icon';

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </Icon>
);
