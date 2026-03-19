import './style.css'

function Box_Container({ children, className, maxWidth, ...props }) {

    const mergedClasses = `container ${className || ''}`;

    return (
        <div className={mergedClasses} style={{ maxWidth: maxWidth }} {...props}>
            {children}
        </div>
    )
}

export default Box_Container