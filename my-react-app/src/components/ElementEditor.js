import React, { useEffect, useRef, useState } from 'react';
import './ElementEditor.css';

export const ElementEditor = ({svgElement, updateCode}) => {
    const ref = useRef(null);
    const inputRef = useRef(null);

    const [locL, setLocL] = useState(0);
    const [locT, setLocT] = useState(0);
    const [isDisplayed, setDisplay] = useState(false);
    const [content, setContent] = useState('');
    useEffect(()=>{
        initListener();
    }, [svgElement])

    const initListener = () => {
        console.log('init listener');
        if(svgElement){
            const gElements = svgElement.querySelectorAll('g.page');
            gElements.forEach(element => {
                element.addEventListener('click', onElementClick);
            });
            console.log(gElements)
        }
    }

    const onElementClick = (e) =>{
        const loc = e.target.getBBox();
        const loc_base = svgElement.getBoundingClientRect()
        const loc_m = e.target.getCTM()
        console.log(loc_m)
        console.log(e.target)
        if(ref.current){
            setLocL(loc.x)
            console.log('y:', loc.y, loc_base.y)
            console.log('x:', loc.x, loc_base.x)
            setLocT(loc.y+loc_base.y + loc_m.f - 80)
            setDisplay(true)
            inputRef.current.value = e.target.textContent
            setContent(e.target.textContent)
        }
    }

    const handleClick = () =>{
        setContent('');
        setDisplay(false);
        updateCode(inputRef.current.value)
        inputRef.current.value = '';
    }

    return <div ref={ref} id='element-editor' style={{left: `${locL}px`, top: `${locT}px`, display: `${isDisplayed?'block':'none'}`}}>
        <div id='element-editor-container'>
            <input ref={inputRef} defaultValue={content}></input>
            <button onClick={handleClick}>Update</button>
        </div>
    </div>
}