import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Resources } from '../api/resources.js';
import { Topics } from '../api/topics.js';
import { TopicRelationships } from '../api/topics.js';

import './home.html';
import './resource.js';
import './topic.js';

Template.home.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('resources');
	Meteor.subscribe('topics');
});

Template.home.helpers({
	resources() {
		const instance = Template.instance();
		if (instance.state.get('hideCompleted')) {
			// if hide completed is checked, filter tasks
			return Resources.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
		}
		// Otherwise, return all of the tasks
		return Resources.find({}, {sort: {createdAt: -1} });
	},
	topics() {
		return Topics.find({});
	},
	incompleteCount() {
		return Resources.find({checked: { $ne: true } }).count();
	},
});

Template.home.events({
	
});

