import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLString } from 'graphql';

import * as movies from './movies';
import * as characters from './characters';

let nextId = 0;
let actorDatabase = {};
let topFive = {
    lastUpdated: 0,
    actors: []
};

let getNextId = () => {
    let returnId = nextId;
    nextId++;
    return returnId;
}

class Actor {
    constructor(name, movieList, age, characterList) {
        this.name = name;
        this.age = age;
        this.movieList = movieList || [];
        this.characterList = characterList || [];

        this.movies = () => {
            return movies.getMovies(this.movieList);
        };

        this.characters = () => {
            return characters.getCharacters(this.characterList);
        };

        this.id = getNextId();

        this.timesAccessed = 0;
    }
}

const addActor = (name, movieList, age, characterList) => {
    let newActor = new Actor(name, movieList, age, characterList);

    actorDatabase[newActor.id] = newActor;
}

const mutateAddActor = (name, movieList, age, characterList) => {
    const actorId = nextId;

    addActor(name, movieList, age, characterList);

    movieList.forEach((movie)=>{
        movies.movieDatabase[movie].actorList.push(actorId.toString());
    })

    characterList.forEach((character)=>{
        characters.characterDatabase[character].actorList.push(actorId.toString());
    })

}

//iron man 1 actors
addActor('Stan Lee', ['0', '1', '2', '3'], 95, ['6', '15', '19', '31']);
addActor('Robert Downey Jr.', ['0', '1', '2'], 53, ['0']);
addActor('Gwyneth Paltrow', ['0', '2'], 45, ['2']);
addActor('Jeff Bridges', ['0'], 68, ['3']);
addActor('Terrence Howard', ['0'], 49, ['1']);
addActor('Shaun Toub', ['0'], 55, ['4']);
addActor('Samuel L Jackson', ['0', '2', '3'], 69, ['5']); //6

//the incredible hulk actors
addActor('Edward Norton', ['1'], 48, ['8', '9']);
addActor('Liv Tyler', ['1'], 41, ['10']);
addActor('Tim Roth', ['1'], 57, ['11']);
addActor('Tim Blake Nelson', ['1'], 54, ['12']);
addActor('Ty Burrell', ['1'], 50, ['13']);
addActor('William Hurt', ['1'], 68, ['14']); //12

//iron man 2 actors
addActor('Don Cheadle', ['2'], 53, ['1']);
addActor('Scarlett Johansson', ['2'], 33, ['16']);
addActor('Sam Rockwell', ['2'], 49, ['17']);
addActor('Mickey Rourke', ['2'], 65, ['18']); //16

//thor actors
addActor('Clark Gregg', ['0', '2', '3'], 56, ['7']);
addActor('Chris Hemsworth', ['3'], 35, ['20']);
addActor('Tom Hiddleston', ['3'], 37, ['21']);
addActor('Natalie Portman', ['3'], 37, ['22']);
addActor('Stellan Skarsgård', ['3'], 67, ['23']);
addActor('Colm Feore', ['3'], 59, ['24']);
addActor('Ray Stevenson', ['3'], 54, ['25']);
addActor('Idris Elba', ['3'], 45, ['26']);
addActor('Kat Dennings', ['3'], 32, ['27']);
addActor('Rene Russo', ['3'], 64, ['28']);
addActor('Anthony Hopkins', ['3'], 80, ['29']);
addActor('Jeremy Renner', ['3'], 47, ['30']) //28

let actorType = new GraphQLObjectType({
    name: 'Actor',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        movies: { type: new GraphQLList(movies.movieType) },
        characters: { type: new GraphQLList(characters.characterType) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        id: { type: new GraphQLNonNull(GraphQLString) },
        timesAccessed: { type: new GraphQLNonNull(GraphQLInt) }
    })
});

let getActor = (id) => {
    if (id != null) {
        actorDatabase[id].timesAccessed++;
        return actorDatabase[id];
    }

};

let getRandomActor = () => {

    let actorLength = Object.keys(actorDatabase).length;
    let randNumber = Math.random();

    let randID = Math.floor(randNumber * actorLength);

    return getActor(randID);
};

let getActors = (ids) => {

    let returnArray = [];

    if (ids == undefined) {
        return returnArray;
    }
    else if (ids == 'all') {
        Object.keys(actorDatabase).forEach(id => {
            returnArray.push(getActor(id));
        });
    }
    else {
        ids.forEach(id => {
            returnArray.push(getActor(id));
        });
    }

    return returnArray;
};

let getTopFive = () => {

    let updateTime = new Date().getTime() - topFive.lastUpdated;

    //one minute
    if (updateTime > 60000) {
        updateTopFive();
    }

    return topFive.actors;
};

let updateTopFive = () => {
    topFive.lastUpdated = new Date().getTime();

    let returnArray = [];

    Object.keys(actorDatabase).forEach(id => {
        returnArray.push(getActor(id));
    });

    returnArray.sort((a,b)=>{
        return b.timesAccessed - a.timesAccessed;
    })

    topFive.actors = returnArray.slice(0,5);
}

export {
    actorType,
    actorDatabase,
    mutateAddActor,
    getActor,
    getRandomActor,
    getActors,
    getTopFive
};

