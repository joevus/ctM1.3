import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Resources } from '../api/resources.js';
import { Topics } from '../api/topics.js';

import './resource.js';
import './topic.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('resources');
	Meteor.subscribe('topics');
});

Template.body.helpers({
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

Template.body.events({
	'submit .new-task'(event) {
		// Prevent default browser form submit
		event.preventDefault();

		// Get value from form element
		const target = event.target;
		const resName = $(target).find('[name=text]').val();
		const resDesc = $(target).find('[name=descrip]').val();
		const resURL = $(target).find('[name=url]').val();
		var resource = {
			name: resName,
			description: resDesc,
			url: resURL
		};

		// Insert a task into the collection
		Meteor.call('resources.insert', resource);

		// Clear form
		target.text.value = ''; target.descrip.value = ''; target.url.value = '';
	},
	'submit .new-topic'(event) {
		// Prvent default browser form submit
		event.preventDefault();

		// Get value from form element
		const target = event.target;
		var topic = $(target).find('[name=topic]').val();

		// Insert topic into Topics collection
		Meteor.call('topics.insert', topic);

		//Clear form
		target.topic.value = '';
	},
	'change .hide-completed input' (event, instance) {
		instance.state.set('hideCompleted', event.target.checked);
	},
});