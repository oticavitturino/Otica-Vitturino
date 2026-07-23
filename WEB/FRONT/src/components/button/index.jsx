import './style.css'

function Button({ children, disabled, ...props }) {

    return (
        <button {...props}>
            {children}
        </button>
    )
}

export default Button