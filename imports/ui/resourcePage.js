import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Resources } from '../api/resources.js';
import { Ratings } from '../api/ratings.js';

import './resourcePage.html';
import './resource.js';
import './topic.js';

// subscribe to data
Template.resourcePage.onCreated(function resourcePageOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('ratings');
	Meteor.subscribe('topics');
});

Template.resourcePage.helpers({
	isOwner() {
		return this.owner === Meteor.userId();
	},
	resUrl() {
		let resId = FlowRouter.getParam("_id");
		let doc = Resources.findOne({_id: resId});

		// made if statement so didn't get undefined error for doc
		let result;
		if(doc){result = doc.name}
		return result;
	},
	resTitle() {
		let resId = FlowRouter.getParam("_id");
		let doc = Resources.findOne({_id: resId});

		let result;
		if(doc){result = doc.name}
		return result;
	}
});

Template.resourcePage.events({
	'click #goto' () {
		let resId = FlowRouter.getParam("_id");
		let doc = Resources.findOne({_id: resId});
		//navigate to resource website
		window.open("http://" + doc.url);
	},
	'click .stars' (event, instance) {
		// Set ratings for resource.

		// Currently resource can be rated multiple times
		// by one user. In future make limit ratings to one per user, only update user's 
		// rating when user rates again.
		const target = event.target;
		let starNum = 0;
		if($(target).hasClass('star1')){
			starNum = 1;
		} else if($(target).hasClass('star2')) {
			starNum = 2;
		} else if($(target).hasClass('star3')) {
			starNum = 3;
		} else if($(target).hasClass('star4')) {
			starNum = 4;
		} else if($(target).hasClass('star5')) {
			starNum = 5;
		}
		for(var i = 1; i < 6; i++) {
			var starId = "star" + i;
			if(i <= starNum) {
				$("." + starId).attr("src", "/images/yellowStar.png");
			} else {
				$("." + starId).attr("src", "/images/star.png");
			}
		}
		// rating data
		let resId = FlowRouter.getParam("_id");

		var rating = {
			stars: starNum,
			resourceId: resId,
		};

		// Insert a resource into the collection
		Meteor.call('ratings.insert', rating);
	},
	'submit .new-comment'(event) {
		// Prevent default browser form submit
		event.preventDefault();
		console.log("submitted .comment-form");

		let resId = FlowRouter.getParam("_id");
		// Get value from form element
		const target = event.target;
		let textarea = $("textarea");
		let body = textarea.val();
		// Get topic id

		var comment = {
			body: body,
			resourceId: resId
		};

		// Insert a resource into the collection
		Meteor.call('comments.insert', comment);

		// Clear form
		textarea.val('make a comment');
	},
});