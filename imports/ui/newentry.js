import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Resources } from '../api/resources.js';
import { Topics } from '../api/topics.js';
import { TopicRelationships } from '../api/topics.js';

import './newentry.html';
import './resource.js';
import './topic.js';


Template.newentry.helpers({
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

Template.newentry.events({
	'submit .new-task'(event) {
		// Prevent default browser form submit
		event.preventDefault();

		// Get value from form element
		const target = event.target;
		const resName = $(target).find('[name=text]').val();
		const resDesc = $(target).find('[name=descrip]').val();
		const resURL = $(target).find('[name=url]').val();
		// Get topic id
		const resTopic = $(target).find('[name=topics]').val();
		console.log(resTopic);

		var resource = {
			name: resName,
			description: resDesc,
			url: resURL,
			topicId: resTopic,
		};

		// Insert a task into the collection
		Meteor.call('resources.insert', resource);

		// Clear form
		target.text.value = ''; target.descrip.value = ''; target.url.value = '';
	},
	'submit .new-topic'(event) {
		// Prvent default browser form submit
		event.preventDefault();

		// Get new topic from form element
		const target = event.target;
		var topic = $(target).find('[name=topic]').val();

		// Get new topic's parent Id from form element and create relationship
		var topicParentId = $(target).find('[name=topicParent]').val();

		// Insert topic into Topics collection, retrieve topic's Id
		Meteor.call('topics.insert', topic, function(err, data) {
			if (err) {
				console.log(err);
			}
			
			var topicId = data;

			if (topicParentId != "none") {
			Meteor.call('topicrelationships.insert', topicParentId, topicId);
			console.log("topic parent Id: " + topicParentId + ", topic Id: " + topicId);
		}

		});

		//Clear form
		target.topic.value = '';
	},
	'change .hide-completed input' (event, instance) {
		instance.state.set('hideCompleted', event.target.checked);
	},
});