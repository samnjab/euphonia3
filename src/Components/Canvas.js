import {useRef, useState, useEffect} from 'react';
export default function Canvas({windowDims, theme}){
    const canvasRef = useRef(null)
    class Bar{
        constructor(width, height, x, y, dy, maxHeight, color, opacity, shadowX, shadowY, shadowWidth, shadowColor){
            this.width = width
            this.height = height
            this.x = x
            this.y = y
            this.dy = dy
            this.maxHeight = maxHeight
            this.color = color
            this.opacity = opacity
            this.shadowX = shadowX
            this.shadowY = shadowY
            this.shadowWidth = shadowWidth
            this.shadowHeight = height * 4
            this.shadowColor = shadowColor
        }
        #decreasing = false
        draw(context){
            context.beginPath()
            context.globalAlpha = this.opacity
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.width, this.height)
            context.globalAlpha = this.opacity
            context.fillStyle = this.shadowColor
            context.fillRect(this.shadowX, this.shadowY, this.shadowWidth, this.shadowHeight)
            context.closePath()
        
        }
        update(context){
            this.draw(context)
            if (this.height <= - this.maxHeight) this.decreasing = true
            if (!this.decreasing){
                this.height -= this.dy
                this.shadowHeight = this.height * 4
                this.opacity += this.dy / this.maxHeight
                if (this.opacity > 0.5) this.opacity = 0.5 
            }else{
                this.height += this.dy * 2
                this.shadowHeight = this.height * 4
                this.opacity -= this.dy * 2 / this.maxHeight
                if (this.opacity < 0.1) this.opacity = 0.1 
            }
            if (this.height >= 0) this.decreasing = false
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvas.width = windowDims[0]
        canvas.height = windowDims[1]
        const barArray = []
        const colorArray =['#F7B1AB','#F7AF9D', '#2E294E', '#F8E16C','#F8E16C', '#2A324B', '#DB162F']
        let maxHeight = 100
        let width = 10
        let shadowWidth = canvas.width/15 - 10
        let maxOpacity = 0.5
        let minOpacity = 0.1
        let shadowColor = '#a6818a'
        if(theme === 'darkPink'){
            shadowColor = '#544146';

        }else if(theme === 'lightBlue'){
            shadowColor = '#D7CFB7';
            
        }else if(theme === 'darkBlue'){
            shadowColor = '#3E4A50';
        }
        for (let i=0; i < 15; i++){
            const dt = 250 - Math.random() * 100
            let height = Math.random() * 150
            const color = colorArray[Math.floor(Math.random() * colorArray.length)]
            let bar = new Bar(width, - height, (width + 5)* i + (canvas.width - (10 + 5)* 15)/2, canvas.height/2,  maxHeight/dt, maxHeight, color, height *(maxOpacity-minOpacity)/maxHeight, (shadowWidth + 10) * i, 4 * canvas.height/5, shadowWidth ,shadowColor)
            barArray.push(bar)
        }
        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height)
            barArray.forEach(bar => {
                bar.update(context)
            })
            requestAnimationFrame(animate)
        }
        animate()
        return () => cancelAnimationFrame(animate)
    },[windowDims, theme])
    return(
        <canvas ref={canvasRef} style={{maxWidth:100 + 'vw'}}></canvas>
    )

}