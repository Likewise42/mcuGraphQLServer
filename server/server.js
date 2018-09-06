import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt } from 'graphql';
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

let mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addMovie: {
            type: GraphQLString,
            args: {
                title: { type: GraphQLString },
                actorList: { type: GraphQLList(GraphQLString) },
                runTime: { type: GraphQLInt },
                characterList: { type: GraphQLList(GraphQLString) }
            },
            resolve: (value, args)=>{
                movies.mutateAddMovie(args.title, args.actorList, args.runTime, args.characterList);
                return "good";
            }
        },
        addActor: {
            type: GraphQLString,
            args: {
                name: { type: GraphQLString },
                movieList: { type: GraphQLList(GraphQLString) },
                age: { type: GraphQLInt },
                characterList: { type: GraphQLList(GraphQLString) }
            },
            resolve: (value, args)=>{
                actors.mutateAddActor(args.name, args.movieList, args.age, args.characterList);
                return "good";
            }
        },
        addCharacter: {
            type: GraphQLString,
            args: {
                name: { type: GraphQLString },
                movieList: { type: GraphQLList(GraphQLString) },
                actorList: { type: GraphQLList(GraphQLString) }
            },
            resolve: (value, args)=>{
                characters.mutateAddCharacter(args.name, args.movieList, args.actorList );
                return "good";
            }
        }
    }
});

let schema = new GraphQLSchema({ query: queryType, mutation: mutationType });

let app = express();

const PORT = process.env.PORT || process.env.NODE_PORT || 4000;
if (process.env.NODE_ENV = 'production') {
    app.use(cors());
}
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