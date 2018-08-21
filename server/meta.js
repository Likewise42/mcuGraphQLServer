import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLString } from 'graphql';

import * as movies from './movies';
import * as actors from './actors';
import * as characters from './characters';

let metaData = {
    totalCalls: 0,
    uniqueIps: []
}

let getMetaData = () => {
    return metaData;
}

let getRandomArticle = () => {
    let randNum = Math.random();

    let returnObject = {};

    if (randNum >= .66) {
        returnObject = movies.getRandomMovie();
        returnObject.objectType = 'movie';
    } else if (randNum >= .33) {
        returnObject = actors.getRandomActor();
        returnObject.objectType = 'actor';
    } else {
        returnObject = characters.getRandomCharacter();
        returnObject.objectType = 'character';
    }

    return returnObject;
}

let onCall = (req, res, next) => {
    metaData.totalCalls++;

    if (metaData.uniqueIps.indexOf(req.ip) == -1) {
        metaData.uniqueIps.push(req.ip);
    }

    next();
}

let metaType = new GraphQLObjectType({
    name: 'Meta',
    fields: () => ({
        totalCalls: { type: new GraphQLNonNull(GraphQLInt) },
        uniqueIps: { type: new GraphQLList(GraphQLString) }
    })
});

export {
    onCall,
    metaType,
    getMetaData,
    getRandomArticle
}