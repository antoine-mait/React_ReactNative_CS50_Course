import React from 'react';
import { View, Button, TextInput, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from 'react-native'; import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { OMDB_API_KEY } from '@env';

class SearchMovieName extends React.Component {
    state = {
        name: ''
    }

    handleNameChange = name => {
        this.setState({ name })
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 25, borderColor: 'teal' }}>
                <TextInput
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.handleNameChange}
                    placeholder="Movie Name"
                />

                <Button
                    title="Search Movie Name"
                    onPress={() => {
                        this.props.navigation.navigate('Movies Results', { movieName: this.state.name });
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
        marginBottom: 5,
    },
    tinyLogo: {
        width: 100,
        height: 150,
    },
    movieContainer: {
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    }
})
class MoviesResult extends React.Component {
    state = {
        movieData: null,
        loading: true
    }

    componentDidMount() {
        const { movieName } = this.props.route.params;
        const url = `http://www.omdbapi.com/?s=${movieName}&apikey=${OMDB_API_KEY}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Search) {
                    this.setState({ movieData: data.Search, loading: false });
                } else {
                    this.setState({ movieData: [], loading: false });
                }
            })
            .catch(error => {
                console.log('Error:', error);
                this.setState({ movieData: [], loading: false });
            });
    }

    render() {
        const { movieData, loading } = this.state;

        if (loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Loading...</Text>
                </View>
            );
        }

        if (!movieData || movieData.length === 0) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>No movies found</Text>
                    <Button
                        title="Return to Search"
                        onPress={() => this.props.navigation.navigate('Movies Browser')}
                    />
                </View>
            );
        }

        const sortedData = [...movieData].sort((a, b) => a.Year - b.Year);

        return (
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 100}}>
                    {sortedData.map((item) => (
                        <TouchableOpacity
                            key={item.imdbID}
                            style={styles.movieContainer}
                            onPress={() => {
                                this.props.navigation.navigate('Movie', {
                                    movieID: item.imdbID,
                                    movieName: this.props.route.params.movieName
                                });
                                console.log("Pressed on " + item.Title)
                            }}>
                            <Image
                                style={styles.tinyLogo}
                                source={{ uri: item.Poster }}
                            />
                            <View style={{ marginLeft: 10, flex:1, flexShrink:1 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.Title}</Text>
                                <Text>Year: {item.Year}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <Button
                        title="Return to Search"
                        onPress={() => this.props.navigation.navigate('Movies Browser')}
                    />
                </ScrollView>
            </View >
        )
    }
}

class MovieCard extends React.Component {
    state = {
        movieData: null,
        loading: true
    }

    componentDidMount() {
        const { movieID } = this.props.route.params;
        const url = `http://www.omdbapi.com/?i=${movieID}&apikey=${OMDB_API_KEY}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // console.log(data)
                    this.setState({ movieData: data, loading: false });
                } else {
                    this.setState({ movieData: null, loading: false });
                }
            })
            .catch(error => {
                console.log('Error:', error);
                this.setState({ movieData: null, loading: false });
            });
    }

    render() {
        const { movieData, loading } = this.state;
        const { movieName } = this.props.route.params;

        if (loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Loading...</Text>
                </View>
            );
        }
        if (!movieData) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Movie not found</Text>
                    <Button
                        title="Return to Search"
                        onPress={() => this.props.navigation.navigate('Movies Browser')}
                    />
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 100 }}>
                    <View
                        key={movieData.imdbID}
                        style={styles.movieContainer}
                    >
                        <Image
                            style={styles.tinyLogo}
                            source={{ uri: movieData.Poster }}
                        />
                        <View style={{ marginLeft: 10 , flex:1}}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{movieData.Title}</Text>
                            <Text>
                                <Text style={{ fontWeight: 'bold' }}>Released: </Text>
                                {movieData.Year}
                            </Text>
                            <Text>Duration: {movieData.Runtime}</Text>
                            <Text>Ratings:</Text>
                            {movieData.Ratings && movieData.Ratings.map((rating, index) => (
                                <Text key={index}>  {rating.Source}: {rating.Value}</Text>
                            ))}
                            <Text>Synopsy: {movieData.Plot}</Text>
                            <Text>Actors: {movieData.Actors}</Text>
                            <Text>Directed By: {movieData.Director}</Text>
                        </View>
                    </View>

                    <Button
                        title="Return to Search"
                        onPress={() => this.props.navigation.navigate('Movies Results', { movieName: movieName })}
                    />
                </ScrollView>
            </View >
        )
    }
}

const Stack = createStackNavigator();


function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Movies Browser" component={SearchMovieName} />
            <Stack.Screen name="Movies Results" component={MoviesResult} />
            <Stack.Screen name="Movie" component={MovieCard} />
        </Stack.Navigator>
    )
}

export default class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <MyStack />
            </NavigationContainer>
        )
    }
}