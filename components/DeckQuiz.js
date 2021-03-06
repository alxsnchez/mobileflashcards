import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { clearLocalNotification, setLocalNotification } from '../utils/helpers'

class DeckQuiz extends Component {

    state = {
        data: undefined,
        activeScreen: 0,
        isShowingAnswer: false,
        isShowingResult: false
    }

    componentDidMount() {
        const { questions } = this.props.navigation.state.params
        const array = questions.map(() => undefined)
        this.setState({
            data: array
        })
        clearLocalNotification()
            .then(setLocalNotification())
    }

    handleNextQuestion(result) {
        const { data, activeScreen, isShowingAnswer } = this.state

        data[activeScreen] = result
        this.setState({
            data
        }, () => {
            if (data.length - 1 > activeScreen) {
                this.setState({
                    activeScreen: activeScreen + 1,
                    isShowingAnswer: false
                })
            } else {
                this.setState({
                    isShowingResult: true
                })
            }
        }) 
    }

    handleShowAnswer() {
        this.setState({
            isShowingAnswer: true
        })
    }

    calculateResult() {
        const { data } = this.state
        const correctAnswer = data.filter(answer => answer === true)

        if (correctAnswer.length === data.length) {
            return 'You nailed it! All your answers were correct.'
        }

        if (correctAnswer.length === 1) {
            return `You got ${correctAnswer.length} question correct from a total of ${data.length} questions.`
        } else {
            return `You got ${correctAnswer.length} questions correct from a total of ${data.length} questions.`
        }
        
    }

    render() {
        const { activeScreen, isShowingAnswer, isShowingResult } = this.state
        const { questions } = this.props.navigation.state.params

        return (
            <View style={{flex: 1}}>
                { isShowingResult
                ? <View style={styles.container}>
                    <Text style={[styles.main, {flex: 1, textAlign: 'center'}]}>{this.calculateResult()}</Text>
                    <TouchableOpacity style={[styles.submitBtn, {backgroundColor: '#fff', marginBottom: 20}]} onPress={() => this.setState({ activeScreen: 0, isShowingAnswer: false, isShowingResult: false})}>
                        <Text style={{fontSize: 16, textAlign: 'center', color: '#E91E63', fontWeight: 'bold'}}>RESTART QUIZ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitBtn} onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
                        <Text style={{fontSize: 16, textAlign: 'center', color: '#fff', fontWeight: 'bold'}}>BACK TO DECK</Text>
                    </TouchableOpacity>
                </View>
                : isShowingAnswer 
                    ? <View style={styles.container}>
                        <Text style={styles.counter}>{`${activeScreen + 1}/${questions.length}`}</Text>
                        <View style={styles.card}>
                            <Text style={styles.main}>{questions[activeScreen].answer}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <TouchableOpacity style={[styles.submitBtn, {flex: 1, marginRight: 8}]} onPress={() => this.handleNextQuestion(false)}>
                                <Text style={{fontSize: 16, textAlign: 'center', color: '#FFF', fontWeight: 'bold'}}>INCORRECT</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.submitBtn, {flex: 1, marginLeft: 8}]} onPress={() => this.handleNextQuestion(true)}>
                                <Text style={{fontSize: 16, textAlign: 'center', color: '#FFF', fontWeight: 'bold'}}>CORRECT</Text>
                            </TouchableOpacity>
                        </View>   
                    </View>
                    : <View style={styles.container}>
                        <Text style={styles.counter}>{`${activeScreen + 1}/${questions.length}`}</Text>
                        <View style={styles.card}>
                            <Text style={styles.main}>{questions[activeScreen].question}</Text>
                        </View>
                        <TouchableOpacity style={styles.submitBtn} onPress={() => this.handleShowAnswer()}>
                            <Text style={{fontSize: 16, textAlign: 'center', color: '#fff', fontWeight: 'bold'}}>SHOW ANSWER</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 40,
        justifyContent: 'center',
    },
    submitBtn: {
        padding: 16,
        backgroundColor: '#E91E63',
        borderRadius: 8,
    },
    counter: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray'
    },
    main: {
        textAlign: 'center',
        fontSize: 24
    },
    card: {
        flex: 1, 
        justifyContent: 'center', 
        backgroundColor: 'white', 
        marginTop: 20, 
        marginBottom: 40,
        borderRadius: 8
    }
})


export default DeckQuiz