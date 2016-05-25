import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './resource.html';

Template.resource.helpers({
	isOwner() {
		return this.owner === Meteor.userId();
	},
});

Template.resource.events({
	'click .toggle-checked'() {
		// Set the checked property to the opposite of its current value
		Meteor.call('tasks.setChecked', this._id, !this.checked);
	},
	'click .delete' () {
		Meteor.call('tasks.remove', this._id);
	},
	'click .toggle-private'() {
		Meteor.call('tasks.setPrivate', this._id, !this.private);
	},
});