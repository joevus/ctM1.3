import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Ratings = new Mongo.Collection('ratings');

Meteor.methods({
	'ratings.insert'(data) {
		//check(resAttributes, String);

		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		var stars = data.stars;
		var resourceId = data.resourceId;

		Ratings.insert({
			stars: stars,
			resourceId: resourceId,
			owner: Meteor.userId(),
			username: Meteor.user().username,
			createdAt: new Date(),
		});
	},
});