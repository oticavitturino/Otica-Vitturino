import './style.css'

function List_item({ children, actions, ...props }) {
    
    return (
        <li className='list-item'{...props}>

            <span className='item-content' style={{ color: 'white' }}>
                {children}
            </span>

            {actions && (
                <div className='item-actions'>
                    {actions}
                </div>
            )}

        </li>
    )
}

export default List_item