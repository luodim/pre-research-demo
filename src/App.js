import React, {
  Component
} from 'react';
import './App.css';
import * as PIXI from 'pixi.js'
import {
  easing,
  tween
} from 'popmotion'

import bg from './assets/bg_wall.jpg'
import hand from './assets/hand.png'

const colorList = [
  0xE1F5FE, 0xB3E5FC, 0x81D4FA, 0xE0F7FA, 0xB2EBF2, 0x80DEEA, 0xE0F2F1,
  0xB2DFDB, 0x80CBC4, 0x84FFFF, 0x18FFFF, 0xA7FFEB, 0x64FFDA, 0xE8F5E9,
  0xC8E6C9, 0xF1F8E9, 0xDCEDC8, 0xF9FBE7, 0xF0F4C3, 0xE6EE9C
]

const width = document.body.clientWidth
const height = document.body.clientHeight

class App extends Component {

  componentDidMount() {
    this.initCanvas()
  }

  initCanvas() {
    const app = new PIXI.Application({
      width: width,
      height: height,
      antialias: true,
      transparent: false,
      resolution: 1
    })
    app.renderer.autoResize = true
    app.renderer.backgroundColor = 0x01579B
    document.getElementById('main').appendChild(app.view)
    this.stage = app.stage
    this.addBg()
  }

  addBg() {
    PIXI.loader.add([bg, hand]).load(() => {
      let sprite = new PIXI.Sprite(PIXI.loader.resources[bg].texture)
      this.hand = new PIXI.Sprite(PIXI.loader.resources[hand].texture)
      this.stage.addChild(sprite)
      sprite.x = -100
      console.log(sprite.x)
      this.initTargets()
    })
  }

  initTargets() {
    this.scrollContainer = new PIXI.Container()
    let horizalPos = [width / 3, width / 3 * 2]
    let offsetUnit = height / 8
    let offsetY = 0
    for (let i = 0; i < 20; i++) {
      let target = new Target(this.scrollContainer, {
        x: horizalPos[i % 2],
        y: offsetY += offsetUnit
      }, i)
    }
    this.hand.visible = false
    this.stage.addChild(this.scrollContainer)
    this.stage.addChild(this.hand)
    this.startScroll()
    this.startShowHand()
  }

  startShowHand() {
    this.timer = setInterval(() => {
      this.handAnim()
    }, 2500)
  }

  handAnim() {
    this.hand.visible = true
    let x = getRandom(width / 3, width /3 * 2 - 50)
    let y = getRandom(height / 8, height / 8 * 7)
    tween({
      from: {x:0, y: height},
      to: {x: x, y: y},
      duration: 1800,
      ease: easing.easeIn
    }).start({
      update: (v) => this.handleUpdate(v),
      complete: () => this.handleComplete()
    })
  }

  handleUpdate(v) {
    this.hand.x = v.x
    this.hand.y = v.y
  }

  handleComplete() {
    this.hand.visible = false
    this.hand.x = 0
    this.hand.y = height
  }

  startScroll() {
    tween({
      from: 0,
      to: {
        y: 1827
      },
      duration: 10000,
      ease: easing.linear,
      flip: Infinity
    }).start((v) => {
      this.scrollContainer.y = -v.y
    })
  }

  render() {
    return ( <div id='main' className = 'main-container' ></div>)
  }
}

const getRandom = (a, b) => {
  return Math.floor(Math.random() * (b + 1 - a) + a)
}

  class Target {
    constructor(container, pos, index) {
      this.container = container
      this.pos = pos
      this.index = index
      this.drawTarget()
    }

    drawTarget() {
      let circle = new PIXI.Graphics()
      circle.beginFill(colorList[this.index])
      circle.drawCircle(this.pos.x, this.pos.y, height / 10)
      circle.endFill()
      this.container.addChild(circle)
      console.log(`x:${circle.x} y:${circle.y}`)
    }
  }


  export default App