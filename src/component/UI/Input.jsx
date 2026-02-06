let Input = (props)=>{
    return(
        <input maxLength={props.maxLength} className={props.className} placeholder={props.placeholder} value={props.value} onChange={props.onChange} onInput={props.onInput} type={props.type}></input>
    )
}
export default Input