import axios from 'axios';
import { createRoot } from 'react-dom/client'
import React, { Component, useState } from 'react'

const Example = (props) => {

    const fetch = () => {
        axios.get('http://localhost:80/api/test').then((res) => {
            console.log(res.data)
        })
    }

    const handleClick = () => {
        console.log(121212)
        fetch()
    }



    return (
        <>
            <button onClick={handleClick}>ボタン</button>
        </>
    )
}

export default Example

const element = document.getElementById('example-id')
if (element) {
  const props = element.dataset.props
  const reactProps = props ? JSON.parse(props) : null
  createRoot(element).render(<Example {...reactProps}/>)
}