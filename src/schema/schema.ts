import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLList } from 'graphql';
import _ from 'lodash';

import { authors, books } from '../db/books';

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		year: { type: GraphQLInt },
		author: {
			type: AuthorType,
			resolve: (parent, args) => {
				return _.find(authors, { id: parent.authorId });
			},
		},
	}),
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		books: {
			type: new GraphQLList(BookType),
			resolve: (parent, args) => {
				return _.filter(books, { authorId: parent.id });
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve: (parent, args) => {
				return _.find(books, { id: args.id });
			},
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve: (parent, args) => {
				return _.find(authors, { id: args.id });
			},
		},
	},
});

export default new GraphQLSchema({
	query: RootQuery,
});
