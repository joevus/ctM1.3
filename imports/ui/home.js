import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Resources } from '../api/resources.js';
import { Topics } from '../api/topics.js';
import { TopicRelationships } from '../api/topics.js';

import './home.html';
import './resource.js';
//don't think I need topic.js here., do I need the others?
//import './topic.js';

Template.home.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('resources');
	Meteor.subscribe('topics');
	Meteor.subscribe('topicrelationships');
});

Template.home.helpers({
	resources() {
		const instance = Template.instance();
		if (instance.state.get('hideCompleted')) {
			// if hide completed is checked, filter resources
			console.log("hide completed checked");
			return Resources.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
		}
		// if topTopic is set, 
		// filter out resources that don't match with selected topic
		var topTopicId = instance.state.get('topTopicInst');
		if (topTopicId) {
			console.log("topTopicId is truthy: " + topTopicId);
			return Resources.find({topicId: topTopicId})
		}
		console.log("topTopicId is falsy: " + topTopicId);
		return Resources.find();
		//return Resources.find({}, {sort: {createdAt: -1} });
	},
	topics() {
		return Topics.find({});
	},
	incompleteCount() {
		return Resources.find({checked: { $ne: true } }).count();
	},
	scienceDoc() {
		return Topics.findOne({name: "science"});
	},
	techDoc() {
		return Topics.findOne({name: "technology"});
	},
	engDoc() {
		return Topics.findOne({name: "engineering"});
	},
	mathDoc() {
		return Topics.findOne({name: "math"});
	}
});

Template.home.events({
	'click .firstTp'(event, instance) {

		// Get database IDs from input tag name
		const target = event.target;
		const topicId = $(target).attr('name');
		// check whether there were children
		let childCheck = false;

		// make button for each child of selected topic
		let children = TopicRelationships.find({parentId: topicId}).forEach(function(myDoc) {
			// there were children
			childCheck = true;
			let child = Topics.findOne({_id: myDoc.childId});
			//console.log(child);
			let btn = document.createElement("input");
			// for buttons, name = child's id, value = child's name
			$(btn).attr('type', 'button').attr('name', myDoc.childId).val(child.name);
			btn.classList.add('subTopic', 'topic');
			$(btn).appendTo('.middleRow');
		});
		console.log(children);
		console.log('hello again');
		// add selected topic to top
		$('.topTopic').empty();
		let topBtn = document.createElement("input");
		$(topBtn).attr('type', 'button').attr('value', target.value).attr('name', topicId);
		$(topBtn).appendTo('.topTopic');
		topBtn.classList.add("topBtn");

		// Hide initial STEM topics
		$('.firstTp').hide();
		
		// rerun resources helper
		instance.state.set('topTopicInst', topicId);
	},

	'click #backButton'(event, instance) {
		// Get database IDs from input tag name
		const target = event.target;
		let topTopicId = $('.topBtn').attr('name');
		console.log("topTopicId: " + topTopicId);
		// empty top topic
		$('.topTopic').empty();
		// relation with top topic as parent
		let relation = TopicRelationships.findOne({parentId: topTopicId});
		// what to do when topTopic is not a parent? like "chemistry"
		// relation with top topic as child, gp for "grand parent"
		let gpRelation = TopicRelationships.findOne({childId: topTopicId});
		if(topTopicId == null) {/* we are on STEM screen, do nothing */
			console.log("relation: " + relation);
		} else{
			// new top topic Id, starts out falsy, for reactive 'topTopicInst'
			let newTopId = ""; 
			if(gpRelation == null) {
				// return to STEM screen
				$('.firstTp').show();
				$('.subTopic').remove();
			} else {
				let children = TopicRelationships.find({parentId: gpRelation.parentId}).forEach(function(myDoc) {
					let child = Topics.findOne({_id: myDoc.childId});
					let btn = document.createElement('input');
					// for buttons, name = child's id, value = child's name
					$(btn).attr('type', 'button').attr('name', child._id).val(child.name);
					btn.classList.add('subTopic', 'topic');
					$(btn).appendTo('.middleRow');
				});
				// add top topic
				let topBtn = document.createElement("input");
				let gpTopic = Topics.findOne({_id: gpRelation.parentId});
				$(topBtn).attr('type', 'button').attr('value', gpTopic.name).attr('name', gpTopic._id);
				$(topBtn).appendTo('.topTopic');
				topBtn.classList.add("topBtn");
				// new top topic Id
				newTopId =  gpTopic._id;
				console.log('gpTopic.name: ' + newTopId);
			} 
			// trigger rerun of resources helper
			instance.state.set('topTopicInst', newTopId);
		}
		
	},
	'click .subTopic'(event, instance) {

		// Get database IDs from input tag name
		const target = event.target;
		const topicId = $(target).attr('name');
		// remove old subtopics
		$(".subTopic").remove();
		// make button for each child of selected topic
		let children = TopicRelationships.find({parentId: topicId}).forEach(function(myDoc) {
			let child = Topics.findOne({_id: myDoc.childId});
			//console.log(child);
			let btn = document.createElement("input");
			// for buttons, name = child's id, value = child's name
			$(btn).attr('type', 'button').attr('name', child._id).val(child.name);
			btn.classList.add('subTopic', 'topic');
			$(btn).appendTo('.middleRow');
		});
		console.log(children);
		console.log('hello again');
		// add selected topic to top
		$('.topTopic').empty();
		let topBtn = document.createElement("input");
		$(topBtn).attr('type', 'button').attr('value', target.value).attr('name', topicId);
		$(topBtn).appendTo('.topTopic');
		topBtn.classList.add("topBtn");

		// rerun resources helper
		instance.state.set('topTopicInst', topicId);	
		
	}


/* Old code for reference
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
*/
});

