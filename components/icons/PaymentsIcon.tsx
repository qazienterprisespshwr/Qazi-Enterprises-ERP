
import React from 'react';
import { Icon } from './Icon';

export const PaymentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </Icon>
);
