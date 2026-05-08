import './style.css'
import Button from '../button'

function Card({ children, className, ...props}) {

    const mergedClasses = `card ${className || ''}`;

    return (
        <div className={mergedClasses}{...props}>
            {children}
        </div>
    )
}

export default Card