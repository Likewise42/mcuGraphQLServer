import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLString } from 'graphql';

import * as actors from './actors';
import * as characters from './characters';

//data for adding ids to new movies
let nextId = 0;
let movieDatabase = {};
let topFive = {
    lastUpdated: 0,
    movies: []
};

let getNextId = () => {
    let returnId = nextId;
    nextId++;
    return returnId;
}

//class for the movie object
class Movie {
    constructor(title, actorList, runTime, characterList) {
        this.title = title;
        this.runTime = runTime;
        this.actorList = actorList || [];
        this.characterList = characterList || [];

        this.actors = () => {
            return actors.getActors(this.actorList)
        };

        this.characters = () => {
            return characters.getCharacters(this.characterList);
        };

        this.id = getNextId();

        this.timesAccessed = 0;
    }
}

const addMovie = (title, actorList, runTime, characterList) => {
    let newMovie = new Movie(title, actorList, runTime, characterList);

    movieDatabase[newMovie.id] = newMovie;
}

const mutateAddMovie = (title, actorList, runTime, characterList) => {
    const movieId = nextId;

    addMovie(title, actorList, runTime, characterList);

    actorList.forEach((actor) => {
        actors.actorDatabase[actor].movieList.push(movieId.toString());
    })

    characterList.forEach((character) => {
        characters.characterDatabase[character].movieList.push(movieId.toString());
    })

}

//phase 1 movies
addMovie(
    'Iron Man',
    ['0', '1', '2', '3', '4', '5', '6', '17'],
    126,
    ['0', '1', '2', '3', '4', '5', '6', '7']);
addMovie(
    'The Incredible Hulk',
    ['0', '1', '7', '8', '9', '10', '11', '12'],
    122,
    ['0', '8', '9', '10', '11', '12', '13', '14', '15']);
addMovie(
    'Iron Man 2',
    ['0', '1', '2', '6', '13', '14', '15', '16', '17'],
    125,
    ['0', '1', '2', '5', '7', '16', '17', '18', '19']);
addMovie(
    'Thor',
    ['0', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27'],
    114,
    ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '7', '5']);
/*addMovie('Captain America: The First Avenger',[],);
addMovie("Marvel's The Avengers",[],);*/

let movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        title: { type: new GraphQLNonNull(GraphQLString) },
        actors: { type: new GraphQLList(actors.actorType) },
        characters: { type: new GraphQLList(characters.characterType) },
        runTime: { type: new GraphQLNonNull(GraphQLInt) },
        id: { type: new GraphQLNonNull(GraphQLString) },
        timesAccessed: { type: new GraphQLNonNull(GraphQLInt) }
    })
})

let getMovie = (id) => {
    movieDatabase[id].timesAccessed++;
    return movieDatabase[id];
}

let getRandomMovie = () => {
    let movieLength = Object.keys(movieDatabase).length;
    let randNumber = Math.random();

    let randID = Math.floor(randNumber * movieLength);

    return getMovie(randID);
}

let getMovies = (ids) => {

    let returnArray = [];

    if (ids == undefined) {
        return returnArray;
    }
    else if (ids == "all") {
        Object.keys(movieDatabase).forEach(id => {
            returnArray.push(getMovie(id));
        });
    }
    else {
        ids.forEach(id => {
            returnArray.push(getMovie(id));
        });
    }

    return returnArray;
}

let getTopFive = () => {

    let updateTime = new Date().getTime() - topFive.lastUpdated;

    //one minute
    if (updateTime > 60000) {
        updateTopFive();
    }

    return topFive.movies;
};

let updateTopFive = () => {
    topFive.lastUpdated = new Date().getTime();

    let returnArray = [];

    Object.keys(movieDatabase).forEach(id => {
        returnArray.push(getMovie(id));
    });

    returnArray.sort((a, b) => {
        return b.timesAccessed - a.timesAccessed;
    })

    topFive.movies = returnArray.slice(0, 5);
}

export {
    movieType,
    movieDatabase,
    mutateAddMovie,
    getMovie,
    getRandomMovie,
    getMovies,
    getTopFive
};

