import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } from 'graphql';
import cors from 'cors';

import * as movies from './movies';
import * as actors from './actors';
import * as characters from './characters';
import * as meta from './meta';

let queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: movies.movieType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (_, { id }) => {
                return movies.getMovie(id);
            }
        },
        randomMovie: {
            type: movies.movieType,
            resolve: (_) => {
                return movies.getRandomMovie();
            }
        },
        topFiveMovies: {
            type: GraphQLList(movies.movieType),
            resolve: (_) => {
                return movies.getTopFive();
            }
        },
        allMovies: {
            type: GraphQLList(movies.movieType),
            resolve: (_) => {
                return movies.getMovies("all");
            }
        },
        actor: {
            type: actors.actorType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (_, { id }) => {
                return actors.getActor(id);
            }
        },
        randomActor: {
            type: actors.actorType,
            resolve: (_) => {
                return actors.getRandomActor();
            }
        },
        topFiveActors: {
            type: GraphQLList(actors.actorType),
            resolve: (_) => {
                return actors.getTopFive();
            }
        },
        allActors: {
            type: GraphQLList(actors.actorType),
            resolve: (_) => {
                return actors.getActors("all");
            }
        },
        character: {
            type: characters.characterType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (_, { id }) => {
                return characters.getCharacter(id);
            }
        },
        topFiveCharacters: {
            type: GraphQLList(characters.characterType),
            resolve: (_) => {
                return characters.getTopFive();
            }
        },
        randomCharacter: {
            type: characters.characterType,
            resolve: (_) => {
                return characters.getRandomCharacter();
            }
        },
        /*topFiveCharacters :{
            type: GraphQLList(characters.characterType),
            resolve: (_) => {
                return characters.get
            }
        },*/
        allCharacters: {
            type: GraphQLList(characters.characterType),
            resolve: (_) => {
                return characters.getCharacters('all');
            }
        },
        meta: {
            type: meta.metaType,
            resolve: (_) => {
                return meta.getMetaData();
            }
        }
    }
});

let schema = new GraphQLSchema({ query: queryType });

let app = express();

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

//FIXES CORS ERROR
//https://forums.meteor.com/t/solved-cors-errors-with-apollo-on-meteor-1-4x/29465
let whitelist = [
    '*',
];
let corsOptions = {
    origin: function (origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));
app.use(meta.onCall);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(PORT, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Running a GraphQL API server at ${PORT}/graphql`);
});