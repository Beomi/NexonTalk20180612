import * as d3 from 'd3'
import axios from 'axios'
import {svgAsPngUri} from 'save-svg-as-png'

document.addEventListener('DOMContentLoaded', e => {

    const svg = d3.select('#app')
        .append('svg')
        .attr('width', '500px')
        .attr('height', '500px')
        .attr("class", "svg-component")

    const color = '#fff'

    const line = d3.line()
        .curve(d3.curveBasis)

    const drawObj = {
        isDown: false,
        dataPoints: [],
        currentPath: null,
    }

    svg.on("mousedown", function () {
        drawObj.isDown = true
    })

    svg.on("mousemove", function () {
        if (drawObj.isDown) {
            drawObj.dataPoints.push(
                [d3.event.x, d3.event.y]
            )
            if (!drawObj.currentPath) {
                drawObj.currentPath = svg.append("path")
                    .attr("class", "currentPath")
                    .style("stroke-width", '50px')
                    .style("stroke", color)
                    .style("fill", "none")
            }
            drawObj.currentPath
                .datum(drawObj.dataPoints)
                .attr("d", line)
        }
    })

    svg.on("mouseup", function () {
        drawObj.isDown = false
        drawObj.currentPath.attr("class", "oldPath")
        drawObj.dataPoints = []
        drawObj.currentPath = null
        if (++drawObj.color > 19) {
            drawObj.color = 0
        }
    })

    const submitButton = document.querySelector('#submitButton')
    const resultBox = document.querySelector('#result')

    submitButton.addEventListener('click', e => {
        e.preventDefault()
        svgAsPngUri(
            document.querySelector('#app svg')
        ).then(data => {
            const pngData = data.split(',')[1]
            console.log(pngData)
            // console.log(btoa(pngData))
            axios.post(
                'https://0nealxuc23.execute-api.ap-northeast-2.amazonaws.com/v1',
                {base64Image: pngData}
            ).then(res => {
                return res.data
            }).then(json => {
                console.log(json)
                resultBox.innerText = json['result']
            })
        })
    })
})
