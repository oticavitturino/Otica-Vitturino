import './style.css'
import Button from '../button'

function Card({ children, className, onClick, ...props }) {

    const mergedClasses = `card ${className || ''}`;

    return (
        <div className={mergedClasses}{...props} onClick={onClick}>
            {children}
        </div>
    )
}

export default Card