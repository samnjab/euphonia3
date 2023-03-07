import {useRef, useState, useEffect} from 'react';
export default function Canvas({windowDims, theme}){
    const canvasRef = useRef(null)
    class Bar{
        constructor(width, height, x, y, dy, maxHeight, color){
            this.width = width
            this.height = height
            this.x = x
            this.y = y
            this.dy = dy
            this.maxHeight = maxHeight
            this.color = color
        }
        draw(context){
            context.beginPath()
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.width, this.height)
            context.closePath()
        }
        update(context){
            this.draw(context)
            if (this.height >= this.maxHeight) this.height = 0
            this.height += this.dy
        }

    }
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvas.width = windowDims[0]
        canvas.height = windowDims[1]
        const barArray = []
        const colorArray =['#F7B1AB', '#2E294E', '#F8E16C', '#2A324B', '#818AA3']
        for (let i=0; i < 15; i++){
            const dy = (Math.random() - 0.5)
            const color = colorArray[Math.floor(Math.random() * colorArray.length)]
            let bar = new Bar(5, 0, 5 * i, 100, dy, 100, color)
            barArray.push(bar)
        }
        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height)
            barArray.forEach(bar => {
                bar.update(context)
            })
            requestAnimationFrame(animate)
        }
        // animate()
        return () => cancelAnimationFrame(animate)
    },[windowDims, theme])
    return(
        <canvas ref={canvasRef} style={{maxWidth:100 + 'vw'}}></canvas>
    )

}