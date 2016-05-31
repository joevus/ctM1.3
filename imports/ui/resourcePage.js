import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './resourcePage.html';

Template.resourcePage.helpers({
	isOwner() {
		return this.owner === Meteor.userId();
	},
});

Template.resourcePage.events({
	
});