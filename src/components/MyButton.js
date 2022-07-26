const MyButton = ({text, type, onClick})=>{
    // positive, negative말고 다른 타입이 들어왔다면 그걸 default 타입으로 바꾸거라 
    const btnType = ['positive', 'negative'].includes(type) ? type: 'default';
    
    return (
        <button className = {["MyButton", `MyButton_${btnType}`].join(" ")} onClick={onClick}>
            {text}
        </button>
    );
}

MyButton.defaultProps = {
    type: "default",
}

export default MyButton;