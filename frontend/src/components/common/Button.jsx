import React from 'react';


export default function Button({ children, onClick, variant = 'default', className = '', ...props }) {
const base = 'btn';
const variantClass = variant === 'outline' ? 'btn-outline' : 'btn-primary';


return (
<button onClick={onClick} className={`${base} ${variantClass} ${className}`} {...props}>
{children}
</button>
);
}
