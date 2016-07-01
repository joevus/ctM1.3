import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Comments = new Mongo.Collection('comments');

Meteor.methods({
	'comments.insert'(data) {
		//check(resAttributes, String);

		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		var body = data.body;
		var resourceId = data.resourceId;

		Comments.insert({
			body: body,
			resourceId: resourceId,
			owner: Meteor.userId(),
			username: Meteor.user().username,
			createdAt: new Date(),
		});
	},
});