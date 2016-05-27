import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Topics = new Mongo.Collection('topics');
export const TopicRelationships = new Mongo.Collection('topicrelationships');

Meteor.methods({
	'topics.insert'(topic) {
		//check(resAttributes, String);

		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		var Id = Topics.insert({
			name: topic,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username,
		});

		return Id;
	},
	'topicrelationships.insert'(parentId, childId) {

		TopicRelationships.insert({
			parentId: parentId,
			childId: childId,
		});

	},
});