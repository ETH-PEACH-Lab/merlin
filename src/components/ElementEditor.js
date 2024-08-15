import React, { useEffect } from 'react';
import './ElementEditor.css';

export const ElementEditor = ({svgElement, updateInspector}) => {
    useEffect(()=>{
        initListener();
    }, [svgElement])

    const initListener = () => {
        if(svgElement){
            svgElement.addEventListener('click', onElementClick);
        }
    }

    const onElementClick = (e) =>{
        let target = e.target;
    
        // Traverse up the DOM tree to find the nearest <g class="unit"> element
        while (target && !target.classList.contains('unit')) {
            target = target.parentElement;
        }
        const unitID = target? target.id: null;

        // Traverse up the DOM tree to find the nearest <g class="component"> element
        while (target && !target.classList.contains('component')) {
            target = target.parentElement;
        }
        const componentID = target? target.id: null;

        // Traverse up the DOM tree to find the nearest <g class="page"> element
        while (target && !target.classList.contains('page')) {
            target = target.parentElement;
        }
        const pageID = target?target.id: null;

        updateInspector(unitID, componentID, pageID)
    }
    return <div></div>
}