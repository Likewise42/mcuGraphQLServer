import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLString } from 'graphql';

import * as movies from './movies';
import * as actors from './actors';

let nextId = 0;
let characterDatabase = {};
let topFive = {
    lastUpdated: 0,
    movies: []
};

let getNextId = () => {
    let returnId = nextId;
    nextId++;
    return returnId;
}

class Character {
    constructor(name, movieList, actorList) {
        this.name = name;
        this.movieList = movieList || [];
        this.actorList = actorList || [];

        this.movies = () => {
            return movies.getMovies(this.movieList);
        };

        this.actors = () => {
            return actors.getActors(this.actorList);
        };

        this.id = getNextId();

        this.timesAccessed = 0;
    }
}

const addCharacter = (name, movieList, actorList) => {
    let newCharacter = new Character(name, movieList, actorList);

    characterDatabase[newCharacter.id] = newCharacter;
}

const mutateAddCharacter = (name, movieList, actorList) => {
    let characterId = nextId;

    addCharacter(name, movieList, actorList);

    movieList.forEach((movie) => {
        movies.movieDatabase[movie].characterList.push(characterId.toString());
    })

    actorList.forEach((actor) => {
        actors.actorDatabase[actor].characterList.push(characterId.toString());
    })

}

//iron man 1
addCharacter('Tony Stark', ['0', '1', '2'], ['1']);
addCharacter('James Rhodes', ['0', '2'], ['4', '13']);
addCharacter('Pepper Potts', ['0', '2'], ['2']);
addCharacter('Obadiah Stane', ['0'], ['3']);
addCharacter('Yinsen', ['0'], ['5']);
addCharacter('Nick Fury', ['0', '2', '3'], ['6']);
addCharacter('Hugh Hefner', ['0'], ['0']);
addCharacter('Phil Coulson', ['0', '2', '3'], ['17']); //7

//incredible hulk
addCharacter('Bruce Banner', ['1'], ['7']);
addCharacter('Hulk', ['1'], ['7']);
addCharacter('Betty Ross', ['1'], ['8']);
addCharacter('Emil Blonsky', ['1'], ['9']);
addCharacter('Samuel Sterns', ['1'], ['10']);
addCharacter('Leonard Samson', ['1'], ['11']);
addCharacter('Thaddeus Ross', ['1'], ['12']);
addCharacter('Sick Man', ['1'], ['0']) //15

//iron man 2
addCharacter('Natasha Romanov', ['2'], ['14']);
addCharacter('Justin Hammer', ['2'], ['15']);
addCharacter('Ivan Vanko', ['2'], ['16']);
addCharacter('Larry King', ['2'], ['0']); //19

//thor
addCharacter('Thor Odinson', ['3'], ['18']);
addCharacter('Loki Laufeyson', ['3'], ['19']);
addCharacter('Jane Foster', ['3'], ['20']);
addCharacter('Erik Selvig', ['3'], ['21']);
addCharacter('Laufey', ['3'], ['22']);
addCharacter('Volstagg', ['3'], ['23']);
addCharacter('Heimdall', ['3'], ['24']);
addCharacter('Darcy Lewis', ['3'], ['25']);
addCharacter('Frigga', ['3'], ['26']);
addCharacter('Odin', ['3'], ['27']);
addCharacter('Clint Barton', ['3'], ['28']);
addCharacter('Truck Guy', ['3'], ['0']); //31


let characterType = new GraphQLObjectType({
    name: 'Character',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        movies: { type: new GraphQLList(movies.movieType) },
        actors: { type: new GraphQLList(actors.actorType) },
        id: { type: new GraphQLNonNull(GraphQLString) },
        timesAccessed: { type: new GraphQLNonNull(GraphQLInt) }
    })
})

let getCharacter = (id) => {
    if (id != null) {
        characterDatabase[id].timesAccessed++;
        return characterDatabase[id];
    }
}

let getRandomCharacter = () => {

    let characterLength = Object.keys(characterDatabase).length;
    let randNumber = Math.random();

    let randID = Math.floor(randNumber * characterLength);

    return getCharacter(randID);
}

let getCharacters = (ids) => {

    let returnArray = [];

    if (ids == undefined) {
        return returnArray
    }
    else if (ids == 'all') {
        Object.keys(characterDatabase).forEach(id => {
            returnArray.push(getCharacter(id));
        });
    }
    else {
        ids.forEach(id => {
            returnArray.push(getCharacter(id));
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

    return topFive.characters;
};

let updateTopFive = () => {
    topFive.lastUpdated = new Date().getTime();

    let returnArray = [];

    Object.keys(characterDatabase).forEach(id => {
        returnArray.push(getCharacter(id));
    });

    returnArray.sort((a, b) => {
        return b.timesAccessed - a.timesAccessed;
    })

    topFive.characters = returnArray.slice(0, 5);
}

export {
    characterType,
    characterDatabase,
    mutateAddCharacter,
    getCharacter,
    getRandomCharacter,
    getCharacters,
    getTopFive
}

