import './style.css'

function Container({ children, className, ...props }) {

    const mergedClasses = `container ${className || ''}`;

    return (
        <div className={mergedClasses}{...props}>
            {children}
        </div>
    )
}

export default Container