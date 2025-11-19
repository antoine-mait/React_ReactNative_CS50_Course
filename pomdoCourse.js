import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
} from 'react-native';


const styles = StyleSheet.create({
  appContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  count:{
    fontSize:48,
  }
});


class CountEvenNumbers extends React.Component{
  shouldComponentUpdate(nextProps){
    return !(nextProps.count % 2)
  }
  render(){
    return(
      <Text style={styles.count}>{this.props.count}</Text>
    )
  }
}
class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      count:0,
    };
  }
  componentDidMount(){
      this.interval = setInterval(this.inc,1000)
  }

  componentWillUnmount(){
    clearInterval(this.interval)
  }
  
  inc = () => {
  this.setState(prevState => ({
    count : prevState.count + 1,
  }))
}

  render() {
    return (
      <View>
        <CountEvenNumbers count={this.state.count}/>
      </View>
    );
  }
}

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      showCounter:true,
    }
  }
  
  toggleCounter = () => this.setState(prevState => ({
    showCounter : !prevState.showCounter, 
  }))
  
  render(){
    if (this.state.showCounter){
      return (
        <View style={styles.appContainer}>
          <Button title="toggle" onPress={this.toggleCounter} />
          <Counter /> 
        </View>
      )
    } else {
      return (
        <View style={styles.appContainer}>
          <Button title="toggle" onPress={this.toggleCounter} />
        </View>
      )
    }
  }
}