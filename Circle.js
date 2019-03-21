import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated, ART, StyleSheet, View } from 'react-native'

import Arc from './Shapes/Arc'
import withAnimation from './withAnimation'

const CIRCLE = Math.PI * 2

const AnimatedSurface = Animated.createAnimatedComponent(ART.Surface)
const AnimatedArc = Animated.createAnimatedComponent(Arc)

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    overflow: 'hidden'
  }
})

export class ProgressCircle extends Component {
  static propTypes = {
    animated: PropTypes.bool,
    borderColor: PropTypes.string,
    borderWidth: PropTypes.number,
    color: PropTypes.string,
    children: PropTypes.node,
    direction: PropTypes.oneOf(['clockwise', 'counter-clockwise']),
    fill: PropTypes.string,
    formatText: PropTypes.func,
    indeterminate: PropTypes.bool,
    countDownTimer: PropTypes.bool,
    originProgress: PropTypes.number,
    progress: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.instanceOf(Animated.Value)
    ]),
    rotation: PropTypes.instanceOf(Animated.Value),
    showsText: PropTypes.bool,
    isDownTimer: PropTypes.bool,
    size: PropTypes.number,
    style: PropTypes.any,
    strokeCap: PropTypes.oneOf(['butt', 'square', 'round']),
    textStyle: PropTypes.any,
    start: PropTypes.number,
    thickness: PropTypes.number,
    unfilledColor: PropTypes.string,
    endAngle: PropTypes.number
  }

  static defaultProps = {
    borderWidth: 1,
    color: 'rgba(0, 122, 255, 1)',
    direction: 'clockwise',
    formatText: progress => `${Math.round(progress * 100)}%`,
    progress: 0,
    showsText: false,
    originProgress: 0,
    size: 40,
    thickness: 3,
    endAngle: 0.9
  }

  constructor (props, context) {
    super(props, context)

    this.progressValue = 0
  }

  componentWillMount () {
    if (this.props.animated) {
      this.props.progress.addListener(event => {
        this.progressValue = event.value
        if (this.props.showsText || this.progressValue === 1) {
          this.forceUpdate()
        }
      })
    }
  }

  render () {
    const {
            animated,
            borderColor,
            borderWidth,
            color,
            children,
            direction,
            fill,
            formatText,
            indeterminate, countDownTimer,
            progress,
            rotation,
            showsText,
            start,
            size,
            style,
            strokeCap,
            textStyle,
            thickness,
            isDownTimer,
            unfilledColor,
            originProgress,
            endAngle,
            ...restProps
          } = this.props

    const border = borderWidth || (indeterminate ? 1 : 0)

    const radius = size / 2 - border
    const offset = {
      top: border,
      left: border
    }

    const textOffset = border + thickness
    const textSize = size - textOffset * 2

    const Surface = rotation ? AnimatedSurface : ART.Surface
    const Shape = animated ? AnimatedArc : Arc
    const progressValue = animated ? this.progressValue : progress

    const angle = animated
        ? Animated.multiply(progress, CIRCLE)
      : progress * CIRCLE
  
    return (
      <View style={[styles.container, style]} {...restProps}>
        <Surface
          width={size}
          height={size}
          style={{
            transform: [
              {
                rotate:
                  indeterminate && rotation
                    ? rotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                    : '0deg'
              }
            ]
          }}
        >
          {unfilledColor && progressValue !== 1 ? (
            <Shape
              fill={fill}
              radius={radius}
              offset={offset}
              startAngle={0}
              endAngle={CIRCLE}
              direction={direction}
              stroke={unfilledColor}
              strokeWidth={thickness}
            />
          ) : (
            false
          )}


          {countDownTimer && originProgress > 0 ? (
            <Shape
              fill={fill}
              radius={radius}
              offset={offset}
              startAngle={0}
              endAngle={start * CIRCLE}
              direction={direction}
              stroke={'#ff884c'}
              strokeCap={'round'}
              strokeWidth={thickness}
            />
          ) : (
            false
          )}



          {countDownTimer && isDownTimer && start > 0 ? (
              <Shape
                fill='#000000'
                radius={radius}
                offset={{
                 top: -0.55,
                  left: -0.55
                }}
                startAngle={start * CIRCLE}
                endAngle={start * CIRCLE}
                direction={direction}
                stroke={'white'}
                strokeCap={'round'}
                strokeWidth={thickness - 0.5}
              />
          ) : (
            false
          )}
          {countDownTimer && isDownTimer && start > 0 ? (
            <Shape
              fill={fill}
              radius={radius}
              offset={{
               top: start <= 0.5 ? (start >= 0.25 ? - start * 3 : start * 3) : (start >= 0.75 ? + start / 12 : - start / 0.4),
               left: start <= 0.5 ? (start > 0.25 ? start : start * 4) : (start > 0.75 ? - start * 1.5 : - start / 0.4)
              }}
              startAngle={start * CIRCLE}
              endAngle={start * CIRCLE}
              direction={direction}
              stroke={'red'}
              strokeCap={'round'}
              strokeWidth={thickness - 3}
            />
          ) : (
            false
          )}

          {countDownTimer && progressValue > 0 ? (
            <Shape
              fill={fill}
              radius={radius}
              offset={offset}
              endAngle={(progress._value + 0.01) * CIRCLE}
              direction={direction}
              stroke={'white'}
              strokeCap={'round'}
              strokeWidth={thickness}
            />
          ) : (
            false
          )}

          {!indeterminate && progress._value > 0 ? (
            <Shape
              fill={fill}
              radius={radius}
              offset={offset}
              startAngle={0}
              endAngle={angle}
              direction={direction}
              stroke={color}
              strokeCap={strokeCap}
              strokeWidth={thickness}
            />
          ) : (
            false
          )}


          {border ? (
            <Arc
              radius={size / 2}
              startAngle={0}
              endAngle={(indeterminate ? endAngle * 2 : 2) * Math.PI}
              stroke={borderColor || color}
              strokeCap={strokeCap}
              strokeWidth={border}
            />
          ) : (
            false
          )}
        </Surface>
        {!indeterminate && showsText ? (
          <View
            style={{
              position: 'absolute',
              left: textOffset,
              top: textOffset,
              width: textSize,
              height: textSize,
              borderRadius: textSize / 2,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {children}
          </View>
        ) : (
          false
        )}
      </View>
    )
  }
}

export default withAnimation(ProgressCircle)
