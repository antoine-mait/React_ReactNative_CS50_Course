import React from 'react';
import {
  View,
  Button,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import Constants from 'expo-constants';

let id = 0;

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appContainer: {
    paddingTop: Constants.statusBarHeight,
  },
  fill: {
    flex: 1,
  },
});

const Todo = (props) => (
  <View style={[styles.todoContainer, styles.fill]}>
    <Switch value={props.todo.checked} onValueChange={props.onToggle} />
    <Button onPress={props.onDelete} title="Delete" />
    <Text>{props.todo.text}</Text>
  </View>
);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: [],
    };
  }

  addTodo = () => {
    const text = `TODO number ${id}`;
    this.setState({
      todos: [...this.state.todos, { id: id, text: text, checked: false }],
    });
    id++;
  };

  removeTodo = (id) => {
    this.setState({
      todos: this.state.todos.filter((todo) => todo.id !== id),
    });
  };

  toggleTodo = (id) => {
    this.setState({
      todos: this.state.todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      ),
    });
  };

  render() {
    return (
      <View style={styles.appContainer}>
        <Text>Todo count: {this.state.todos.length}</Text>
        <Text>
          Todo unchecked: {this.state.todos.filter((t) => !t.checked).length}
        </Text>

        <Button onPress={this.addTodo} title="Add TODO" />

        <ScrollView style={styles.fill}>
          {this.state.todos.map((todo) => (
            <Todo
              key={todo.id}
              onToggle={() => this.toggleTodo(todo.id)}
              onDelete={() => this.removeTodo(todo.id)}
              todo={todo}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}
